/**
 * @param {number|string|null} [categoryId=null]
 */
export async function getProducts(categoryId = null) {
    try {
        let url = '/api/products';
        if (categoryId) {
            url += `?category=${categoryId}`;
        }

        const res = await fetch(url)
        if (!res.ok) {
            throw new Error("Failed to fetch products");
        }
        const { products } = await res.json()
        return products
    } catch (error) {
        return { error: "Failed to fetch products" }
    }
}

export async function getProduct(id) {
    try {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) {
            throw new Error(`Failed to fetch product ${id}`);
        }
        const { product } = await res.json()
        return product
    } catch (error) {
        return { error: `Failed to fetch product ${id}` }
    }
}
