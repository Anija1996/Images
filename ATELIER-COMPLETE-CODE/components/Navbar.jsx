import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/navbar.css";

function Navbar() {
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const loadUser = () => {
            const saved = localStorage.getItem("currentUser");
            try {
                setCurrentUser(saved ? JSON.parse(saved) : null);
            } catch {
                localStorage.removeItem("currentUser");
                setCurrentUser(null);
            }
        };

        loadUser();
        window.addEventListener("storage", loadUser);
        window.addEventListener("authchange", loadUser);
        return () => {
            window.removeEventListener("storage", loadUser);
            window.removeEventListener("authchange", loadUser);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-md bg-white border-bottom atelier-navbar">
            <div className="container-fluid navbar-container px-3 px-sm-4 px-lg-5">
                <button
                    className="navbar-toggler d-sm-none border-0 shadow-none p-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mobileMenu"
                    aria-controls="mobileMenu"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>

                <div className="container-left d-none d-sm-flex align-items-center">
                    <NavLink to="/products" className="nav-link">SHOP</NavLink>
                    <a href="/#categories" className="nav-link">CATEGORIES</a>
                    <a href="/#about" className="nav-link">ABOUT</a>
                </div>

                <div className="container-center">
                    <Link to="/" className="navbar-brand">ATELIER</Link>
                </div>

                <div className="container-right d-none d-lg-flex align-items-center justify-content-end">
                    <button className="btn icon-btn" aria-label="Search" onClick={() => navigate("/products?search=")}>
                        <span className="material-symbols-outlined">search</span>
                    </button>
                    <button className="btn icon-btn" aria-label="Wishlist" onClick={() => navigate("/wishlist")}>
                        <span className="material-symbols-outlined">favorite</span>
                    </button>
                    <button className="btn icon-btn position-relative" aria-label="Shopping bag" onClick={() => navigate("/cart")}>
                        <span className="material-symbols-outlined">shopping_bag</span>
                        {cartCount > 0 && <span className="cart-live-count">{cartCount}</span>}
                    </button>
                    <button
                        className="nav-link account-link border-0 bg-transparent"
                        onClick={() => navigate(currentUser ? "/profile" : "/signin")}
                    >
                        {currentUser ? <span className="material-symbols-outlined">person</span> : "LOGIN"}
                    </button>
                </div>

                <button className="btn icon-btn d-lg-none p-0 position-relative" aria-label="Shopping bag" onClick={() => navigate("/cart")}>
                    <span className="material-symbols-outlined">shopping_bag</span>
                    {cartCount > 0 && <span className="cart-live-count mobile-count">{cartCount}</span>}
                </button>
            </div>

            <div className="collapse d-sm-none" id="mobileMenu">
                <div className="mobile-menu-container">
                    <Link to="/products" className="mobile-nav-link">SHOP</Link>
                    <a href="/#categories" className="mobile-nav-link">CATEGORIES</a>
                    <a href="/#about" className="mobile-nav-link">ABOUT</a>
                    <Link to="/wishlist" className="mobile-nav-link">WISHLIST</Link>
                    <Link to={currentUser ? "/profile" : "/signin"} className="mobile-nav-link">
                        {currentUser ? "ACCOUNT" : "LOGIN"}
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;