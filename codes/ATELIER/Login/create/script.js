const form = document.querySelector("#create-account-form");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const email = document.querySelector("#email");
const pswd = document.querySelector("#password");
const conf = document.querySelector("#confirmPassword");
const strength = document.querySelector("#strength");
const final = document.querySelector("#message");
const terms = document.querySelector("#terms");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const mediumPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;


// Helper Functions

function showError(fieldId, message) {
    document.querySelector(`#${fieldId}-error`).textContent = message;
}

function clearError(fieldId) {
    document.querySelector(`#${fieldId}-error`).textContent = "";
}


// Password Strength

function passwordStrength() {
    if (pswd.value.length === 0) {
        strength.textContent = "";
        strength.className = "";
        return;
    }

    if (strongPasswordRegex.test(pswd.value)) {
        strength.textContent = "Strong password";
        strength.className = "text-success";
    } else if (mediumPasswordRegex.test(pswd.value)) {
        strength.textContent = "Medium strength password";
        strength.className = "text-warning";
    } else {
        strength.textContent = "Weak password";
        strength.className = "text-danger";
    }
}


// First Name

function first_Name(user) {
    user.classList.remove("is-valid", "is-invalid");

    if (user.value.trim().length === 0) {
        showError("firstName", "Please enter your first name");
        user.classList.add("is-invalid");
        return false;
    }

    if (user.value.trim().length < 3) {
        showError("firstName", "Minimum 3 characters required");
        user.classList.add("is-invalid");
        return false;
    }

    clearError("firstName");
    user.classList.add("is-valid");
    return true;
}


// Last Name

function last_Name(user) {
    user.classList.remove("is-valid", "is-invalid");

    if (user.value.trim().length === 0) {
        showError("lastName", "Please enter your last name");
        user.classList.add("is-invalid");
        return false;
    }

    if (user.value.trim().length < 3) {
        showError("lastName", "Minimum 3 characters required");
        user.classList.add("is-invalid");
        return false;
    }

    clearError("lastName");
    user.classList.add("is-valid");
    return true;
}


// Email

function EmailID(userEmail) {
    userEmail.classList.remove("is-valid", "is-invalid");

    if (userEmail.value.trim().length === 0) {
        showError("email", "Please enter an email ID");
        userEmail.classList.add("is-invalid");
        return false;
    }

    if (!emailRegex.test(userEmail.value.trim())) {
        showError("email", "Invalid email format");
        userEmail.classList.add("is-invalid");
        return false;
    }

    clearError("email");
    userEmail.classList.add("is-valid");
    return true;
}


// Password

function password(userPassword) {
    userPassword.classList.remove("is-valid", "is-invalid");

    if (userPassword.value.length === 0) {
        showError("pswd", "Please enter a password");
        userPassword.classList.add("is-invalid");
        passwordStrength();
        return false;
    }

    if (userPassword.value.length < 8) {
        showError("pswd", "Minimum 8 characters required");
        userPassword.classList.add("is-invalid");
        passwordStrength();
        return false;
    }

    clearError("pswd");
    userPassword.classList.add("is-valid");
    passwordStrength();
    return true;
}


// Confirm Password

function confirmPassword(confirmField) {
    confirmField.classList.remove("is-valid", "is-invalid");

    if (confirmField.value.trim().length === 0) {
        showError("conf", "Please confirm your password");
        confirmField.classList.add("is-invalid");
        return false;
    }

    if (confirmField.value !== pswd.value) {
        showError("conf", "Password does not match");
        confirmField.classList.add("is-invalid");
        return false;
    }

    clearError("conf");
    confirmField.classList.add("is-valid");
    return true;
}


// Validation Object

const valObj = [
    { field: firstName, fn: first_Name },
    { field: lastName, fn: last_Name },
    { field: email, fn: EmailID },
    { field: pswd, fn: password },
    { field: conf, fn: confirmPassword }
];


// Live Validation

valObj.forEach(item => {
    item.field.addEventListener("input", () => {
        item.fn(item.field);
        final.textContent = "";
        final.className = "";
    });
});


// Terms Checkbox

terms.addEventListener("change", () => {
    final.textContent = "";
    final.className = "";
});


// Form Submit

form.addEventListener("submit", e => {
    e.preventDefault();

    let res = true;

    // Validate all fields

    valObj.forEach(item => {
        const isValid = item.fn(item.field);

        if (!isValid) {
            res = false;
        }
    });

    const termsAccepted = terms.checked;


    // Invalid fields + Terms not checked

    if (!res && !termsAccepted) {
        final.textContent = "Please enter the correct details and accept the Terms and Conditions.";
        final.className = "border border-danger rounded text-danger p-2 mt-3 text-center fw-bold";
        return;
    }


    // Invalid fields

    if (!res) {
        final.textContent = "Please enter the correct details.";
        final.className = "border border-danger rounded text-danger p-2 mt-3 text-center fw-bold";
        return;
    }


    // Terms not checked

    if (!termsAccepted) {
        final.textContent = "Please accept the Terms and Conditions.";
        final.className = "border border-danger rounded text-danger p-2 mt-3 text-center fw-bold";
        return;
    }


    // Get existing users

    let users = JSON.parse(localStorage.getItem("users")) || [];


    // Check if email already exists

    const enteredEmail = email.value.trim().toLowerCase();

    const emailExists = users.some(user => {
        return user.email.toLowerCase() === enteredEmail;
    });


    if (emailExists) {
        showError("email", "Email ID already exists");

        email.classList.remove("is-valid");
        email.classList.add("is-invalid");

        final.textContent = "Please use a different email ID.";
        final.className = "border border-danger rounded text-danger p-2 mt-3 text-center fw-bold";

        return;
    }


    // Create User

    const user = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        password: pswd.value
    };


    // Store User

    users.push(user);

    localStorage.setItem("users", JSON.stringify(users));


    // Success Message

    final.innerHTML = "Account created successfully";

    final.className = "border border-success alert-success rounded text-success p-2 mt-3 text-center fw-bold";


    // Reset Form

    form.reset();


    // Remove Validation Colors

    valObj.forEach(item => {
        item.field.classList.remove("is-valid", "is-invalid");
    });


    // Clear Password Strength

    strength.textContent = "";
    strength.className = "";
});