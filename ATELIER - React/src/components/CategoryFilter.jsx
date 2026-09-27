function CategoryFilter({ category, setCategory }) {
    const categories = ["All", "Shirts", "Jeans", "Outerwear", "Accessories", "Dresses", "Shoes"];

    return (
        <div className="category-filter">
            {categories.map((item) => (
                <button
                    key={item}
                    type="button"
                    className={category === item ? "active" : ""}
                    onClick={() => setCategory(item)}
                >
                    {item}
                </button>
            ))}
        </div>
    );
}

export default CategoryFilter;
