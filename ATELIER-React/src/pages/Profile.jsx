import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/profile.css";

function Profile() {
    const navigate = useNavigate();
    const { cartCount } = useCart();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("currentUser");
        try {
            const parsed = saved ? JSON.parse(saved) : null;
            setUser(parsed && typeof parsed === "object" ? parsed : null);
        } catch {
            localStorage.removeItem("currentUser");
            setUser(null);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("currentUser");
        navigate("/signin");
    };

    if (!user) {
        return (
            <main className="profile-page profile-guest">
                <h1>Your Account</h1>
                <p>Please sign in to view your account.</p>
                <Link to="/signin" className="primary-button">SIGN IN</Link>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <section className="profile-header">
                <p>YOUR ATELIER</p>
                <h1>Account</h1>
            </section>
            <section className="profile-content">
                <div>
                    <span>NAME</span>
                    <h2>{user.name}</h2>
                </div>
                <div>
                    <span>EMAIL</span>
                    <h2>{user.email}</h2>
                </div>
                <div>
                    <span>BAG</span>
                    <h2>{cartCount} {cartCount === 1 ? "item" : "items"}</h2>
                </div>
                <div className="profile-actions">
                    <Link to="/wishlist">WISHLIST</Link>
                    <Link to="/cart">VIEW BAG</Link>
                    <button onClick={logout}>SIGN OUT</button>
                </div>
            </section>
        </main>
    );
}

export default Profile;