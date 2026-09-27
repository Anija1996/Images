import axios from "axios";
import { productData } from "../data/products";

// The product JSON is served as an HTTP endpoint from the app's public folder.
// Axios is used for the request as required by the assignment.
const PRODUCTS_URL = `${import.meta.env.BASE_URL}data/products.json`;

export async function getProducts() {
    try {
        const response = await axios.get(PRODUCTS_URL, {
            timeout: 10000,
            headers: {
                Accept: "application/json",
            },
        });

        if (!Array.isArray(response.data)) {
            throw new Error("Invalid products response.");
        }

        return response.data;
    } catch (error) {
        // Keep the shop usable if the HTTP request is unavailable.
        // This prevents the product page from becoming empty because of
        // a temporary local/deployment request failure.
        if (Array.isArray(productData) && productData.length > 0) {
            return productData;
        }

        throw error;
    }
}

export async function getProductById(id) {
    const products = await getProducts();
    return products.find((product) => product.id === Number(id)) || null;
}
