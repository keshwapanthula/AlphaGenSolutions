import { Link } from 'react-router-dom';
import '../App.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { TRAININGS } from '../data';

export default function TrainingsPage() {
  return (
    <div className="app themed-page page-trainings">
      <Navbar />
      <section className="about page-section page-hero page-hero-trainings">
        <div className="container">
          <h2 className="section-title">Professional Training Programs</h2>
          <p className="contact-subtitle">
            Instructor-led, project-based IT training — fully remote and backed by job placement support.
          </p>
          <div className="services-grid" style={{ marginTop: '32px' }}>
            {TRAININGS.map(({ slug, icon, title, duration, level, desc }) => (
              <Link key={slug} to={`/trainings/${slug}`} className="service-card job-card service-card-link">
                <div className="service-icon emoji-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="job-meta" style={{ margin: '12px 0 0' }}>
                  <span className="job-tag">{duration}</span>
                  <span className="job-location">{level}</span>
                </div>
                <span className="card-cta" style={{ marginTop: '12px' }}>View Program →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
