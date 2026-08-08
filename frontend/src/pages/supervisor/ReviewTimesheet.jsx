import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/client.js';
import '../PortalLayout.css';

export default function ReviewTimesheet() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ts, setTs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    api.get(`/api/timesheets/${id}`)
      .then((data) => setTs(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const approve = async () => {
    setActing(true);
    setError('');
    try {
      await api.post(`/api/timesheets/${id}/approve`);
      setSuccess('Timesheet approved.');
      setTs((prev) => ({ ...prev, status: 'approved' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(false);
    }
  };

  const reject = async () => {
    if (!rejectNotes.trim()) { setError('Please enter a rejection reason.'); return; }
    setActing(true);
    setError('');
    try {
      await api.post(`/api/timesheets/${id}/reject`, { supervisorNotes: rejectNotes });
      setSuccess('Timesheet rejected.');
      setTs((prev) => ({ ...prev, status: 'rejected', supervisorNotes: rejectNotes }));
      setShowRejectForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading…</div>;
  if (!ts && error) return <div className="alert alert-error">{error}</div>;

  const canAct = ts?.status === 'submitted';

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/supervisor/dashboard')} style={{ marginBottom: '1rem' }}>
        ← Back
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1 className="portal-page-title" style={{ margin: 0 }}>
          Timesheet Review — {ts?.employeeId?.firstName} {ts?.employeeId?.lastName}
        </h1>
        <span className={`status-badge status-${ts?.status}`}>{ts?.status}</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="portal-card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <Stat label="Week Starting" value={fmt(ts?.weekStartDate)} />
          <Stat label="Week Ending" value={fmt(ts?.weekEndDate)} />
          <Stat label="Total Hours" value={ts?.totalHours?.toFixed(1)} />
          <Stat label="Submitted" value={ts?.submittedAt ? fmt(ts.submittedAt) : '—'} />
        </div>

        {ts?.employeeNotes && (
          <div style={{ background: '#f8fafc', borderRadius: '6px', padding: '0.75rem', marginBottom: '1rem' }}>
            <strong style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>EMPLOYEE NOTES</strong>
            <p style={{ margin: 0, color: '#334155' }}>{ts.employeeNotes}</p>
          </div>
        )}

        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
          Time Entries
        </h3>

        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project Code</th>
                <th>Task Description</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {ts?.entries?.map((e, i) => (
                <tr key={i}>
                  <td>{fmt(e.date)}</td>
                  <td>{e.projectCode || '—'}</td>
                  <td>{e.taskDescription}</td>
                  <td>{e.hoursWorked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {ts?.supervisorNotes && (
        <div className="portal-card" style={{ marginBottom: '1rem', background: ts.status === 'rejected' ? '#fef2f2' : '#f0fdf4' }}>
          <strong style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>SUPERVISOR NOTES</strong>
          <p style={{ margin: 0 }}>{ts.supervisorNotes}</p>
        </div>
      )}

      {canAct && (
        <div className="portal-card">
          {!showRejectForm ? (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-success" onClick={approve} disabled={acting}>
                {acting ? 'Approving…' : '✓ Approve'}
              </button>
              <button className="btn btn-danger" onClick={() => setShowRejectForm(true)}>
                ✕ Reject
              </button>
            </div>
          ) : (
            <div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label htmlFor="rejectNotes">Rejection Reason (required)</label>
                <textarea
                  id="rejectNotes"
                  rows="3"
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Explain why this timesheet is being rejected…"
                  style={{ padding: '0.55rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-danger" onClick={reject} disabled={acting}>
                  {acting ? 'Rejecting…' : 'Confirm Rejection'}
                </button>
                <button className="btn btn-ghost" onClick={() => { setShowRejectForm(false); setError(''); }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
