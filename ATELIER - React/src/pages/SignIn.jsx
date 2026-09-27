import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validateRequired } from "../utils/formValidation";
import "../styles/auth.css";

const LIMITS = { email: 100, password: 64 };

export default function SignIn() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [touched, setTouched] = useState({});
    const [message, setMessage] = useState("");

    const validateField = (field, value = form[field]) => {
        if (field === "email") return validateEmail(value);
        return validateRequired(value, "Password");
    };

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
        setTouched((current) => ({ ...current, [field]: true }));
        setMessage("");
    };

    const submit = (e) => {
        e.preventDefault();
        const errors = Object.keys(form).filter((field) => validateField(field));
        setTouched({ email: true, password: true });
        if (errors.length) return;

        let users = [];
        try { users = JSON.parse(localStorage.getItem("users") || "[]"); } catch { users = []; }
        const user = Array.isArray(users) && users.find(
            (x) => x.email.toLowerCase() === form.email.trim().toLowerCase() && x.password === form.password
        );
        if (!user) { setMessage("Email or password is incorrect."); return; }
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.dispatchEvent(new Event("authchange"));
        navigate("/");
    };

    return <main className="auth-screen"><div className="login-container border bg-white"><div className="auth-heading"><h1>ATELIER</h1><span>Sign in to your account</span></div><div className="auth-tabs"><div className="active"><Link to="/signin">SIGN IN</Link></div><div><Link to="/create-account">CREATE ACCOUNT</Link></div></div><form onSubmit={submit}><div className="auth-fields">
        <label>EMAIL ADDRESS</label>
        <input type="email" maxLength={LIMITS.email} required value={form.email} onChange={(e) => update("email", e.target.value)} className={touched.email && validateField("email") ? "field-invalid" : ""}/>
        <div className="field-meta"><span>{touched.email && validateField("email")}</span><small>{form.email.length}/{LIMITS.email}</small></div>
        <label>PASSWORD</label>
        <input type="password" maxLength={LIMITS.password} required value={form.password} onChange={(e) => update("password", e.target.value)} className={touched.password && validateField("password") ? "field-invalid" : ""}/>
        <div className="field-meta"><span>{touched.password && validateField("password")}</span><small>{form.password.length}/{LIMITS.password}</small></div>
    </div><div className="auth-submit-area"><div className="remember-row"><label><input type="checkbox"/> Remember me</label><a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a></div><button type="submit">SIGN IN</button>{message&&<p className="form-message">{message}</p>}</div></form><div className="social-section"><div className="or-row"><hr/><span>OR CONTINUE WITH</span><hr/></div><button type="button" className="google-button"><img src="/google-g.svg" alt="Google"/> <span>Continue with Google</span></button></div></div></main>;
}
