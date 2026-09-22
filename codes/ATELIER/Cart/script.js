console.log("cart script.js is connected");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let discount = 0;
let discountCode = "";
const emptyCart = document.querySelector(".empty-cart-container");
function formatMoney(amount) {
    return Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
function displayEmptyCart() {
    emptyCart.className = "empty-cart-container container text-center d-flex flex-column justify-content-center align-items-center flex-grow-1 py-5";
    emptyCart.innerHTML = `
        <span class="material-symbols-outlined empty-cart-icon mb-3">shopping_bag</span>
        <h1 class="empty-cart-title mb-2">YOUR CART IS EMPTY</h1>
        <p class="empty-cart-text mb-4">Looks like you haven't added anything to your cart yet.</p>
        <a href="../Product-View/product-view.html" class="btn btn-shop text-decoration-none">EXPLORE COLLECTION</a>
    `;
}
function calculateSubtotal() {
    return cart.reduce(function(total,item) {
        const quantity = item.quantity || 1;
        return total + Number(item.price) * quantity;
    },0);
}
function calculateTotal() {
    return calculateSubtotal() - discount;
}
function displayCart() {
    if(cart.length === 0) {
        displayEmptyCart();
        return;
    }
    emptyCart.className = "cart-page container-fluid flex-grow-1 py-5";
    emptyCart.innerHTML = `
        <div class="cart-page-inner">
            <div class="cart-header">
                <h1>Your Cart</h1>
                <p>${cart.length} ${cart.length === 1 ? "item" : "items"} ready for checkout.</p>
                <a href="../Product-View/product-view.html" class="continue-shopping">CONTINUE SHOPPING</a>
            </div>
            <div class="cart-divider"></div>
            <div class="cart-content d-flex flex-column flex-lg-row gap-5">
                <div class="cart-products flex-grow-1">
                    ${cart.map(function(item) {
                        const quantity = item.quantity || 1;
                        const itemTotal = Number(item.price) * quantity;
                        return `
                            <div class="cart-product d-flex" data-id="${item.id}">
                                <div class="cart-product-image-container flex-shrink-0">
                                    <img src="../Product-View/${item.image}" alt="${item.name}" class="cart-product-image">
                                </div>
                                <div class="cart-product-details flex-grow-1 d-flex flex-column justify-content-between">
                                    <div class="cart-product-info">
                                        <h2>${item.name}</h2>
                                        <p>Color: ${item.color || "Noir"}</p>
                                        <p>Size: ${item.size || "OS"}</p>
                                    </div>
                                    <div class="quantity-box d-flex align-items-center">
                                        <button type="button" class="quantity-btn decrease-btn" data-id="${item.id}">−</button>
                                        <span class="quantity">${quantity}</span>
                                        <button type="button" class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                                    </div>
                                </div>
                                <div class="cart-product-right d-flex flex-column align-items-end justify-content-between">
                                    <button type="button" class="remove-item" data-id="${item.id}" aria-label="Remove ${item.name}">×</button>
                                    <p class="product-total">$${formatMoney(itemTotal)}</p>
                                </div>
                            </div>
                        `;
                    }).join("")}
                </div>
                <div class="order-summary flex-shrink-0" style="background-color:#C4C7C74D;">
                    <h2>ORDER SUMMARY</h2>
                    <div class="discount-section">
                        <label for="discount">DISCOUNT CODE</label>
                        <div class="discount-input d-flex">
                            <input type="text" id="discount" placeholder="Enter code" value="${discountCode}">
                            <button type="button" id="apply-discount">APPLY</button>
                        </div>
                    </div>
                    <div class="price-details">
                        <div class="d-flex justify-content-between">
                            <span>Subtotal</span>
                            <span>$${formatMoney(calculateSubtotal())}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Discount</span>
                            <span id="discount-amount">${discount > 0 ? "-$" + formatMoney(discount) : "$0.00"}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Shipping</span>
                            <span>Calculated at next step</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Tax</span>
                            <span>Calculated at next step</span>
                        </div>
                    </div>
                    <div class="cart-total-row d-flex justify-content-between">
                        <span>Total</span>
                        <strong id="cart-total">$${formatMoney(calculateTotal())}</strong>
                    </div>
                    <button type="button" class="checkout-btn w-100">PROCEED TO CHECKOUT</button>
                    <div class="checkout-notes">
                        <div class="checkout-note">
                            <span class="material-symbols-outlined">local_shipping</span>
                            <span>Complimentary shipping on orders over $1000.</span>
                        </div>
                        <div class="checkout-note">
                            <span class="material-symbols-outlined">lock</span>
                            <span>Secure checkout process.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    addCartEvents();
}
function addCartEvents() {
    document.querySelectorAll(".increase-btn").forEach(function(button) {
        button.addEventListener("click",function() {
            const productId = Number(button.dataset.id);
            const item = cart.find(function(item) {
                return item.id === productId;
            });
            if(item) {
                item.quantity = (item.quantity || 1) + 1;
                localStorage.setItem("cart",JSON.stringify(cart));
                displayCart();
            }
        });
    });
    document.querySelectorAll(".decrease-btn").forEach(function(button) {
        button.addEventListener("click",function() {
            const productId = Number(button.dataset.id);
            const item = cart.find(function(item) {
                return item.id === productId;
            });
            if(item) {
                item.quantity = (item.quantity || 1) - 1;
                if(item.quantity <= 0) {
                    cart = cart.filter(function(product) {
                        return product.id !== productId;
                    });
                }
                localStorage.setItem("cart",JSON.stringify(cart));
                displayCart();
            }
        });
    });
    document.querySelectorAll(".remove-item").forEach(function(button) {
        button.addEventListener("click",function() {
            const productId = Number(button.dataset.id);
            cart = cart.filter(function(item) {
                return item.id !== productId;
            });
            localStorage.setItem("cart",JSON.stringify(cart));
            displayCart();
        });
    });
    const applyDiscount = document.querySelector("#apply-discount");
    if(applyDiscount) {
        applyDiscount.addEventListener("click",function() {
            const discountInput = document.querySelector("#discount");
            discountCode = discountInput.value.trim().toUpperCase();
            const subtotal = calculateSubtotal();
            if(discountCode === "ATELIER10") {
                discount = subtotal * 10 / 100;
            } else if(discountCode === "ATELIER20") {
                discount = subtotal * 20 / 100;
            } else {
                discount = 0;
            }
            document.querySelector("#discount-amount").textContent = discount > 0 ? "-$" + formatMoney(discount) : "$0.00";
            document.querySelector("#cart-total").textContent = "$" + formatMoney(calculateTotal());
        });
    }
    const checkoutButton = document.querySelector(".checkout-btn");
    if(checkoutButton) {
        checkoutButton.addEventListener("click",function() {
            window.location.href = "../Delivery/delivery.html";
        });
    }
}
displayCart();