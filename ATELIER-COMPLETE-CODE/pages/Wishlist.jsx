import { useState } from "react";
import { Link } from "react-router-dom";
import { productData } from "../data/products";
import ProductCard from "../components/ProductCard";
import "../styles/shop.css";

function Wishlist() {
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem("wishlist");
        try {
            const parsed = saved ? JSON.parse(saved) : [1, 4];
            return Array.isArray(parsed) ? parsed : [1, 4];
        } catch {
            localStorage.removeItem("wishlist");
            return [1, 4];
        }
    });

    const products = productData.filter((product) => wishlist.includes(product.id));

    const removeItem = (id) => {
        const next = wishlist.filter((item) => item !== id);
        setWishlist(next);
        localStorage.setItem("wishlist", JSON.stringify(next));
    };

    return (
        <main className="shop-page">
            <section className="shop-header"><p>SAVED PIECES</p><h1>Wishlist</h1><span>{products.length} pieces</span></section>
            {products.length ? (
                <section className="shop-products"><div className="row g-4">
                    {products.map((product) => <div className="col-6 col-md-4 col-lg-3" key={product.id}>
                        <div className="wishlist-item">
                            <button className="wishlist-remove" onClick={() => removeItem(product.id)} aria-label={`Remove ${product.name}`}>×</button>
                            <ProductCard product={product} />
                        </div>
                    </div>)}
                </div></section>
            ) : <section className="empty-results"><p>Your wishlist is empty.</p><Link to="/products">SHOP COLLECTION</Link></section>}
        </main>
    );
}

export default Wishlist;
