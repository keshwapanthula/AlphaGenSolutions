import './Services.css';

export default function Services() {
  const services = [
    {
      icon: '🎨',
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies, responsive design, and optimal performance.',
      features: ['React & Vue.js', 'Node.js & Python', 'RESTful APIs', 'Cloud Deployment']
    },
    {
      icon: '📱',
      title: 'Mobile Solutions',
      description: 'Native and cross-platform mobile apps that deliver exceptional user experiences on all devices.',
      features: ['iOS & Android', 'React Native', 'Flutter', 'Progressive Web Apps']
    },
    {
      icon: '☁️',
      title: 'Cloud Services',
      description: 'Scalable cloud infrastructure and migration services for modern, distributed applications.',
      features: ['AWS & Azure', 'Cloud Migration', 'DevOps & CI/CD', 'Microservices']
    },
    {
      icon: '🤖',
      title: 'AI & Automation',
      description: 'Intelligent automation solutions and AI-powered applications to streamline your business processes.',
      features: ['Machine Learning', 'Process Automation', 'Data Analytics', 'Chatbots & AI']
    },
    {
      icon: '🔐',
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions to protect your digital assets and ensure compliance.',
      features: ['Security Audits', 'Penetration Testing', 'Compliance', 'Threat Protection']
    },
    {
      icon: '💼',
      title: 'IT Consulting',
      description: 'Strategic technology consulting to help you make informed decisions and optimize your tech stack.',
      features: ['Tech Strategy', 'Architecture Design', 'Code Review', 'Best Practices']
    }
  ];

  return (
    <section id="services" className="services">
      <div className="services-container">
        <div className="services-header">
          <div className="section-badge">
            <span>Our Services</span>
          </div>
          <h2 className="section-title">
            Comprehensive Solutions for <span className="text-gradient">Your Success</span>
          </h2>
          <p className="services-subtitle">
            We offer a full spectrum of technology services designed to meet your unique business needs
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>
                    <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13.3334 4L6.00002 11.3333L2.66669 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="service-btn">
                Learn More
                <svg className="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
