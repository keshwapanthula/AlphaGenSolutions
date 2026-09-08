import { Link, Navigate, useParams } from 'react-router-dom';
import '../App.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { SERVICES } from '../data';

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = SERVICES.find(s => s.slug === slug);

  if (!service) return <Navigate to="/services" replace />;

  return (
    <div className="app themed-page page-services-bg">
      <Navbar />
      <section className="about page-section page-hero page-hero-services">
        <div className="container detail-page">
          <div className="detail-image">
            <img src={service.image} alt={`${service.title} visual`} loading="eager" />
          </div>
          <div className="detail-icon">
            <img src={`/icons/${service.icon}.svg`} alt="" aria-hidden="true" />
          </div>
          <h2 className="section-title">{service.title}</h2>
          <p className="contact-subtitle">{service.desc}</p>
          <div className="about-content">
            <p>{service.detail}</p>
          </div>
          <div className="detail-actions">
            <Link to="/contact" className="btn btn-primary">Get in Touch</Link>
            <Link to="/services" className="btn btn-secondary">← All Services</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
