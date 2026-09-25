import { Link } from "react-router-dom";
import "../styles/shop.css";

const ASSETS = "https://raw.githubusercontent.com/Anija1996/Images/feature/img/assets/";

const categories = [
    ["Essentials", "Essentials.png", "All"],
    ["Shirts", "Shirt.png", "Shirts"],
    ["Jeans", "Jeans.png", "Jeans"],
    ["Outerwear", "outwear-mobile.png", "Outerwear"],
];

function Categories() {
    return (
        <main className="shop-page categories-page">
            <section className="shop-header">
                <p>THE ATELIER EDIT</p>
                <h1>Categories</h1>
                <span>Explore the collection by category</span>
            </section>

            <section className="shop-products">
                <div className="row g-4">
                    {categories.map(([name, image, category]) => (
                        <div className="col-12 col-md-6" key={name}>
                            <Link
                                to={category === "All" ? "/shop" : `/shop?category=${category}`}
                                className="category-card"
                            >
                                <img src={`${ASSETS}${image}`} alt={name} />
                                <div className="category-card-content">
                                    <h2>{name}</h2>
                                    <span>SHOP NOW</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Categories;
