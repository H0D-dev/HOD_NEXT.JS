import { NextResponse } from "next/server";
import { API_CONFIG } from "@/src/lib/api/api";

interface CartItemInput {
  product_id: number;
  variation_id?: number;
  quantity: number;
  frontend_price: number;
}

interface ValidationError {
  product_id: number;
  type: "unavailable" | "price_changed" | "out_of_stock" | "insufficient_stock";
  message: string;
  corrected_price?: number;
  available_stock?: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cartItems: CartItemInput[] = body.items;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { valid: false, errors: [{ type: "empty", message: "Cart is empty" }] },
        { status: 400 }
      );
    }

    const errors: ValidationError[] = [];
    const validatedItems: Array<{
      product_id: number;
      quantity: number;
      price: string;
      name: string;
    }> = [];

    // Fetch each product from WooCommerce to validate
    for (const item of cartItems) {
      const url = item.variation_id
        ? `${API_CONFIG.baseUrl}/wp-json/wc/v3/products/${item.product_id}/variations/${item.variation_id}?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&_fields=id,name,price,regular_price,sale_price,stock_status,stock_quantity,manage_stock,status`
        : `${API_CONFIG.baseUrl}/wp-json/wc/v3/products/${item.product_id}?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&_fields=id,name,price,regular_price,sale_price,stock_status,stock_quantity,manage_stock,status`;

      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        errors.push({
          product_id: item.product_id,
          type: "unavailable",
          message: "Product unavailable",
        });
        continue;
      }

      const product = await res.json();

      // Check if product is published (skip for variations — they inherit parent status)
      if (!item.variation_id && product.status !== "publish") {
        errors.push({
          product_id: item.product_id,
          type: "unavailable",
          message: "Product unavailable",
        });
        continue;
      }

      // Check stock
      if (product.stock_status === "outofstock") {
        errors.push({
          product_id: item.product_id,
          type: "out_of_stock",
          message: "Product is out of stock",
        });
        continue;
      }

      if (product.manage_stock && product.stock_quantity !== null) {
        if (product.stock_quantity < item.quantity) {
          errors.push({
            product_id: item.product_id,
            type: "insufficient_stock",
            message: `Only ${product.stock_quantity} left in stock`,
            available_stock: product.stock_quantity,
          });
          continue;
        }
      }

      // Check price — never trust frontend price
      const currentPrice = parseFloat(product.price);
      if (Math.abs(currentPrice - item.frontend_price) > 0.01) {
        errors.push({
          product_id: item.product_id,
          type: "price_changed",
          message: "Price updated",
          corrected_price: currentPrice,
        });
        continue;
      }

      validatedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
      });
    }

    if (errors.length > 0) {
      return NextResponse.json({ valid: false, errors, validatedItems }, { status: 200 });
    }

    return NextResponse.json({ valid: true, validatedItems }, { status: 200 });
  } catch (error) {
    console.error("Cart validation error:", error);
    return NextResponse.json(
      { valid: false, errors: [{ type: "server_error", message: "Validation failed" }] },
      { status: 500 }
    );
  }
}
