import axios from "axios";
import { productData } from "../data/products";

const api = axios.create({
    baseURL: "/data/",
    timeout: 5000,
});

export async function getProducts() {
    try {
        const response = await api.get("products.json");

        if (!Array.isArray(response.data)) {
            throw new Error("Products data is not an array.");
        }

        return response.data;
    } catch (error) {
        return productData;
    }
}

export async function getProductById(id) {
    const products = await getProducts();
    return products.find((product) => product.id === Number(id)) || null;
}
