import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";
import CategoryFilter from "../components/CategoryFilter";
import "../styles/shop.css";

function Products() {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("All");
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(() => searchParams.get("search") || "");

    useEffect(() => {
        getProducts().then(setProducts);
        const urlCategory = searchParams.get("category");
        if (urlCategory && urlCategory !== "Essentials") setCategory(urlCategory);
        const urlSearch = searchParams.get("search");
        setQuery(urlSearch || "");
    }, [searchParams]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesCategory = category === "All" || product.category === category;
            const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
            return matchesCategory && matchesQuery;
        });
    }, [products, category, query]);

    return (
        <main className="shop-page">
            <section className="shop-header">
                <p>THE COLLECTION</p>
                <h1>Shop All</h1>
                <span>{filteredProducts.length} pieces</span>
            </section>

            <section className="shop-controls">
                <CategoryFilter category={category} setCategory={setCategory} />
                <input
                    type="search"
                    placeholder="SEARCH"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    aria-label="Search products"
                />
            </section>

            <section className="shop-products">
                <ProductGrid products={filteredProducts} />
            </section>
        </main>
    );
}

export default Products;