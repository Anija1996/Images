import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

function SignIn() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [touched, setTouched] = useState({});
    const [message, setMessage] = useState("");

    const emailError = !form.email ? "Email address is required." : !/^\S+@\S+\.\S+$/.test(form.email) ? "Enter a valid email address." : "";
    const passwordError = !form.password ? "Password is required." : form.password.length < 6 ? "Password must be at least 6 characters." : "";

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
        setMessage("");
    };

    const submit = (event) => {
        event.preventDefault();
        setTouched({ email: true, password: true });
        if (emailError || passwordError) return;
        let users = [];
        try {
            const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
            users = Array.isArray(savedUsers) ? savedUsers : [];
        } catch {
            localStorage.removeItem("users");
        }
        const user = users.find((item) => item.email.toLowerCase() === form.email.toLowerCase() && item.password === form.password);
        if (!user) { setMessage("Email or password is incorrect."); return; }
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.dispatchEvent(new Event("authchange"));
        navigate("/");
    };

    return (
        <main className="auth-screen">
            <div className="login-container border bg-white">
                <div className="auth-heading"><h1>ATELIER</h1><span>Sign in to your account</span></div>
                <div className="auth-tabs">
                    <div className="active"><Link to="/signin">SIGN IN</Link></div>
                    <div><Link to="/create-account">CREATE ACCOUNT</Link></div>
                </div>
                <form onSubmit={submit} noValidate>
                    <div className="auth-fields">
                        <label htmlFor="email">EMAIL ADDRESS</label>
                        <input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} onBlur={() => setTouched((v) => ({ ...v, email: true }))} />
                        {touched.email && emailError && <p className="field-error">{emailError}</p>}
                        <label htmlFor="password">PASSWORD</label>
                        <input id="password" type="password" placeholder="......" value={form.password} onChange={(e) => update("password", e.target.value)} onBlur={() => setTouched((v) => ({ ...v, password: true }))} />
                        {touched.password && passwordError && <p className="field-error">{passwordError}</p>}
                    </div>
                    <div className="auth-submit-area">
                        <div className="remember-row"><label><input type="checkbox" /> Remember me</label><a href="#">Forgot password?</a></div>
                        <button type="submit">SIGN IN</button>
                        {message && <p className="form-message">{message}</p>}
                    </div>
                </form>
                <div className="social-section"><div className="or-row"><hr /><span>OR CONTINUE WITH</span><hr /></div><button type="button" className="google-button"><img src="https://raw.githubusercontent.com/Anija1996/Images/feature/img/assets/google.png" alt="Google" />GOOGLE</button></div>
            </div>
        </main>
    );
}

export default SignIn;
