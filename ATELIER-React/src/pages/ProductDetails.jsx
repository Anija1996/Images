import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { productData } from "../data/products";
import { useCart } from "../context/CartContext";
import "../styles/product-details.css";

const ASSETS = "https://raw.githubusercontent.com/Anija1996/Images/feature/img/assets/";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [size, setSize] = useState("");
    const [color, setColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError("");

        getProductById(id)
            .then((data) => {
                if (!active) return;
                const fallback = productData.find((item) => item.id === Number(id));
                const result = data || fallback;
                if (!result) {
                    setError("Product not found.");
                    setProduct(null);
                    return;
                }
                setProduct(result);
                setSize(result.id === 1 ? "EU 38" : result.sizes?.[0] || "");
                setColor(result.id === 1 ? "ALABASTER" : result.colors?.[0] || "");
            })
            .catch(() => {
                const fallback = productData.find((item) => item.id === Number(id));
                if (fallback) {
                    setProduct(fallback);
                    setSize(fallback.sizes?.[0] || "");
                    setColor(fallback.colors?.[0] || "");
                } else {
                    setError("Unable to load this product.");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id]);

    if (loading) return <main className="loading-page">Loading...</main>;
    if (error || !product) {
        return (
            <main className="loading-page">
                <p>{error || "Product not found."}</p>
                <Link to="/products">BACK TO SHOP</Link>
            </main>
        );
    }

    const isBlazer = product.id === 1;
    const detailPrice = isBlazer ? 1250 : product.price;
    const mainImage = isBlazer ? `${ASSETS}Structured%20Linen%20Blazer.png` : product.image;
    const thumbnails = isBlazer
        ? [
            `${ASSETS}blazer.png`,
            `${ASSETS}trouser.jpg`,
            `${ASSETS}tote.jpg`,
        ]
        : [mainImage];

    const handleAdd = () => {
        addToCart({ ...product, price: detailPrice }, quantity, size, color);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    const selectColor = (item) => setColor(item);
    const selectSize = (item) => setSize(item);

    return (
        <main className="product-view-page">
            <section className="mobile-product-section d-sm-none">
                <div className="mobile-main-image">
                    <img src={mainImage} alt={product.name} />
                </div>
                <div className="mobile-dots">
                    <span className="active" />
                    <span />
                    <span />
                </div>
                <div className="mobile-product-details">
                    <div className="mobile-product-heading">
                        <div>
                            <h1>{product.name.toUpperCase()}</h1>
                            <div>Quiet Luxury Collection</div>
                        </div>
                        <span>${detailPrice.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="mobile-color-section">
                        <div className="mobile-label">COLOR: {color}</div>
                        <div className="color-list">
                            {(product.colors || []).map((item) => (
                                <button key={item} className={`color-circle ${item.toLowerCase()} ${color === item ? "active" : ""}`} onClick={() => selectColor(item)} aria-label={item} />
                            ))}
                        </div>
                    </div>
                    <hr />
                    <div className="mobile-size-section">
                        <div className="mobile-size-heading">
                            <div className="mobile-label">SIZE</div>
                            <span>SIZE GUIDE</span>
                        </div>
                        <div className="mobile-size-grid">
                            {(product.sizes || []).slice(0, 4).map((item) => (
                                <button key={item} className={size === item ? "selected" : ""} onClick={() => selectSize(item)}>{item.replace("EU ", "")}</button>
                            ))}
                        </div>
                    </div>
                    <button className="mobile-cart-button" onClick={handleAdd}>ADD TO CART · ${detailPrice.toLocaleString()}</button>
                    {added && <div className="cart-message">ADDED TO CART</div>}
                    <details>
                        <summary>DESCRIPTION <span>⌄</span></summary>
                        <p>{product.description}</p>
                    </details>
                    <details>
                        <summary>DETAILS &amp; CARE <span>⌄</span></summary>
                        <p>Lightweight construction with structured tailoring. Dry clean recommended.</p>
                    </details>
                    <details>
                        <summary>SHIPPING &amp; RETURNS <span>⌄</span></summary>
                        <p>Complimentary shipping and easy returns within 14 days.</p>
                    </details>
                </div>
            </section>

            <section className="desktop-product-section d-none d-sm-block">
                <div className="container">
                    <div className="product-path">
                        <Link to="/">HOME</Link><span>/</span><Link to="/products">SHOP</Link><span>/</span><span>{product.name.toUpperCase()}</span>
                    </div>
                    <div className="product-details-row">
                        <div className="product-gallery">
                            <div className="product-thumbnails">
                                {thumbnails.map((image, index) => <img key={image} src={image} className={index === 0 ? "active" : ""} alt={product.name} />)}
                            </div>
                            <div className="product-main-image-wrapper">
                                <img src={mainImage} alt={product.name} className="main-product-img" />
                            </div>
                        </div>
                        <div className="product-info">
                            <h2>{product.name.toUpperCase()}</h2>
                            <span className="product-price">${detailPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            <div className="detail-color-label">COLOR: {color}</div>
                            <div className="color-list">
                                {(product.colors || []).map((item) => <button key={item} className={`color-circle ${item.toLowerCase()} ${color === item ? "active" : ""}`} onClick={() => selectColor(item)} aria-label={item} />)}
                            </div>
                            <hr />
                            <div className="size-heading"><strong>SIZE: {size}</strong><span>SIZE GUIDE</span></div>
                            <div className="size-grid">
                                {(product.sizes || []).map((item) => <button key={item} className={size === item ? "selected" : ""} onClick={() => selectSize(item)}>{item.replace("EU ", "")}</button>)}
                            </div>
                            <div className="detail-actions">
                                <div className="quantity-detail"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)}>+</button></div>
                                <button className="add-to-cart-detail" onClick={handleAdd}>ADD TO CART</button>
                                {added && <div className="cart-message">ADDED TO CART</div>}
                                <button className="wishlist-detail" onClick={() => {
                                    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
                                    if (!saved.includes(product.id)) localStorage.setItem("wishlist", JSON.stringify([...saved, product.id]));
                                }}>♡ SAVE TO WISHLIST</button>
                            </div>
                            <details><summary>DESCRIPTION <span>⌄</span></summary><p>{product.description}</p></details>
                            <details><summary>DETAILS &amp; FIT <span>⌄</span></summary><p>Lightweight construction with structured shoulders and relaxed tailoring.</p></details>
                            <details><summary>SHIPPING &amp; RETURNS <span>⌄</span></summary><p>Complimentary shipping and easy returns within 14 days.</p></details>
                            <button className="back-to-shop" onClick={() => navigate("/products")}>BACK TO SHOP</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default ProductDetails;
