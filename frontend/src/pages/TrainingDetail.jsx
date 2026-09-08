import { Link, Navigate, useParams } from 'react-router-dom';
import '../App.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { TRAININGS } from '../data';

export default function TrainingDetail() {
  const { slug } = useParams();
  const training = TRAININGS.find(t => t.slug === slug);

  if (!training) return <Navigate to="/trainings" replace />;

  return (
    <div className="app themed-page page-trainings">
      <Navbar />
      <section className="about page-section page-hero page-hero-trainings">
        <div className="container detail-page">
          <div className="detail-emoji">{training.icon}</div>
          <div className="job-meta" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            <span className="job-tag">{training.duration}</span>
            <span className="job-location">{training.level}</span>
          </div>
          <h2 className="section-title">{training.title}</h2>
          <p className="contact-subtitle">{training.desc}</p>
          <div className="about-content">
            <p>{training.detail}</p>
            {training.curriculum && (
              <>
                <h3 style={{ marginTop: '28px', color: 'var(--teal)' }}>Curriculum Highlights</h3>
                <ul className="detail-list">
                  {training.curriculum.map(c => <li key={c}>{c}</li>)}
                </ul>
              </>
            )}
          </div>
          <div className="detail-actions">
            <Link to="/contact" className="btn btn-primary">Enroll Now</Link>
            <Link to="/trainings" className="btn btn-secondary">← All Programs</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
