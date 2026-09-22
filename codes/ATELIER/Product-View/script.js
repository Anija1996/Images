console.log("product.js is connected");

const product = {
    id: 1,
    name: "Structured Linen Blazer",
    price: 1250,
    image: "images/Structured Linen Blazer.png",
    size: "EU 38",
    color: "ALABASTER"
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const addToCart = document.getElementById("addToCart");
const cartMessage = document.getElementById("cartMessage");

console.log("Button:", addToCart);
console.log("Message:", cartMessage);
console.log("Cart:", cart);

if (addToCart) {
    addToCart.addEventListener("click", function() {
        const existingProduct = cart.some(function(item) {
            return item.id === product.id;
        });

        if (existingProduct) {
            cartMessage.innerText = "Item already in cart";
        } else {
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
            cartMessage.innerText = "Item added to cart";
        }

        console.log("Updated cart:", cart);
    });
}