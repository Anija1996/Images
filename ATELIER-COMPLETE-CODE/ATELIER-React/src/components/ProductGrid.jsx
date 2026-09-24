import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
    if (!products.length) {
        return <p className="empty-results">No products found.</p>;
    }

    return (
        <div className="row g-4">
            {products.map((product) => (
                <div className="col-6 col-md-4 col-lg-3" key={product.id}>
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}

export default ProductGrid;