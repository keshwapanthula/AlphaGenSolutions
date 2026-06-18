import './About.css';

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="about-content">
          <div className="section-badge">
            <span>About Us</span>
          </div>
          <h2 className="section-title">
            Building Tomorrow's Solutions <span className="text-gradient">Today</span>
          </h2>
          <p className="about-text">
            AlphaGen Solutions is a forward-thinking technology company dedicated to 
            transforming businesses through innovative software solutions. We combine 
            cutting-edge technology with deep industry expertise to deliver exceptional 
            results for our clients.
          </p>
          <p className="about-text">
            Our team of experienced professionals is passionate about solving complex 
            challenges and creating scalable, efficient solutions that drive real business 
            value. We pride ourselves on our commitment to excellence, innovation, and 
            client satisfaction.
          </p>
          
          <div className="about-features">
            <div className="feature">
              <div className="feature-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>To empower businesses with innovative technology solutions that drive growth and success.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>To be the leading provider of cutting-edge technology solutions that transform industries.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⭐</div>
              <h3>Our Values</h3>
              <p>Innovation, integrity, excellence, and client-focused solutions in everything we do.</p>
            </div>
          </div>
        </div>

        <div className="about-visual">
          <div className="visual-grid">
            <div className="grid-item item-1">
              <div className="grid-icon">💻</div>
              <span>Modern Tech</span>
            </div>
            <div className="grid-item item-2">
              <div className="grid-icon">🚀</div>
              <span>Fast Delivery</span>
            </div>
            <div className="grid-item item-3">
              <div className="grid-icon">🔒</div>
              <span>Secure</span>
            </div>
            <div className="grid-item item-4">
              <div className="grid-icon">📈</div>
              <span>Scalable</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
