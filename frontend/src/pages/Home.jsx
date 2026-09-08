import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { SERVICES } from '../data';

const AIChatbot = lazy(() => import('../components/AIChatbot'));

export default function Home() {
  return (
    <div className="app home-page">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Innovative Software Solutions for Tomorrow's Challenges</h1>
            <p className="hero-subtitle">
              Empowering businesses with cutting-edge technology, AI-driven insights,
              and elite talent placement — across IT and Automotive industries.
            </p>
            <div className="hero-buttons">
              <Link to="/services" className="btn btn-primary">Our Services</Link>
              <Link to="/contact" className="btn btn-secondary">Get in Touch</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-visual-card">
              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80&auto=format&fit=crop"
                alt="AI assistant interface and intelligent automation"
                loading="eager"
              />
            </div>
            <div className="hero-img-row">
              <div className="hero-visual-card hero-img-sm">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=520&q=80&auto=format&fit=crop"
                  alt="Cloud technology and global infrastructure"
                  loading="lazy"
                />
              </div>
              <div className="hero-visual-card hero-img-sm">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=520&q=80&auto=format&fit=crop"
                  alt="Data analytics dashboard and business insights"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="hero-floaters">
              <div className="float-chip">
                <strong>☁️ Cloud Native</strong>
                <span>AWS · Azure · GCP</span>
              </div>
              <div className="float-chip">
                <strong>🤖 AI &amp; Data</strong>
                <span>Built for production</span>
              </div>
              <div className="float-chip">
                <strong>👥 500+ Placed</strong>
                <span>Top IT professionals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="ai-chat-loading">Loading AI assistants...</div>}>
        <AIChatbot />
      </Suspense>

      {/* Services Section */}
      <section className="services">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            {SERVICES.map(({ slug, icon, image, title, desc }) => (
              <Link key={slug} to={`/services/${slug}`} className="service-card service-card-link">
                <div className="service-image">
                  <img src={image} alt={`${title} visual`} loading="lazy" />
                </div>
                <div className="service-icon">
                  <img src={`/icons/${icon}.svg`} alt="" aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <span className="card-cta">Learn More →</span>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/services" className="btn btn-secondary">View All Services →</Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Ready to Get Started?</h2>
          <p className="contact-subtitle">
            Have a project in mind? Let's discuss how we can help your business grow.
          </p>
          <div style={{ marginTop: '24px' }}>
            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
