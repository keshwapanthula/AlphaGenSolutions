import { useState } from 'react';
import '../App.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

export default function Home() {
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
        body: JSON.stringify(formData)
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
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <a className="logo" href="#home" aria-label="AlphaGen Solutions home">
            <img src="/brand/logo-mark.svg" alt="" aria-hidden="true" />
            <span>
              <strong>Alpha Gen</strong>
              <em>Solutions</em>
            </span>
          </a>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="/login" className="btn btn-primary nav-portal-btn">Employee Portal</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Innovative Software Solutions for Tomorrow's Challenges</h1>
            <p className="hero-subtitle">
              Empowering businesses with cutting-edge technology, AI-driven insights,
              and scalable cloud solutions.
            </p>
            <div className="hero-buttons">
              <a href="#services" className="btn btn-primary">Our Services</a>
              <a href="#contact" className="btn btn-secondary">Get in Touch</a>
            </div>
          </div>
          <div className="hero-visual" aria-label="AlphaGen Solutions dashboard illustration">
            <div className="hero-visual-card">
              <img src="/backgrounds/hero-dashboard.svg" alt="Abstract dashboard with analytics, cloud, and engineering panels" />
            </div>
            <div className="hero-floaters">
              <div className="float-chip"><strong>Cloud delivery</strong><span>Scalable, secure, and always-on architectures</span></div>
              <div className="float-chip"><strong>AI systems</strong><span>Modern automation with practical business impact</span></div>
              <div className="float-chip"><strong>Data insights</strong><span>Clean dashboards for decisions that move faster</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            {[
              { icon: 'cloud', title: 'Cloud Solutions', desc: 'Scalable cloud infrastructure and migration services on AWS, Azure, and GCP.' },
              { icon: 'ai', title: 'AI & Machine Learning', desc: 'Intelligent systems powered by advanced AI and machine learning algorithms.' },
              { icon: 'code', title: 'Custom Development', desc: 'Full-stack web and mobile applications tailored to your business needs.' },
              { icon: 'security', title: 'Cybersecurity', desc: 'Comprehensive security solutions to protect your digital assets.' },
              { icon: 'analytics', title: 'Data Analytics', desc: 'Transform your data into actionable insights with advanced analytics.' },
              { icon: 'automation', title: 'DevOps & Automation', desc: 'Streamline your development pipeline with modern DevOps practices.' }
            ].map(({ icon, title, desc }) => (
              <div key={icon} className="service-card">
                <div className="service-icon"><img src={`/icons/${icon}.svg`} alt="" aria-hidden="true" /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title">About AlphaGen Solutions</h2>
          <div className="about-content">
            <p>AlphaGen Solutions is a leading technology consultancy specializing in innovative software development, cloud infrastructure, and AI-powered solutions. With over a decade of experience, we help businesses transform their operations through cutting-edge technology.</p>
            <p>Our team of expert engineers and consultants work closely with clients to deliver scalable, secure, and efficient solutions that drive real business value.</p>
            <div className="stats">
              {[['500+', 'Projects Completed'], ['200+', 'Happy Clients'], ['50+', 'Expert Team Members'], ['10+', 'Years of Excellence']].map(([n, l]) => (
                <div key={l} className="stat"><h3>{n}</h3><p>{l}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Get in Touch</h2>
          <p className="contact-subtitle">Have a project in mind? Let's discuss how we can help your business grow.</p>
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
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your.email@example.com" />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Your company name" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows="5" placeholder="Tell us about your project..." />
            </div>
            {formStatus.message && (
              <div className={`form-message ${formStatus.type}`}>{formStatus.message}</div>
            )}
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 AlphaGen Solutions. All rights reserved.</p>
          <p>Building tomorrow's technology, today.</p>
          <p className="footer-contact">
            <a href="mailto:alphagensolutionsllc@gmail.com">alphagensolutionsllc@gmail.com</a>
            &nbsp;&nbsp;·&nbsp;&nbsp;
            <a href="tel:+12483879366">(248) 387-9366</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
