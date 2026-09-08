import { Link } from 'react-router-dom';
import '../App.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { SERVICES } from '../data';

export default function ServicesPage() {
  return (
    <div className="app themed-page page-services-bg">
      <Navbar />
      <section className="services page-section page-hero page-hero-services">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <p className="contact-subtitle">
            End-to-end technology solutions that scale with your business.
          </p>
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
        </div>
      </section>
      <Footer />
    </div>
  );
}
