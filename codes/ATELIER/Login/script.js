const form = document.querySelector("#signin-form");
const email = document.querySelector("#email");
const pswd = document.querySelector("#password");
const rememberme = document.querySelector("#rememberme");
const final = document.querySelector("#message");

// Helper Functions
function showError(fieldId, message) {
    document.querySelector(`#${fieldId}-error`).textContent = message;
}

function clearError(fieldId) {
    document.querySelector(`#${fieldId}-error`).textContent = "";
}

// Email Validation
function validateEmail() {
    email.classList.remove("is-valid", "is-invalid");

    if (email.value.trim().length === 0) {
        showError("email", "Please enter your email ID");
        email.classList.add("is-invalid");
        return false;
    }

    clearError("email");
    email.classList.add("is-valid");
    return true;
}

// Password Validation
function validatePassword() {
    pswd.classList.remove("is-valid", "is-invalid");

    if (pswd.value.length === 0) {
        showError("password", "Please enter your password");
        pswd.classList.add("is-invalid");
        return false;
    }

    clearError("password");
    pswd.classList.add("is-valid");
    return true;
}

// Load Remembered User
window.addEventListener("load", () => {
    const rememberedUser = JSON.parse(localStorage.getItem("rememberedUser"));

    if (rememberedUser) {
        email.value = rememberedUser.email;
        pswd.value = rememberedUser.password;
        rememberme.checked = true;
    }
});

// Live Validation
email.addEventListener("input", () => {
    validateEmail();
});

pswd.addEventListener("input", () => {
    validatePassword();
});

// Sign In
form.addEventListener("submit", (e) => {
    e.preventDefault();

    let res = true;

    if (!validateEmail()) {
        res = false;
    }

    if (!validatePassword()) {
        res = false;
    }

    if (!res) {
        final.textContent = "Please enter the correct details.";
        final.className = "border border-danger rounded text-danger p-2 mt-3 text-center fw-bold";
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user using email
    const enteredEmail = email.value.trim().toLowerCase();

    const user = users.find(account => {
        return account.email.toLowerCase() === enteredEmail;
    });

    // Email does not exist
    if (!user) {
        showError("email", "Email ID does not exist.");
        email.classList.remove("is-valid");
        email.classList.add("is-invalid");

        final.textContent = "Please enter the correct details.";
        final.className = "border border-danger rounded text-danger p-2 mt-3 text-center fw-bold";
        return;
    }

    // Incorrect password
    if (user.password !== pswd.value) {
        showError("password", "Incorrect password.");
        pswd.classList.remove("is-valid");
        pswd.classList.add("is-invalid");

        final.textContent = "Please enter the correct details.";
        final.className = "border border-danger rounded text-danger p-2 mt-3 text-center fw-bold";
        return;
    }

    // Remember Me
    if (rememberme.checked) {
        const rememberedUser = {
            email: user.email,
            password: user.password
        };

        localStorage.setItem(
            "rememberedUser",
            JSON.stringify(rememberedUser)
        );
    } else {
        localStorage.removeItem("rememberedUser");
    }

    // Store currently signed-in user
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Go directly to Home Page
    document.querySelector("#home-link").click();
});