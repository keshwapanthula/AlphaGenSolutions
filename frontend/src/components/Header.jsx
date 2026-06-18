import { useState } from 'react';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-alpha">Alpha</span>
          <span className="logo-gen">Gen</span>
          <span className="logo-solutions">Solutions</span>
        </div>
        
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
          <a onClick={() => scrollToSection('home')} className="nav-link">Home</a>
          <a onClick={() => scrollToSection('about')} className="nav-link">About</a>
          <a onClick={() => scrollToSection('services')} className="nav-link">Services</a>
          <a onClick={() => scrollToSection('contact')} className="nav-link contact-btn">Contact Us</a>
        </nav>
      </div>
    </header>
  );
}
