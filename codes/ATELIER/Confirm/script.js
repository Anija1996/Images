console.log("cnfirm.js connected");

// Retrieve cart data and discount directly from localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const discountAmount = Number(localStorage.getItem("discount")) || 0;
const container = document.getElementById("confirmation-view-container");

function calculateSubtotal() {
  return cart.reduce((total, item) => total + Number(item.price) * (item.quantity || 1), 0);
}

function renderPage() {
  // SCENARIO 1: CART IS EMPTY
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="container px-3 px-md-4 text-center py-5" style="max-width: 500px;">
        <div class="d-inline-flex align-items-center justify-content-center rounded-circle border border-secondary p-3 mb-4">
          <span class="material-symbols-outlined text-secondary fs-2">shopping_bag</span>
        </div>
        <h1 class="display-6 fw-normal text-dark mb-3" style="font-family: 'Playfair Display', serif;">Your bag is empty</h1>
        <p class="text-secondary mb-4" style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 1.2px;">
          THERE ARE NO ACTIVE PURCHASES TO DISPLAY. PLEASE ADD ITEMS TO YOUR BAG TO PROCEED WITH CHECKOUT.
        </p>
        <a href="../Shopping-Bag/index.html" class="btn btn-dark rounded-0 border-0 px-5 py-3 text-white text-decoration-none d-inline-block" style="font-family: 'Playfair Display', serif; letter-spacing: 2px; font-size: 11px;">
          RETURN TO SHOPPING
        </a>
      </div>
    `;
    return;
  }

  // SCENARIO 2: CART HAS PRODUCTS
  const subtotal = calculateSubtotal();
  const tax = (subtotal - discountAmount) * 0.085;
  const finalTotal = subtotal - discountAmount + tax;

  // Map cart items using exact image path from localStorage matching Delivery page
  const cartItemsHTML = cart.map(item => {
    const qty = item.quantity || 1;
    const itemTotal = Number(item.price) * qty;

    return `
      <div class="py-4 border-bottom border-secondary-subtle d-flex justify-content-between align-items-center">
        <div class="d-flex gap-3 align-items-center">
          <img src="../Product-View/${item.image}" 
               alt="${item.name}" 
               style="width: 64px; height: 80px; object-fit: cover;" 
               class="bg-light flex-shrink-0">
          <div>
            <h4 class="fs-6 fw-normal text-dark mb-1" style="font-family: 'Playfair Display', serif;">${item.name}</h4>
            <p class="text-secondary mb-0" style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 1.2px;">Color: ${item.color || 'Noir'}</p>
            <p class="text-secondary mb-0" style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 1.2px;">Size: ${item.size || 'OS'}</p>
            <p class="text-secondary mb-0" style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 1.2px;">Qty: ${qty}</p>
          </div>
        </div>
        <span class="text-dark" style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 1.2px;">$${itemTotal.toFixed(2)}</span>
      </div>
    `;
  }).join("");

  // Construct view
  container.innerHTML = `
    <div class="container px-3 px-md-4" style="max-width: 680px;">
      
      <!-- Checkmark Header -->
      <div class="text-center mb-5">
        <div class="d-inline-flex align-items-center justify-content-center rounded-circle border border-dark p-2 mb-3" style="width: 44px; height: 44px;">
          <span class="material-symbols-outlined text-dark fs-5">check</span>
        </div>
        <h1 class="display-6 fw-normal text-dark mb-2" style="font-family: 'Playfair Display', serif;">Your order is confirmed</h1>
        <p class="text-secondary mb-0" style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 1.2px;">Thank you for your purchase. We have received your order and will notify you as soon as it ships.</p>
      </div>

      <!-- Order Details -->
      <div class="d-flex justify-content-between align-items-center border-top border-secondary-subtle pt-4 pb-3 mb-4">
        <div>
          <span class="text-secondary d-block text-uppercase" style="font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 1.5px;">ORDER NUMBER</span>
          <span class="fw-semibold text-dark" style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 1.2px;">#ATL-89240-X</span>
        </div>
        <div class="text-end">
          <span class="text-secondary d-block text-uppercase" style="font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 1.5px;">DATE</span>
          <span class="text-secondary" style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 1.2px;">${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      <!-- Estimated Delivery -->
      <div class="bg-body-tertiary border border-secondary-subtle p-4 mb-5">
        <div class="d-flex gap-3 align-items-start">
          <span class="material-symbols-outlined text-dark fs-4">local_shipping</span>
          <div>
            <h2 class="fs-6 fw-normal text-dark mb-1" style="font-family: 'Playfair Display', serif;">Estimated Delivery</h2>
            <p class="text-secondary small mb-0" style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 1.2px;">Arriving between <strong class="text-dark fw-semibold">Oct 28</strong> and <strong class="text-dark fw-semibold">Nov 1</strong> via Standard Shipping.</p>
          </div>
        </div>
      </div>

      <!-- Order Summary Section -->
      <div class="mb-5">
        <h3 class="text-secondary text-uppercase mb-3" style="font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 1.5px;">ORDER SUMMARY</h3>
        
        <div class="border-top border-secondary-subtle">
          ${cartItemsHTML}
        </div>

        <!-- Bill Calculations -->
        <div class="pt-4 border-top border-secondary-subtle">
          <div class="row justify-content-end">
            <div class="col-12 col-md-6 col-lg-5">
              <div class="d-flex justify-content-between mb-2" style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 1.2px;">
                <span class="text-secondary">Subtotal</span>
                <span class="text-dark">$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div class="d-flex justify-content-between mb-2" style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 1.2px;">
                <span class="text-secondary">Shipping</span>
                <span class="text-dark">Complimentary</span>
              </div>
              <div class="d-flex justify-content-between mb-3" style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 1.2px;">
                <span class="text-secondary">Taxes</span>
                <span class="text-dark">$${tax.toFixed(2)}</span>
              </div>
              <div class="d-flex justify-content-between border-top border-secondary-subtle pt-3 align-items-center">
                <span class="fw-bold text-dark text-uppercase" style="font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 1.5px;">TOTAL</span>
                <span class="fs-5 fw-semibold text-dark" style="font-family: 'Inter', sans-serif; letter-spacing: 1.2px;">$${finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="text-center pt-3">
        <button id="btn-continue-shopping" class="btn btn-dark rounded-0 border-0 px-5 py-3 text-white text-uppercase" style="font-family: 'Playfair Display', serif; letter-spacing: 2px; font-size: 11px;">
          CONTINUE SHOPPING
        </button>
      </div>

    </div>
  `;

  document.getElementById("btn-continue-shopping").addEventListener("click", () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("discount");
    localStorage.removeItem("discountCode");
    window.location.href = "../Homepage/index.html";
  });
}

renderPage();