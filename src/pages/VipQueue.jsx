import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import './Logs.css';

export default function VipQueue() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  // VIP/CAR Form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', plate: '', personToVisit: '', date: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const fetchQueue = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vip_queue')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) {
      setQueue(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();

    const channel = supabase
      .channel('vipqueue-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vip_queue' },
        () => { fetchQueue(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const normalizeDate = (dateStr) => {
    const parts = dateStr?.split('-') || [];
    if (parts.length !== 3) return dateStr;
    let [m, d, y] = parts;
    if (m.length === 1) m = '0' + m;
    if (d.length === 1) d = '0' + d;
    if (y.length === 2) y = '20' + y;
    return `${y}-${m}-${d}`;
  };

  const handleAddVip = async (e) => {
    e.preventDefault();
    if (!form.name || !form.plate || !form.personToVisit || !form.date) return;
    setSubmitting(true);

    const { error } = await supabase.from('vip_queue').insert([{
      name: form.name,
      plate: form.plate,
      person_to_visit: form.personToVisit,
      date: form.date,
      added_by: user?.name || 'Admin',
      timestamp: new Date().toLocaleTimeString()
    }]);

    if (!error) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', plate: '', personToVisit: '', date: '' });
      }, 2000);
      fetchQueue();
    } else {
      console.error(error);
      alert('Error adding VIP entry.');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this VIP from the queue?')) return;
    await supabase.from('vip_queue').delete().eq('id', id);
    fetchQueue();
  };

  const filteredQueueLogs = queue.filter(log => {
    const matchesSearch =
      log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.person_to_visit || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate ? normalizeDate(log.date) === selectedDate : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="logs-page">
      <Header />
      <main className="logs-content">
        <div className="logs-container">

          <div className="logs-header-section">
            <div className="search-bar">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="search by name or person to visit"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <h1 className="logs-page-title">VIP Queue</h1>

            <div className="calendar-container">
              <button className={`calendar-btn ${selectedDate ? 'active-date' : ''}`} aria-label="Select Date">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </button>
              <input
                type="date"
                className="calendar-date-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                title="Filter by date"
              />
              {selectedDate && (
                <button className="clear-date-btn" onClick={() => setSelectedDate('')} title="Clear Date">
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Add VIP toggle button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              id="admin-add-vip-btn"
              onClick={() => setShowForm(!showForm)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: showForm ? '#fef3c7' : '#fffbeb',
                color: '#92400e',
                border: '1.5px solid #fbbf24',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
                boxShadow: showForm ? '0 2px 8px rgba(251, 191, 36, 0.3)' : 'none'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {showForm ? (
                  <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                ) : (
                  <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>
                )}
              </svg>
              {showForm ? 'Close Form' : 'Add VIP / CAR'}
            </button>
          </div>

          {/* VIP/CAR Entry Form */}
          {showForm && (
            <div style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              border: '1.5px solid #fbbf24',
              borderRadius: '16px',
              padding: '28px 32px',
              marginBottom: '24px',
              animation: 'fadeSlideDown 0.3s ease-out',
              boxShadow: '0 4px 16px rgba(251, 191, 36, 0.15)'
            }}>
              <h3 style={{
                margin: '0 0 20px',
                fontSize: '1.15rem',
                fontWeight: '800',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                VIP / CAR Entry
              </h3>

              {submitted && (
                <div style={{
                  padding: '10px 16px',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  color: '#166534',
                  borderRadius: '10px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  VIP entry added to queue successfully!
                </div>
              )}

              <form onSubmit={handleAddVip} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px 20px',
                alignItems: 'end'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#78350f', marginBottom: '5px' }}>
                    Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="admin-vip-name"
                    type="text"
                    placeholder="Visitor's full name"
                    value={form.name}
                    onChange={set('name')}
                    required
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      border: '1.5px solid #e5d5a0', fontSize: '0.92rem',
                      fontFamily: 'inherit', backgroundColor: '#fffef7',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#78350f', marginBottom: '5px' }}>
                    Plate No. <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="admin-vip-plate"
                    type="text"
                    placeholder="Vehicle plate number"
                    value={form.plate}
                    onChange={set('plate')}
                    required
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      border: '1.5px solid #e5d5a0', fontSize: '0.92rem',
                      fontFamily: 'inherit', backgroundColor: '#fffef7',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#78350f', marginBottom: '5px' }}>
                    Person to Visit <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="admin-vip-person"
                    type="text"
                    placeholder="Whom they are visiting"
                    value={form.personToVisit}
                    onChange={set('personToVisit')}
                    required
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      border: '1.5px solid #e5d5a0', fontSize: '0.92rem',
                      fontFamily: 'inherit', backgroundColor: '#fffef7',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#78350f', marginBottom: '5px' }}>
                    Date <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="admin-vip-date"
                    type="date"
                    value={form.date}
                    onChange={set('date')}
                    required
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      border: '1.5px solid #e5d5a0', fontSize: '0.92rem',
                      fontFamily: 'inherit', backgroundColor: '#fffef7',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    id="admin-vip-submit-btn"
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: '11px 32px',
                      backgroundColor: '#d97706',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '800',
                      fontSize: '0.92rem',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      opacity: submitting ? 0.7 : 1,
                      boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)'
                    }}
                  >
                    {submitting ? 'Adding...' : 'Add to Queue'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="logs-table-wrapper">
            <table className="logs-data-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>NAME</th>
                  <th>PLATE NO.</th>
                  <th>PERSON TO VISIT</th>
                  <th>ADDED BY</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td>
                  </tr>
                ) : filteredQueueLogs.length > 0 ? (
                  filteredQueueLogs.map((log) => (
                    <tr key={`queue-${log.id}`}>
                      <td>{log.date}</td>
                      <td>{log.name}</td>
                      <td>{log.plate || '—'}</td>
                      <td>{log.person_to_visit}</td>
                      <td>{log.added_by}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleDelete(log.id)}
                          title="Remove from queue"
                          style={{
                            padding: '5px 12px',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            fontWeight: '700',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s'
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>No VIPs in queue</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
