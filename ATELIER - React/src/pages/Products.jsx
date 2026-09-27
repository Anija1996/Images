import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";
import FilterDropdown from "../components/FilterDropdown";
import "../styles/shop.css";

const PRICE_OPTIONS = [
    { label: "ALL", value: "all" },
    { label: "UNDER $300", value: "under-300" },
    { label: "$300 - $500", value: "300-500" },
    { label: "$500 - $700", value: "500-700" },
    { label: "$700+", value: "700-plus" },
];

function Products() {
    const [products, setProducts] = useState([]);
    const [size, setSize] = useState("All");
    const [color, setColor] = useState("All");
    const [price, setPrice] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError("");

        getProducts()
            .then((data) => {
                if (active) setProducts(data);
            })
            .catch(() => {
                if (active) {
                    setProducts([]);
                    setError("We couldn't load the collection right now. Please try again.");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const category = searchParams.get("category") || "All";

    const sizes = useMemo(() => {
        const values = products.flatMap((product) => product.sizes || []);
        return [{ label: "ALL", value: "All" }, ...new Set(values).values()].map((item) =>
            typeof item === "string" ? { label: item, value: item } : item
        );
    }, [products]);

    const colors = useMemo(() => {
        const values = products.flatMap((product) => product.colors || []);
        return [{ label: "ALL", value: "All" }, ...new Set(values).values()].map((item) =>
            typeof item === "string" ? { label: item, value: item } : item
        );
    }, [products]);

    const filteredProducts = useMemo(() => products.filter((product) => {
        const matchesCategory = category === "All" || category === "Essentials" || product.category === category;
        const matchesSize = size === "All" || (product.sizes || []).includes(size);
        const matchesColor = color === "All" || (product.colors || []).includes(color);
        let matchesPrice = true;
        if (price === "under-300") matchesPrice = product.price < 300;
        if (price === "300-500") matchesPrice = product.price >= 300 && product.price <= 500;
        if (price === "500-700") matchesPrice = product.price > 500 && product.price <= 700;
        if (price === "700-plus") matchesPrice = product.price > 700;
        return matchesCategory && matchesSize && matchesColor && matchesPrice;
    }), [products, category, size, color, price]);

    const heading = category === "All" ? "Shop All" : category;

    return (
        <main className="shop-page">
            <section className="shop-header">
                <h1>{heading}</h1>
                <div className="shop-filters-centered">
                    <FilterDropdown label="SIZE" value={size} options={sizes} onChange={setSize} />
                    <FilterDropdown label="COLOR" value={color} options={colors} onChange={setColor} />
                    <FilterDropdown label="PRICE" value={price} options={PRICE_OPTIONS} onChange={setPrice} />
                </div>
            </section>

            <section className="shop-products">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner-border" role="status" aria-label="Loading">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p>Loading collection...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                        <button type="button" onClick={() => window.location.reload()}>TRY AGAIN</button>
                    </div>
                ) : (
                    <ProductGrid products={filteredProducts} />
                )}
            </section>
        </main>
    );
}

export default Products;
