import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

function CreateAccount() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", newsletter: false, terms: false });
    const [touched, setTouched] = useState({});
    const [message, setMessage] = useState("");

    const errors = {
        firstName: !form.firstName.trim() ? "First name is required." : form.firstName.trim().length < 3 ? "First name must be at least 3 characters." : "",
        lastName: !form.lastName.trim() ? "Last name is required." : form.lastName.trim().length < 3 ? "Last name must be at least 3 characters." : "",
        email: !form.email ? "Email address is required." : !/^\S+@\S+\.\S+$/.test(form.email) ? "Enter a valid email address." : "",
        password: !form.password ? "Password is required." : form.password.length < 8 ? "Use at least 8 characters." : "",
        confirmPassword: !form.confirmPassword ? "Please confirm your password." : form.confirmPassword !== form.password ? "Passwords do not match." : "",
        terms: !form.terms ? "You must accept the terms and conditions." : ""
    };

    const update = (field, value) => { setForm((current) => ({ ...current, [field]: value })); setMessage(""); };
    const passwordStrength = !form.password ? "" : form.password.length < 8 ? "WEAK" : /(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/.test(form.password) ? "STRONG" : "MEDIUM";

    const submit = (event) => {
        event.preventDefault();
        setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true, terms: true });
        if (Object.values(errors).some(Boolean)) return;
        let users = [];
        try {
            const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
            users = Array.isArray(savedUsers) ? savedUsers : [];
        } catch {
            localStorage.removeItem("users");
        }
        if (users.some((user) => user.email.toLowerCase() === form.email.toLowerCase())) { setMessage("An account with this email already exists."); return; }
        const user = { name: `${form.firstName.trim()} ${form.lastName.trim()}`, email: form.email.trim(), password: form.password };
        localStorage.setItem("users", JSON.stringify([...users, user]));
        setMessage("Account created successfully. Redirecting to sign in...");
        window.setTimeout(() => navigate("/signin"), 1200);
    };

    return (
        <main className="auth-screen">
            <div className="login-container border bg-white">
                <div className="auth-heading"><h1>ATELIER</h1><span>Create your account</span></div>
                <div className="auth-tabs"><div><Link to="/signin">SIGN IN</Link></div><div className="active"><Link to="/create-account">CREATE ACCOUNT</Link></div></div>
                <form onSubmit={submit} noValidate>
                    <div className="create-fields">
                        <div className="name-row">
                            <div><input placeholder="First Name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} onBlur={() => setTouched((v) => ({ ...v, firstName: true }))} />{touched.firstName && errors.firstName && <p className="field-error">{errors.firstName}</p>}</div>
                            <div><input placeholder="Last Name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} onBlur={() => setTouched((v) => ({ ...v, lastName: true }))} />{touched.lastName && errors.lastName && <p className="field-error">{errors.lastName}</p>}</div>
                        </div>
                        <div><input type="email" placeholder="Email Address" value={form.email} onChange={(e) => update("email", e.target.value)} onBlur={() => setTouched((v) => ({ ...v, email: true }))} />{touched.email && errors.email && <p className="field-error">{errors.email}</p>}</div>
                        <div><input type="password" placeholder="Password" value={form.password} onChange={(e) => update("password", e.target.value)} onBlur={() => setTouched((v) => ({ ...v, password: true }))} />{passwordStrength && <span className={`strength ${passwordStrength.toLowerCase()}`}>{passwordStrength}</span>}{touched.password && errors.password && <p className="field-error">{errors.password}</p>}</div>
                        <div><input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} onBlur={() => setTouched((v) => ({ ...v, confirmPassword: true }))} />{touched.confirmPassword && errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}</div>
                    </div>
                    <div className="auth-submit-area create-submit">
                        <label className="check-row"><input type="checkbox" checked={form.newsletter} onChange={(e) => update("newsletter", e.target.checked)} /> <span>Subscribe to our newsletter for exclusive offers and updates.</span></label>
                        <label className="check-row"><input type="checkbox" checked={form.terms} onChange={(e) => update("terms", e.target.checked)} /> <span>I agree to the <u>Terms and Conditions</u> and <u>Privacy Policy</u>.</span></label>
                        {touched.terms && errors.terms && <p className="field-error">{errors.terms}</p>}
                        <button type="submit">CREATE ACCOUNT</button>
                        {message && <p className="form-message">{message}</p>}
                    </div>
                </form>
                <div className="social-section"><div className="or-row"><hr /><span>OR CONTINUE WITH</span><hr /></div><button type="button" className="google-button"><img src="https://raw.githubusercontent.com/Anija1996/Images/feature/img/assets/google.png" alt="Google" />GOOGLE</button></div>
            </div>
        </main>
    );
}

export default CreateAccount;
