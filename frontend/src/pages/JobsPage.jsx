import { Link } from 'react-router-dom';
import '../App.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { JOB_BENEFITS, JOB_LISTINGS } from '../data';

export default function JobsPage() {
  return (
    <div className="app themed-page page-jobs">
      <Navbar />

      {/* Job Seekers Section */}
      <section className="about page-section page-hero page-hero-jobs">
        <div className="container">
          <h2 className="section-title">Find Your Next Opportunity</h2>
          <p className="contact-subtitle">
            AlphaGen connects skilled IT and Automotive engineering professionals with top companies.
            We handle everything from resume prep to placement across both industries.
          </p>
          <div className="services-grid" style={{ marginTop: '32px' }}>
            {JOB_BENEFITS.map(({ icon, title, desc }) => (
              <div key={title} className="service-card">
                <div className="service-icon emoji-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/contact" className="btn btn-primary">Submit Your Resume</Link>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="services" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div className="container">
          <h2 className="section-title">Current Openings</h2>
          <div className="services-grid">
            {JOB_LISTINGS.map(({ slug, title, location, type, skills, industry }) => (
              <Link key={slug} to={`/jobs/${slug}`} className="service-card job-card service-card-link">
                <div className="job-meta">
                  <span className="job-tag">{type}</span>
                  {industry && <span className="job-industry-tag">🚗 {industry}</span>}
                  <span className="job-location">📍 {location}</span>
                </div>
                <h3>{title}</h3>
                <p className="job-skills">{skills}</p>
                <span className="card-cta">View Details →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
