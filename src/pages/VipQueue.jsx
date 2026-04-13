import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import './Logs.css';

export default function VipQueue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

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

          <div className="logs-table-wrapper">
            <table className="logs-data-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>NAME</th>
                  <th>PERSON TO VISIT</th>
                  <th>ADDED BY</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>Loading...</td>
                  </tr>
                ) : filteredQueueLogs.length > 0 ? (
                  filteredQueueLogs.map((log) => (
                    <tr key={`queue-${log.id}`}>
                      <td>{log.date}</td>
                      <td>{log.name}</td>
                      <td>{log.person_to_visit}</td>
                      <td>{log.added_by}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>No VIPs in queue</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


        </div>
      </main>
    </div>
  );
}
