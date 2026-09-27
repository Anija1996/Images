import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productData } from "../data/products";
import ProductCard from "../components/ProductCard";
import { isLoggedIn } from "../utils/auth";
import "../styles/shop.css";

function Wishlist() {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("/signin", { replace: true, state: { from: "/wishlist" } });
            return;
        }
        try {
            const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
            setWishlist(Array.isArray(saved) ? saved : []);
        } catch {
            localStorage.removeItem("wishlist");
            setWishlist([]);
        }
    }, [navigate]);

    const products = productData.filter((product) => wishlist.includes(product.id));

    const removeItem = (id) => {
        const next = wishlist.filter((item) => item !== id);
        setWishlist(next);
        localStorage.setItem("wishlist", JSON.stringify(next));
    };

    if (!isLoggedIn()) return null;

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
