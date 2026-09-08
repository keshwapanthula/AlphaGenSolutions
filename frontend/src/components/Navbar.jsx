import { Link, useLocation } from 'react-router-dom';
import '../App.css';

export default function Navbar() {
  const { pathname } = useLocation();
  const active = (path) => pathname === path ? 'nav-active' : '';

  return (
    <nav className="navbar">
      <div className="container">
        <Link className="logo" to="/" aria-label="AlphaGen Solutions home">
          <img src="/brand/logo-mark.svg" alt="" aria-hidden="true" />
          <span>
            <strong>Alpha Gen</strong>
            <em>Solutions</em>
          </span>
        </Link>
        <ul className="nav-links">
          <li><Link to="/" className={active('/')}>Home</Link></li>
          <li><Link to="/about" className={active('/about')}>About Us</Link></li>
          <li><Link to="/services" className={active('/services')}>Services</Link></li>
          <li><Link to="/jobs" className={active('/jobs')}>Job</Link></li>
          <li><Link to="/trainings" className={active('/trainings')}>Trainings</Link></li>
          <li><Link to="/contact" className={`nav-contact-link ${active('/contact')}`}>Contact Us</Link></li>
        </ul>
      </div>
    </nav>
  );
}
