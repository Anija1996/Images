import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import "../styles/cart.css";

function Cart() {
    const { cart, cartCount, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    return (
        <main className="cart-page">
            <section className="cart-header">
                <p>YOUR SELECTION</p>
                <h1>Shopping Bag</h1>
                <span>{cartCount} {cartCount === 1 ? "item" : "items"}</span>
            </section>

            {cart.length === 0 ? (
                <section className="empty-cart">
                    <h2>Your bag is currently empty.</h2>
                    <Link to="/products" className="primary-button">SHOP COLLECTION</Link>
                </section>
            ) : (
                <section className="cart-layout">
                    <div className="cart-list">
                        {cart.map((item) => <CartItem key={`${item.id}-${item.size}-${item.color}`} item={item} />)}
                        <button className="clear-cart" onClick={clearCart}>CLEAR BAG</button>
                    </div>

                    <aside className="cart-summary">
                        <h2>SUMMARY</h2>
                        <div><span>Subtotal</span><strong>${cartTotal}</strong></div>
                        <div><span>Shipping</span><strong>{cartTotal >= 300 ? "Complimentary" : "$20"}</strong></div>
                        <div className="summary-total"><span>Total</span><strong>${cartTotal + (cartTotal >= 300 ? 0 : 20)}</strong></div>
                        <button className="checkout-button" onClick={() => navigate("/delivery")}>CHECKOUT</button>
                        <p>Complimentary global shipping and returns on orders over $300.</p>
                    </aside>
                </section>
            )}
        </main>
    );
}

export default Cart;