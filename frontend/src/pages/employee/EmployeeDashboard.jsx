import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import '../PortalLayout.css';

export default function EmployeeDashboard() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/timesheets')
      .then((data) => setTimesheets(data.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen">Loading timesheets…</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 className="portal-page-title" style={{ margin: 0 }}>My Timesheets</h1>
        <Link to="/employee/timesheet/new" className="btn btn-primary">+ New Timesheet</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {timesheets.length === 0 ? (
        <div className="portal-card empty-state">
          <h3>No timesheets yet</h3>
          <p>Create your first timesheet to get started.</p>
          <Link to="/employee/timesheet/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Create Timesheet
          </Link>
        </div>
      ) : (
        <div className="portal-card portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Week Starting</th>
                <th>Week Ending</th>
                <th>Total Hours</th>
                <th>Status</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {timesheets.map((ts) => (
                <tr key={ts._id}>
                  <td>{fmt(ts.weekStartDate)}</td>
                  <td>{fmt(ts.weekEndDate)}</td>
                  <td>{ts.totalHours.toFixed(1)}</td>
                  <td><span className={`status-badge status-${ts.status}`}>{ts.status}</span></td>
                  <td>{ts.submittedAt ? fmt(ts.submittedAt) : '—'}</td>
                  <td>
                    <Link to={`/employee/timesheet/${ts._id}`} className="btn btn-ghost btn-sm">
                      {ts.status === 'draft' ? 'Edit' : 'View'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
