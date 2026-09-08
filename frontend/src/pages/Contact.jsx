import { useState } from 'react';
import '../App.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });
    try {
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setFormStatus({ type: 'success', message: data.message });
        setFormData({ name: '', email: '', company: '', message: '' });
      } else {
        setFormStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
      }
    } catch {
      setFormStatus({ type: 'error', message: 'Failed to send message. Please check if the backend is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app themed-page page-contact-bg">
      <Navbar />
      <section className="contact page-section page-hero page-hero-contact">
        <div className="container">
          <h2 className="section-title">Get in Touch</h2>
          <p className="contact-subtitle">
            Have a project in mind? Let's discuss how we can help your business grow.
          </p>
          <div className="contact-details">
            <a href="mailto:alphagensolutionsllc@gmail.com" className="contact-detail-chip">
              <span className="contact-detail-icon">✉</span>
              <span>alphagensolutionsllc@gmail.com</span>
            </a>
            <a href="tel:+12483879366" className="contact-detail-chip">
              <span className="contact-detail-icon">📞</span>
              <span>(248) 387-9366</span>
            </a>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ct-name">Name *</label>
                <input
                  type="text" id="ct-name" name="name"
                  value={formData.name} onChange={handleChange}
                  required placeholder="Your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ct-email">Email *</label>
                <input
                  type="email" id="ct-email" name="email"
                  value={formData.email} onChange={handleChange}
                  required placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="ct-company">Company</label>
              <input
                type="text" id="ct-company" name="company"
                value={formData.company} onChange={handleChange}
                placeholder="Your company name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="ct-message">Message *</label>
              <textarea
                id="ct-message" name="message"
                value={formData.message} onChange={handleChange}
                required rows="6" placeholder="Tell us about your project..."
              />
            </div>
            {formStatus.message && (
              <div className={`form-message ${formStatus.type}`}>{formStatus.message}</div>
            )}
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}
