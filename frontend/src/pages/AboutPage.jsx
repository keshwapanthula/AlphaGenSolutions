import { Link } from 'react-router-dom';
import '../App.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const STATS = [
  { value: '500+', label: 'Projects Delivered', icon: '🚀' },
  { value: '200+', label: 'Happy Clients',       icon: '🤝' },
  { value: '50+',  label: 'Expert Engineers',    icon: '👩‍💻' },
  { value: '10+',  label: 'Years Experience',    icon: '🏆' },
];

const VALUES = [
  {
    icon: '💡',
    title: 'Innovation First',
    desc: 'We stay at the cutting edge of cloud, AI, and software engineering — bringing tomorrow\'s tools to your business today.',
  },
  {
    icon: '🔒',
    title: 'Trust & Transparency',
    desc: 'Every engagement is built on open communication, honest timelines, and accountability at every stage of delivery.',
  },
  {
    icon: '⚡',
    title: 'Speed to Value',
    desc: 'Agile delivery, rapid prototyping, and CI/CD pipelines mean your product reaches users fast — without sacrificing quality.',
  },
  {
    icon: '🌍',
    title: 'Global Talent Network',
    desc: 'Access a vetted bench of US-based and global IT professionals ready to embed with your team or take ownership of a project.',
  },
  {
    icon: '📈',
    title: 'Results-Driven',
    desc: 'We measure success by your outcomes — reduced cost, faster release cycles, and technology that scales with your growth.',
  },
  {
    icon: '🎓',
    title: 'Continuous Learning',
    desc: 'Our engineers invest in ongoing certifications and training so you always get expertise aligned with the latest industry standards.',
  },
];

export default function AboutPage() {
  return (
    <div className="app themed-page page-about">
      <Navbar />

      {/* ── Hero Banner ─────────────────────────────── */}
      <section className="about-hero page-hero page-hero-about">
        <div className="container">
          <div className="about-hero-badge">Our Story</div>
          <h1 className="about-hero-title">
            Building Tomorrow's Technology, <span className="text-teal">Today</span>
          </h1>
          <p className="about-hero-sub">
            AlphaGen Solutions is a technology consultancy specialising in cloud infrastructure,
            AI-powered software, and elite IT staffing — helping startups and Fortune 500s alike
            transform the way they build and operate.
          </p>
          <div className="detail-actions" style={{ marginTop: '36px' }}>
            <Link to="/contact" className="btn btn-primary">Work With Us</Link>
            <Link to="/services" className="btn btn-secondary">Our Services →</Link>
          </div>
        </div>
      </section>

      {/* ── Stats Grid ──────────────────────────────── */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            {STATS.map(({ value, label, icon }) => (
              <div key={label} className="stat-card">
                <div className="stat-icon">{icon}</div>
                <div className="stat-number">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ───────────────────────────────── */}
      <section className="about page-section" style={{ paddingTop: '64px' }}>
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-text">
              <h2 className="section-title">Who We Are</h2>
              <p>
                Founded with a vision to bridge the gap between technology and business success,
                AlphaGen Solutions has grown into a trusted partner for enterprises worldwide.
                Our team of seasoned engineers, architects, and consultants brings deep expertise
                across cloud, AI, data, and custom software development.
              </p>
              <p>
                We specialise in placing top-tier IT professionals with leading companies while
                also offering world-class training programs to help candidates upskill and land
                their dream roles. Whether you are a startup scaling fast or a Fortune 500
                modernising legacy systems, AlphaGen has the talent and technology to make it happen.
              </p>
              <p>
                Headquartered in Michigan and operating across the US, we combine the agility of
                a boutique consultancy with the delivery capacity of an enterprise partner — giving
                you the best of both worlds.
              </p>
            </div>
            <div className="about-story-highlights">
              <div className="about-highlight-card">
                <span className="about-highlight-icon">☁️</span>
                <div>
                  <strong>Cloud-Native Expertise</strong>
                  <p>AWS, Azure & GCP certified architects designing scalable, resilient systems.</p>
                </div>
              </div>
              <div className="about-highlight-card">
                <span className="about-highlight-icon">🤖</span>
                <div>
                  <strong>AI & Data Leadership</strong>
                  <p>From LLM integration to real-time analytics pipelines built for production.</p>
                </div>
              </div>
              <div className="about-highlight-card">
                <span className="about-highlight-icon">👥</span>
                <div>
                  <strong>Elite IT Staffing</strong>
                  <p>W2 placement, visa sponsorship, and career support for IT professionals.</p>
                </div>
              </div>
              <div className="about-highlight-card">
                <span className="about-highlight-icon">📋</span>
                <div>
                  <strong>End-to-End Training</strong>
                  <p>Instructor-led bootcamps with job placement backing for every graduate.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values Grid ─────────────────────────────── */}
      <section className="services" style={{ paddingTop: '0' }}>
        <div className="container">
          <h2 className="section-title">What Sets Us Apart</h2>
          <div className="services-grid">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="service-card">
                <div className="service-icon emoji-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────── */}
      <section className="contact" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title">Ready to Partner With Us?</h2>
          <p className="contact-subtitle">
            Let's discuss how AlphaGen can accelerate your next project or connect you
            with the right IT talent.
          </p>
          <div className="detail-actions">
            <Link to="/contact" className="btn btn-primary">Get in Touch</Link>
            <Link to="/jobs" className="btn btn-secondary">View Open Roles →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
