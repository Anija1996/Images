import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <article className="product-card">
            <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
                <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {product.newProduct && <span className="new-badge">NEW</span>}
                </div>
                <div className="product-info">
                    <p className="product-name">{product.name}</p>
                    <p className="product-price">${product.price}</p>
                </div>
            </Link>
            <button className="product-quick-add" onClick={(event) => { event.preventDefault(); addToCart(product); }}>ADD TO BAG</button>
        </article>
    );
}

export default ProductCard;