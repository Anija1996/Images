import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { validateEmail, validateName, validateRequired } from "../utils/formValidation";
import "../styles/checkout.css";

const TAX_RATE = .05;
const LIMITS = { name: 80, email: 100, phone: 15, address: 200, city: 60, postal: 10, country: 60 };

export default function Delivery() {
    const navigate = useNavigate();
    const { cart, cartTotal } = useCart();
    const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", postal: "", country: "India" });
    const [touched, setTouched] = useState({});

    const validateField = (field, value = form[field]) => {
        if (field === "name") return validateName(value);
        if (field === "email") return validateEmail(value);
        if (field === "phone") {
            if (!value.trim()) return "Phone is required.";
            if (!/^[0-9+()\s-]{7,15}$/.test(value.trim())) return "Enter a valid phone number.";
            return "";
        }
        if (field === "postal") {
            if (!value.trim()) return "Postal code is required.";
            if (!/^[A-Za-z0-9 -]{4,10}$/.test(value.trim())) return "Enter a valid postal code.";
            return "";
        }
        return validateRequired(value, field[0].toUpperCase() + field.slice(1));
    };

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
        setTouched((current) => ({ ...current, [field]: true }));
    };

    const submit = (e) => {
        e.preventDefault();
        const fields = Object.keys(form);
        const invalid = fields.some((field) => validateField(field));
        setTouched(Object.fromEntries(fields.map((field) => [field, true])));
        if (invalid) return;
        localStorage.setItem("deliveryDetails", JSON.stringify(form));
        navigate("/confirm");
    };

    if (!cart.length) return <main className="checkout-empty"><h1>Your bag is empty.</h1></main>;
    const tax = cartTotal * TAX_RATE, shipping = cartTotal >= 300 ? 0 : 20, total = cartTotal + tax + shipping;

    return <main className="checkout-page"><section className="checkout-header"><p>CHECKOUT</p><h1>Delivery</h1></section><div className="checkout-grid"><form className="delivery-form" onSubmit={submit}>{Object.keys(form).map((f) => <div className="form-field" key={f}><input type={f === "email" ? "email" : "text"} maxLength={LIMITS[f]} placeholder={f.toUpperCase()} required value={form[f]} onChange={(e) => update(f, e.target.value)} className={touched[f] && validateField(f) ? "field-invalid" : ""}/><div className="field-meta"><span>{touched[f] && validateField(f)}</span><small>{form[f].length}/{LIMITS[f]}</small></div></div>)}<button type="submit">CONTINUE</button></form><aside className="checkout-summary"><h2>ORDER</h2>{cart.map((i)=><div key={`${i.id}-${i.size}-${i.color}`}><span>{i.name} × {i.quantity}</span><strong>${i.price*i.quantity}</strong></div>)}<hr/><div><span>Subtotal</span><strong>${Math.round(cartTotal*100)/100}</strong></div><div><span>Tax</span><strong>${Math.round(tax*100)/100}</strong></div><div><span>Shipping</span><strong>{shipping?`$${Math.round(shipping*100)/100}`:"Complimentary"}</strong></div><div><span>Total</span><strong>${Math.round(total*100)/100}</strong></div></aside></div></main>;
}
