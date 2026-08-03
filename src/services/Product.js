import { cache } from "react";

/**
 * @param {number|string|null} [categoryId=null]
 */
export const getProducts = cache(async (categoryId = null) => {
    try {
        let url = '/api/products';
        if (categoryId) {
            url += `?category=${categoryId}`;
        }

        const res = await fetch(url, { next: { revalidate: 300 } });
        if (!res.ok) {
            throw new Error("Failed to fetch products");
        }
        const { products } = await res.json();
        return products;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return { error: "Failed to fetch products" };
    }
});

export const getProduct = cache(async (id) => {
    try {
        const res = await fetch(`/api/products/${id}`, { next: { revalidate: 300 } });
        if (!res.ok) {
            throw new Error(`Failed to fetch product ${id}`);
        }
        const { product } = await res.json();
        return product;
    } catch (error) {
        console.error(`Failed to fetch product ${id}:`, error);
        return { error: `Failed to fetch product ${id}` };
    }
});

/**
 * @param {number|string|null} [parentId=null]
 */
export const getCategories = cache(async (parentId = null) => {
    try {
        let url = '/api/categories';
        if (parentId) {
            url += `?parent=${parentId}`;
        }
        const res = await fetch(url, { next: { revalidate: 300 } });
        if (!res.ok) {
            throw new Error("Failed to fetch categories");
        }
        const { categories } = await res.json();
        return categories;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
});

export const getCategoryIdBySlug = cache(async (slug) => {
    try {
        const res = await fetch(`/api/categories?slug=${slug}`, { next: { revalidate: 300 } });
        if (!res.ok) throw new Error("Failed to fetch category");
        const { categories } = await res.json();
        if (Array.isArray(categories) && categories.length > 0) {
            return categories[0].id;
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch category by slug:", error);
        return null;
    }
});

