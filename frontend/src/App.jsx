import { useState } from 'react'
import './App.css'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormStatus({ type: '', message: '' })

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setFormStatus({
          type: 'success',
          message: data.message
        })
        setFormData({ name: '', email: '', company: '', message: '' })
      } else {
        setFormStatus({
          type: 'error',
          message: data.message || 'Something went wrong. Please try again.'
        })
      }
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Failed to send message. Please check if the backend is running.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <a className="logo" href="#home" aria-label="AlphaGen Solutions home">
            <img src="/brand/logo-mark.svg" alt="" aria-hidden="true" />
            <span>
              <strong>AlphaGen</strong>
              <em>Solutions</em>
            </span>
          </a>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Innovative Software Solutions for Tomorrow's Challenges
            </h1>
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
              <img
                src="/backgrounds/hero-dashboard.svg"
                alt="Abstract dashboard with analytics, cloud, and engineering panels"
              />
            </div>
            <div className="hero-floaters">
              <div className="float-chip">
                <strong>Cloud delivery</strong>
                <span>Scalable, secure, and always-on architectures</span>
              </div>
              <div className="float-chip">
                <strong>AI systems</strong>
                <span>Modern automation with practical business impact</span>
              </div>
              <div className="float-chip">
                <strong>Data insights</strong>
                <span>Clean dashboards for decisions that move faster</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Website Ideas Section */}
      <section id="website-ideas" className="website-ideas">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Unique website links</span>
            <h2 className="section-title">Memorable domain-style ideas for Alpha Gen Solutions</h2>
            <p>
              These are brand-style suggestions to help you choose a clean, unique web address.
              Availability is not checked live in this app.
            </p>
          </div>

          <div className="idea-grid">
            <article className="idea-card featured">
              <span className="idea-tag">Primary pick</span>
              <h3>alphagensolutions.com</h3>
              <p>Best for a polished corporate presence and the most straightforward brand match.</p>
            </article>
            <article className="idea-card">
              <span className="idea-tag alt">Modern</span>
              <h3>alphagen.tech</h3>
              <p>Short, modern, and ideal if you want a more product-focused identity.</p>
            </article>
            <article className="idea-card">
              <span className="idea-tag alt">Startup-friendly</span>
              <h3>alphagenlabs.ai</h3>
              <p>Strong option for AI, automation, and innovation-led positioning.</p>
            </article>
            <article className="idea-card">
              <span className="idea-tag alt">Short brand</span>
              <h3>alphagen.solutions</h3>
              <p>Clean and descriptive, with a premium custom-domain feel.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon"><img src="/icons/cloud.svg" alt="" aria-hidden="true" /></div>
              <h3>Cloud Solutions</h3>
              <p>Scalable cloud infrastructure and migration services on AWS, Azure, and GCP.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><img src="/icons/ai.svg" alt="" aria-hidden="true" /></div>
              <h3>AI & Machine Learning</h3>
              <p>Intelligent systems powered by advanced AI and machine learning algorithms.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><img src="/icons/code.svg" alt="" aria-hidden="true" /></div>
              <h3>Custom Development</h3>
              <p>Full-stack web and mobile applications tailored to your business needs.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><img src="/icons/security.svg" alt="" aria-hidden="true" /></div>
              <h3>Cybersecurity</h3>
              <p>Comprehensive security solutions to protect your digital assets.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><img src="/icons/analytics.svg" alt="" aria-hidden="true" /></div>
              <h3>Data Analytics</h3>
              <p>Transform your data into actionable insights with advanced analytics.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><img src="/icons/automation.svg" alt="" aria-hidden="true" /></div>
              <h3>DevOps & Automation</h3>
              <p>Streamline your development pipeline with modern DevOps practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title">About AlphaGen Solutions</h2>
          <div className="about-content">
            <p>
              AlphaGen Solutions is a leading technology consultancy specializing in 
              innovative software development, cloud infrastructure, and AI-powered solutions. 
              With over a decade of experience, we help businesses transform their operations 
              through cutting-edge technology.
            </p>
            <p>
              Our team of expert engineers and consultants work closely with clients to deliver 
              scalable, secure, and efficient solutions that drive real business value.
            </p>
            <div className="stats">
              <div className="stat">
                <h3>500+</h3>
                <p>Projects Completed</p>
              </div>
              <div className="stat">
                <h3>200+</h3>
                <p>Happy Clients</p>
              </div>
              <div className="stat">
                <h3>50+</h3>
                <p>Expert Team Members</p>
              </div>
              <div className="stat">
                <h3>10+</h3>
                <p>Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Get in Touch</h2>
          <p className="contact-subtitle">
            Have a project in mind? Let's discuss how we can help your business grow.
          </p>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Tell us about your project..."
              ></textarea>
            </div>

            {formStatus.message && (
              <div className={`form-message ${formStatus.type}`}>
                {formStatus.message}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
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
        </div>
      </footer>
    </div>
  )
}

export default App
