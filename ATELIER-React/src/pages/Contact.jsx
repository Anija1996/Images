import { useState } from "react";
import "../styles/contact.css";

function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
    };

    return (
        <main className="contact-page">
            <section className="contact-header">
                <p>WE'RE HERE TO HELP</p>
                <h1>Contact ATELIER</h1>
            </section>

            <section className="contact-layout">
                <div>
                    <h2>Get in touch</h2>
                    <p>For questions about orders, products, delivery or anything else, send us a message.</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                    <input name="name" value={form.name} onChange={handleChange} placeholder="NAME" required />
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="EMAIL" required />
                    <input name="subject" value={form.subject} onChange={handleChange} placeholder="SUBJECT" required />
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="MESSAGE" maxLength="500" required />
                    <div className="message-count">{form.message.length}/500</div>
                    <button type="submit">SEND MESSAGE</button>
                    {submitted && <p className="success-message">Thank you. Your message has been received.</p>}
                </form>
            </section>
        </main>
    );
}

export default Contact;