import './Hero.css';

export default function Hero() {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🚀</span>
            <span>Leading Innovation</span>
          </div>
          <h1 className="hero-title">
            Empowering Your Business with
            <span className="hero-gradient"> Next-Gen Solutions</span>
          </h1>
          <p className="hero-description">
            Transform your business with cutting-edge technology solutions. 
            AlphaGen Solutions delivers innovative, scalable, and efficient 
            software tailored to your needs.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={scrollToContact}>
              Get Started
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn btn-secondary" onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>
              Our Services
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">100+</div>
              <div className="stat-label">Projects Delivered</div>
            </div>
            <div className="stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">Happy Clients</div>
            </div>
            <div className="stat">
              <div className="stat-number">99%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">💡</div>
            <div className="card-text">Innovation</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">⚡</div>
            <div className="card-text">Performance</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🎯</div>
            <div className="card-text">Precision</div>
          </div>
          <div className="hero-circle"></div>
        </div>
      </div>
      <div className="hero-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  );
}
