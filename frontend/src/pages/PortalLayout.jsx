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

  const dashboardLink =
    user?.role === 'employee' ? '/employee/dashboard' : '/supervisor/dashboard';

  return (
    <div className="portal-layout">
      <header className="portal-header">
        <div className="portal-header-inner">
          <Link to={dashboardLink} className="portal-logo">
            <strong>AlphaGen</strong><em>Solutions</em>
            <span className="portal-badge">Portal</span>
          </Link>
          <nav className="portal-nav">
            {(user?.role === 'supervisor' || user?.role === 'admin') && (
              <Link to="/supervisor/dashboard">Supervisor</Link>
            )}
            {user?.role !== 'supervisor' && user?.role !== 'admin' && (
              <>
                <Link to="/employee/dashboard">My Timesheets</Link>
                <Link to="/employee/timesheet/new">New Timesheet</Link>
              </>
            )}
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
