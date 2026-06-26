import Image from "next/image";
import { useCartStore, type CartItem as CartItemType } from "@/src/lib/store/useCartStore";
import "./CartItem.css";

interface CartItemProps {
  item: CartItemType;
  context?: "drawer" | "page";
}

export default function CartItem({ item, context = "drawer" }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleDecrease = () => updateQuantity(item.id, item.quantity - 1);
  const handleIncrease = () => updateQuantity(item.id, item.quantity + 1);

  return (
    <div className={`cart-item cart-item--${context}`}>
      <div className="cart-item__image-wrapper">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="cart-item__image"
        />
      </div>

      <div className="cart-item__content">
        <div className="cart-item__info">
          <div className="cart-item__header">
            <h4 className="cart-item__name">{item.name}</h4>
            <button 
              className="cart-item__remove-mobile"
              onClick={() => removeItem(item.id)}
              aria-label="Remove item"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="cart-item__category">Category: {item.category === "rug" ? "Rug" : "Curtain"}</p>
          
          <div className="cart-item__meta">
            {item.category === "rug" && item.variant && (
              <>
                {item.variant.size && <span>Size: {item.variant.size}</span>}
                {item.variant.color && <span>Color: {item.variant.color}</span>}
                {item.variant.material && <span>Material: {item.variant.material}</span>}
              </>
            )}
            {item.category === "curtain" && item.variant && (
              <>
                {(item.variant.width && item.variant.height) && (
                  <span>Size: {item.variant.width} × {item.variant.height}</span>
                )}
                {item.variant.fabric && <span>Fabric: {item.variant.fabric}</span>}
                {item.variant.lining && <span>Lining: {item.variant.lining}</span>}
                {item.variant.pleatStyle && <span>Pleat: {item.variant.pleatStyle}</span>}
              </>
            )}
          </div>
        </div>

        <div className="cart-item__bottom">
          <div className="cart-item__price">
            ₹{item.price.toLocaleString("en-IN")}
          </div>

          <div className="cart-item__actions">
            <div className="cart-item__quantity">
              <button onClick={handleDecrease} aria-label="Decrease quantity" disabled={item.quantity <= 1}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M5 12h14" />
                </svg>
              </button>
              <span>{item.quantity}</span>
              <button onClick={handleIncrease} aria-label="Increase quantity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
            
            {context === "page" && (
              <button 
                className="cart-item__remove-desktop"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
