import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import './PortalLayout.css';

export default function SupervisorDashboard() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('submitted');

  useEffect(() => {
    api.get('/api/timesheets')
      .then((data) => setTimesheets(data.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen">Loading…</div>;

  const filtered = filter === 'all'
    ? timesheets
    : timesheets.filter((ts) => ts.status === filter);

  const pending = timesheets.filter((ts) => ts.status === 'submitted').length;

  return (
    <div>
      <h1 className="portal-page-title">Team Timesheets</h1>

      {pending > 0 && (
        <div className="alert" style={{ background: '#eff6ff', border: '1px solid #93c5fd', color: '#1d4ed8', marginBottom: '1.25rem' }}>
          <strong>{pending}</strong> timesheet{pending > 1 ? 's' : ''} awaiting your review.
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div className="portal-card">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {['submitted', 'approved', 'rejected', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {f}
              {f === 'submitted' && pending > 0 && (
                <span style={{ marginLeft: '6px', background: '#dc2626', color: '#fff', borderRadius: '20px', padding: '0 6px', fontSize: '0.7rem' }}>
                  {pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No {filter === 'all' ? '' : filter} timesheets</h3>
          </div>
        ) : (
          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Week Starting</th>
                  <th>Total Hours</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ts) => (
                  <tr key={ts._id}>
                    <td>{ts.employeeId?.firstName} {ts.employeeId?.lastName}</td>
                    <td>{fmt(ts.weekStartDate)}</td>
                    <td>{ts.totalHours.toFixed(1)}</td>
                    <td><span className={`status-badge status-${ts.status}`}>{ts.status}</span></td>
                    <td>{ts.submittedAt ? fmt(ts.submittedAt) : '—'}</td>
                    <td>
                      <Link to={`/review/${ts._id}`} className="btn btn-ghost btn-sm">
                        {ts.status === 'submitted' ? 'Review' : 'View'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
