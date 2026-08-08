import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './PortalLayout.css';

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="portal-layout">
      <header className="portal-header">
        <div className="portal-header-inner">
          <Link to="/dashboard" className="portal-logo">
            <strong>AlphaGen</strong><em>Solutions</em>
            <span className="portal-badge">Employee Portal</span>
          </Link>
          <nav className="portal-nav">
            <Link to="/dashboard">My Timesheets</Link>
            <Link to="/timesheet/new">New Timesheet</Link>
          </nav>
          <div className="portal-user">
            <span className="portal-user-name">{user?.firstName} {user?.lastName}</span>
            <span className="portal-role-badge">{user?.role}</span>
            <button onClick={handleLogout} className="btn-logout">Sign Out</button>
          </div>
        </div>
      </header>
      <main className="portal-main">
        <Outlet />
      </main>
    </div>
  );
}
