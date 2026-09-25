import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/checkout.css";

function Confirm() {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();
    const [delivery, setDelivery] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("deliveryDetails");
        setDelivery(saved ? JSON.parse(saved) : null);
    }, []);

    const placeOrder = () => {
        const order = {
            id: `AT-${Date.now()}`,
            items: cart,
            total: cartTotal >= 300 ? cartTotal : cartTotal + 20,
            delivery,
            date: new Date().toISOString(),
        };
        localStorage.setItem("lastOrder", JSON.stringify(order));
        clearCart();
        navigate("/");
    };

    if (!delivery || !cart.length) {
        return (
            <main className="checkout-empty">
                <h1>No order to confirm.</h1>
                <Link to="/products" className="primary-button">SHOP COLLECTION</Link>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <section className="checkout-header">
                <p>FINAL STEP</p>
                <h1>Confirm Order</h1>
            </section>
            <div className="confirmation-card">
                <h2>Delivery Details</h2>
                <p>{delivery.name}</p>
                <p>{delivery.address}, {delivery.city}, {delivery.postal}</p>
                <p>{delivery.country}</p>
                <p>{delivery.email}</p>
                <div className="confirmation-total">
                    <span>Total</span>
                    <strong>${cartTotal >= 300 ? cartTotal : cartTotal + 20}</strong>
                </div>
                <button onClick={placeOrder}>PLACE ORDER</button>
            </div>
        </main>
    );
}

export default Confirm;