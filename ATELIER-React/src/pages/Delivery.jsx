import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/checkout.css";

function Delivery() {
    const navigate = useNavigate();
    const { cart, cartTotal } = useCart();
    const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", postal: "", country: "India" });

    if (!cart.length) {
        return <main className="checkout-empty"><h1>Your bag is empty.</h1></main>;
    }

    const submit = (event) => {
        event.preventDefault();
        localStorage.setItem("deliveryDetails", JSON.stringify(form));
        navigate("/confirm");
    };

    return (
        <main className="checkout-page">
            <section className="checkout-header">
                <p>CHECKOUT</p>
                <h1>Delivery</h1>
            </section>
            <div className="checkout-grid">
                <form className="delivery-form" onSubmit={submit}>
                    <input placeholder="FULL NAME" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <input type="email" placeholder="EMAIL" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <input placeholder="PHONE" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    <input placeholder="ADDRESS" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                    <div className="two-fields">
                        <input placeholder="CITY" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                        <input placeholder="POSTAL CODE" required value={form.postal} onChange={(e) => setForm({ ...form, postal: e.target.value })} />
                    </div>
                    <input placeholder="COUNTRY" required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                    <button type="submit">CONTINUE</button>
                </form>
                <aside className="checkout-summary">
                    <h2>ORDER</h2>
                    {cart.map((item) => <div key={`${item.id}-${item.size}-${item.color}`}><span>{item.name} × {item.quantity}</span><strong>${item.price * item.quantity}</strong></div>)}
                    <hr />
                    <div><span>Total</span><strong>${cartTotal + (cartTotal >= 300 ? 0 : 20)}</strong></div>
                </aside>
            </div>
        </main>
    );
}

export default Delivery;