import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { requireLogin } from "../utils/auth";

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        try {
            const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
            setSaved(Array.isArray(wishlist) && wishlist.includes(product.id));
        } catch {
            setSaved(false);
        }
    }, [product.id]);

    const handleAddToBag = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!requireLogin(navigate, `/products/${product.id}`)) return;
        addToCart(product);
    };

    const handleWishlist = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!requireLogin(navigate, `/products/${product.id}`)) return;
        try {
            const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
            const current = Array.isArray(wishlist) ? wishlist : [];
            const next = current.includes(product.id) ? current.filter(id => id !== product.id) : [...current, product.id];
            localStorage.setItem("wishlist", JSON.stringify(next));
            setSaved(next.includes(product.id));
            window.dispatchEvent(new Event("wishlistchange"));
        } catch {
            setSaved(false);
        }
    };

    return (
        <article className="product-card">
            <div className="product-card-image-wrap">
                <Link to={`/products/${product.id}`} className="text-decoration-none text-dark product-card-link">
                    <div className="product-image">
                        <img src={product.image} alt={product.name} />
                        {product.newProduct && <span className="new-badge">NEW</span>}
                    </div>
                </Link>
                <button type="button" className="product-wishlist-btn" onClick={handleWishlist} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}>
                    <span className="material-symbols-outlined">favorite_border</span>
                </button>
            </div>
            <Link to={`/products/${product.id}`} className="text-decoration-none text-dark product-card-info-link">
                <div className="product-info">
                    <p className="product-name">{product.name}</p>
                    <p className="product-price">${product.price}</p>
                </div>
            </Link>
            <button className="product-quick-add" onClick={handleAddToBag}>ADD TO BAG</button>
        </article>
    );
}

export default ProductCard;
