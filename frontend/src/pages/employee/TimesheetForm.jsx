import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/client.js';
import './TimesheetForm.css';

const EMPTY_ENTRY = { date: '', projectCode: '', taskDescription: '', hoursWorked: '' };

export default function TimesheetForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [weekOf, setWeekOf] = useState('');
  const [entries, setEntries] = useState([{ ...EMPTY_ENTRY }]);
  const [employeeNotes, setEmployeeNotes] = useState('');
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isNew) {
      api.get(`/api/timesheets/${id}`)
        .then((data) => {
          const ts = data.data;
          setWeekOf(ts.weekStartDate?.slice(0, 10) || '');
          setEntries(ts.entries.map((e) => ({
            date: e.date?.slice(0, 10) || '',
            projectCode: e.projectCode || '',
            taskDescription: e.taskDescription || '',
            hoursWorked: String(e.hoursWorked)
          })));
          setEmployeeNotes(ts.employeeNotes || '');
          setStatus(ts.status);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const totalHours = entries.reduce((sum, e) => sum + (parseFloat(e.hoursWorked) || 0), 0);
  const readOnly = status !== 'draft';

  const setEntry = (idx, field, value) =>
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));

  const addEntry = () => setEntries((prev) => [...prev, { ...EMPTY_ENTRY }]);
  const removeEntry = (idx) => setEntries((prev) => prev.filter((_, i) => i !== idx));

  const save = async (submitAfter = false) => {
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = {
        weekOf,
        entries: entries.map((e) => ({ ...e, hoursWorked: parseFloat(e.hoursWorked) })),
        employeeNotes
      };
      let result;
      if (isNew) {
        result = await api.post('/api/timesheets', payload);
      } else {
        result = await api.put(`/api/timesheets/${id}`, payload);
      }
      const savedId = result.data._id;
      if (submitAfter) {
        await api.post(`/api/timesheets/${savedId}/submit`);
        setSuccess('Timesheet submitted for review!');
        setTimeout(() => navigate('/employee/dashboard'), 1500);
      } else {
        setSuccess('Timesheet saved as draft.');
        if (isNew) navigate(`/employee/timesheet/${savedId}`, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading…</div>;

  return (
    <div>
      <h1 className="portal-page-title">{isNew ? 'New Timesheet' : readOnly ? 'View Timesheet' : 'Edit Timesheet'}</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {readOnly && (
        <div className="alert" style={{ background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e' }}>
          This timesheet is <strong>{status}</strong> and cannot be edited.
        </div>
      )}

      <div className="portal-card">
        <div className="ts-form-row">
          <div className="form-group">
            <label htmlFor="weekOf">Week of (any day in that week)</label>
            <input
              id="weekOf"
              type="date"
              value={weekOf}
              onChange={(e) => setWeekOf(e.target.value)}
              disabled={readOnly}
            />
          </div>
          <div className="form-group ts-total">
            <span className="ts-total-label">Total Hours</span>
            <span className="ts-total-value">{totalHours.toFixed(1)}</span>
          </div>
        </div>

        <h3 className="ts-section-title">Time Entries</h3>

        <div className="ts-entries">
          {entries.map((entry, idx) => (
            <div key={idx} className="ts-entry">
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={entry.date} onChange={(e) => setEntry(idx, 'date', e.target.value)} disabled={readOnly} />
              </div>
              <div className="form-group">
                <label>Project Code</label>
                <input type="text" value={entry.projectCode} onChange={(e) => setEntry(idx, 'projectCode', e.target.value)} disabled={readOnly} placeholder="e.g. PROJ-001" />
              </div>
              <div className="form-group ts-task">
                <label>Task Description</label>
                <input type="text" value={entry.taskDescription} onChange={(e) => setEntry(idx, 'taskDescription', e.target.value)} disabled={readOnly} placeholder="What did you work on?" />
              </div>
              <div className="form-group ts-hours">
                <label>Hours</label>
                <input type="number" step="0.25" min="0.25" max="24" value={entry.hoursWorked} onChange={(e) => setEntry(idx, 'hoursWorked', e.target.value)} disabled={readOnly} placeholder="8" />
              </div>
              {!readOnly && entries.length > 1 && (
                <button type="button" className="ts-remove-btn" onClick={() => removeEntry(idx)} aria-label="Remove entry">✕</button>
              )}
            </div>
          ))}
        </div>

        {!readOnly && (
          <button type="button" className="btn btn-ghost" onClick={addEntry} style={{ marginTop: '0.5rem' }}>
            + Add Entry
          </button>
        )}

        <div className="form-group" style={{ marginTop: '1.25rem' }}>
          <label htmlFor="notes">Notes (optional)</label>
          <textarea id="notes" rows="3" value={employeeNotes} onChange={(e) => setEmployeeNotes(e.target.value)} disabled={readOnly} placeholder="Any notes for your supervisor…" />
        </div>

        {!readOnly && (
          <div className="ts-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/employee/dashboard')}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={() => save(false)} disabled={saving}>
              {saving ? 'Saving…' : 'Save Draft'}
            </button>
            <button type="button" className="btn btn-success" onClick={() => save(true)} disabled={saving}>
              {saving ? 'Submitting…' : 'Submit for Review'}
            </button>
          </div>
        )}

        {readOnly && (
          <div className="ts-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/employee/dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
