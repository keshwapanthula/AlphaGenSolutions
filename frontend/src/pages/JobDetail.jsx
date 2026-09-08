import { Link, Navigate, useParams } from 'react-router-dom';
import '../App.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { JOB_LISTINGS } from '../data';

export default function JobDetail() {
  const { slug } = useParams();
  const job = JOB_LISTINGS.find(j => j.slug === slug);

  if (!job) return <Navigate to="/jobs" replace />;

  return (
    <div className="app themed-page page-jobs">
      <Navbar />
      <section className="about page-section page-hero page-hero-jobs">
        <div className="container detail-page">
          <div className="job-meta" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            <span className="job-tag">{job.type}</span>
            <span className="job-location">📍 {job.location}</span>
          </div>
          <h2 className="section-title">{job.title}</h2>
          <p className="contact-subtitle">{job.skills}</p>
          <div className="about-content">
            <p>{job.detail}</p>
            {job.requirements && (
              <>
                <h3 style={{ marginTop: '28px', color: 'var(--teal)' }}>Requirements</h3>
                <ul className="detail-list">
                  {job.requirements.map(r => <li key={r}>{r}</li>)}
                </ul>
              </>
            )}
          </div>
          <div className="detail-actions">
            <Link to="/contact" className="btn btn-primary">Apply Now</Link>
            <Link to="/jobs" className="btn btn-secondary">← All Jobs</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
