import axios from "axios";
import { productData } from "../data/products";

const PRODUCTS_URL = "/data/products.json";

export async function getProducts() {
    try {
        const response = await axios.get(PRODUCTS_URL, {
            timeout: 10000,
            headers: {
                Accept: "application/json",
            },
        });

        if (!Array.isArray(response.data)) {
            throw new Error("Products data is not an array.");
        }

        return response.data;
    } catch (error) {
        // Keep the collection available if the static JSON request is unavailable.
        // Axios is still used for the backend/static API request as required.
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
