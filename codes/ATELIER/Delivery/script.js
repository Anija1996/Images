console.log("delivery script.js is connected");

let cart=JSON.parse(localStorage.getItem("cart"))||[];
let discount=0;
let discountCode="";

const form=document.getElementById("delivery-form");
const email=document.getElementById("email");
const firstName=document.getElementById("firstName");
const lastName=document.getElementById("lastName");
const street=document.getElementById("street");
const city=document.getElementById("city");
const postal=document.getElementById("postal");
const final=document.getElementById("final");

const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const postalRegex=/^[0-9]{4,10}$/;

function showError(fieldId,message){
    document.querySelector(`#${fieldId}-error`).textContent=message;
}

function clearError(fieldId){
    document.querySelector(`#${fieldId}-error`).textContent="";
}

function validateEmail(){
    email.classList.remove("is-valid","is-invalid");

    if(email.value.trim().length===0){
        showError("email","Please enter your email address");
        email.classList.add("is-invalid");
        return false;
    }

    if(!emailRegex.test(email.value.trim())){
        showError("email","Invalid email format");
        email.classList.add("is-invalid");
        return false;
    }

    clearError("email");
    email.classList.add("is-valid");
    return true;
}

function validateFirstName(){
    firstName.classList.remove("is-valid","is-invalid");

    if(firstName.value.trim().length===0){
        showError("firstName","Please enter your first name");
        firstName.classList.add("is-invalid");
        return false;
    }

    if(firstName.value.trim().length<3){
        showError("firstName","Minimum 3 characters required");
        firstName.classList.add("is-invalid");
        return false;
    }

    clearError("firstName");
    firstName.classList.add("is-valid");
    return true;
}

function validateLastName(){
    lastName.classList.remove("is-valid","is-invalid");

    if(lastName.value.trim().length===0){
        showError("lastName","Please enter your last name");
        lastName.classList.add("is-invalid");
        return false;
    }

    if(lastName.value.trim().length<3){
        showError("lastName","Minimum 3 characters required");
        lastName.classList.add("is-invalid");
        return false;
    }

    clearError("lastName");
    lastName.classList.add("is-valid");
    return true;
}

function validateStreet(){
    street.classList.remove("is-valid","is-invalid");

    if(street.value.trim().length===0){
        showError("street","Please enter your street address");
        street.classList.add("is-invalid");
        return false;
    }

    clearError("street");
    street.classList.add("is-valid");
    return true;
}

function validateCity(){
    city.classList.remove("is-valid","is-invalid");

    if(city.value.trim().length===0){
        showError("city","Please enter your city");
        city.classList.add("is-invalid");
        return false;
    }

    clearError("city");
    city.classList.add("is-valid");
    return true;
}

function validatePostal(){
    postal.classList.remove("is-valid","is-invalid");

    if(postal.value.trim().length===0){
        showError("postal","Please enter your postal code");
        postal.classList.add("is-invalid");
        return false;
    }

    if(!postalRegex.test(postal.value.trim())){
        showError("postal","Invalid postal code");
        postal.classList.add("is-invalid");
        return false;
    }

    clearError("postal");
    postal.classList.add("is-valid");
    return true;
}

const valObj=[
    {field:email,fn:validateEmail},
    {field:firstName,fn:validateFirstName},
    {field:lastName,fn:validateLastName},
    {field:street,fn:validateStreet},
    {field:city,fn:validateCity},
    {field:postal,fn:validatePostal}
];

valObj.forEach(function(item){
    item.field.addEventListener("input",function(){
        item.fn();
    });
});

function calculateSubtotal(){
    return cart.reduce(function(total,item){
        const quantity=item.quantity||1;
        return total+Number(item.price)*quantity;
    },0);
}

function calculateDiscount(){
    const subtotal=calculateSubtotal();

    if(discountCode==="ATELIER10"){
        discount=subtotal*10/100;
    }else if(discountCode==="ATELIER20"){
        discount=subtotal*20/100;
    }else{
        discount=0;
    }

    return discount;
}

function calculateTotal(){
    return calculateSubtotal()-discount;
}

function updateFormState(){
    const formInputs = form.querySelectorAll("input, button[type='submit']");
    const discountInput = document.getElementById("discount");
    const applyDiscountBtn = document.getElementById("apply-discount");

    if(cart.length===0){
        formInputs.forEach(input=>input.disabled=true);
        if(discountInput) discountInput.disabled=true;
        if(applyDiscountBtn) applyDiscountBtn.disabled=true;
        
        final.textContent="Your cart is empty. Please add items before checking out.";
        final.className="border border-warning rounded text-warning p-2 mt-3 text-center fw-bold";
    }else{
        formInputs.forEach(input=>input.disabled=false);
        if(discountInput) discountInput.disabled=false;
        if(applyDiscountBtn) applyDiscountBtn.disabled=false;
        
        final.textContent="";
        final.className="";
    }
}

function displayCart(){
    const summaryItems=document.getElementById("summary-items");

    if(cart.length===0){
        summaryItems.innerHTML=`
            <div class="text-center py-3">
                <span class="material-symbols-outlined text-secondary fs-3">shopping_bag</span>
                <p class="font-inter small text-secondary mb-0">Your cart is currently empty</p>
            </div>
        `;
    }else{
        summaryItems.innerHTML=cart.map(function(item){
            const quantity=item.quantity||1;
            const itemTotal=Number(item.price)*quantity;

            return `
                <div class="d-flex gap-3 mb-3">
                    <img src="../Product-View/${item.image}" alt="${item.name}" class="summary-item-image flex-shrink-0">
                    <div class="flex-grow-1">
                        <div class="summary-item-name small">${item.name}</div>
                        <div class="summary-item-details">Color: ${item.color||"Noir"}</div>
                        <div class="summary-item-details">Size: ${item.size||"OS"}</div>
                        <div class="summary-item-details">Qty: ${quantity}</div>
                    </div>
                    <div class="summary-item-price">$${itemTotal.toFixed(2)}</div>
                </div>
            `;
        }).join("");
    }

    document.getElementById("subtotal").textContent="$"+calculateSubtotal().toFixed(2);

    document.getElementById("discount-amount").textContent=
        discount>0?"-$"+discount.toFixed(2):"$0.00";

    document.getElementById("total").textContent=
        "$"+calculateTotal().toFixed(2);

    if(calculateSubtotal()>=1000){
        document.getElementById("shipping").textContent="FREE";
    }else{
        document.getElementById("shipping").textContent="Calculated at next step";
    }

    updateFormState();
}

document.getElementById("apply-discount").addEventListener("click",function(){
    discountCode=document.getElementById("discount").value.trim().toUpperCase();
    calculateDiscount();
    displayCart();
});

form.addEventListener("submit",function(e){
    e.preventDefault();

    if(cart.length===0){
        return;
    }

    const emailValid=validateEmail();
    const firstNameValid=validateFirstName();
    const lastNameValid=validateLastName();
    const streetValid=validateStreet();
    const cityValid=validateCity();
    const postalValid=validatePostal();

    if(emailValid&&firstNameValid&&lastNameValid&&streetValid&&cityValid&&postalValid){
        localStorage.setItem("deliveryEmail",email.value.trim());
        localStorage.setItem("deliveryFirstName",firstName.value.trim());
        localStorage.setItem("deliveryLastName",lastName.value.trim());
        localStorage.setItem("deliveryStreet",street.value.trim());
        localStorage.setItem("deliveryCity",city.value.trim());
        localStorage.setItem("deliveryPostal",postal.value.trim());
        localStorage.setItem("discount",discount);
        localStorage.setItem("discountCode",discountCode);

        window.location.href="../Confirm/confirm.html";
    }else{
        final.textContent="Please enter the correct details";
        final.className="border border-danger rounded text-danger p-2 mt-3 text-center fw-bold";
    }
});

displayCart();