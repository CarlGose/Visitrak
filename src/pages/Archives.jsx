import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';
import './Archives.css';

export default function Archives() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [exportType, setExportType] = useState(''); // 'month' or 'day'
  const [exportMonthValue, setExportMonthValue] = useState('');
  const [exportDayValue, setExportDayValue] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const [showVip, setShowVip] = useState(false); // Toggle between Regular and VIP logs
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('visitor_logs')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) {
      setLogs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();

    const channel = supabase
      .channel('archives-visitor-logs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'visitor_logs' },
        () => { fetchLogs(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const normalizeDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      const m = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const d = String(parsedDate.getDate()).padStart(2, '0');
      const y = parsedDate.getFullYear();
      return `${y}-${m}-${d}`;
    }
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      let [m, d, y] = parts;
      if (m.length === 1) m = '0' + m;
      if (d.length === 1) d = '0' + d;
      if (y.length === 2) y = '20' + y;
      return `${y}-${m}-${d}`;
    }
    return dateStr;
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [y, m, d] = dateStr.split('-');
      return `${m}/${d}/${y}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const mn = String(d.getMonth() + 1).padStart(2, '0');
      const dy = String(d.getDate()).padStart(2, '0');
      const yr = d.getFullYear();
      return `${mn}/${dy}/${yr}`;
    }
    return dateStr.replace(/-/g, '/'); // fallback
  };

  const calculateDuration = (timeIn, timeOut) => {
    if (!timeIn || !timeOut) return '';
    const parseTime = (timeStr) => {
      if (!timeStr) return 0;
      const parts = timeStr.trim().split(' ');
      if (parts.length < 2) return 0;
      let [time, modifier] = parts;
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);
      if (hours === 12) {
        hours = modifier.toUpperCase() === 'AM' ? 0 : 12;
      } else if (modifier.toUpperCase() === 'PM') {
        hours += 12;
      }
      return hours * 60 + minutes;
    };
    try {
      const inMins = parseTime(timeIn);
      const outMins = parseTime(timeOut);
      if (inMins === 0 || outMins === 0) return '';
      let diff = outMins - inMins;
      if (diff < 0) diff += 24 * 60;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      if (h > 0) return `${h}h ${m}m`;
      return `${m}m`;
    } catch {
      return '';
    }
  };

  const getCurrentWeekMondayDate = () => {
    const d = new Date();
    const day = d.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    const y = monday.getFullYear();
    const m = String(monday.getMonth() + 1).padStart(2, '0');
    const dateVal = String(monday.getDate()).padStart(2, '0');
    return `${y}-${m}-${dateVal}`;
  };

  // Filter archived logs (logs before current week's Monday, matches search / date, matches showVip category)
  const filteredArchivedLogs = logs.filter(log => {
    const normDate = normalizeDate(log.date);
    const currentWeekMondayStr = getCurrentWeekMondayDate();

    // Check if the record is archived (before current week's Monday)
    const isArchived = normDate && normDate < currentWeekMondayStr;
    if (!isArchived) return false;

    // Check VIP category match
    if (log.is_vip !== showVip) return false;

    // Search query matches
    const searchVal = searchTerm.toLowerCase();
    const matchesSearch =
      log.name.toLowerCase().includes(searchVal) ||
      (log.address && log.address.toLowerCase().includes(searchVal)) ||
      (log.company && log.company.toLowerCase().includes(searchVal)) ||
      (log.destination && log.destination.toLowerCase().includes(searchVal)) ||
      (log.purpose && log.purpose.toLowerCase().includes(searchVal));

    // Calendar selected date matches
    const matchesDate = selectedDate ? normalizeDate(log.date) === selectedDate : true;

    return matchesSearch && matchesDate;
  });

  const handleExport = async () => {
    setIsExporting(true);
    // Grab all logs of current view type
    const { data, error } = await supabase
      .from('visitor_logs')
      .select('*')
      .eq('is_vip', showVip);

    if (error) {
      console.error(error);
      setIsExporting(false);
      return;
    }

    const currentWeekMondayStr = getCurrentWeekMondayDate();

    // Filter archived logs on client side for maximum reliability with mixed date formats
    let filteredData = (data || []).filter(row => {
      const normDate = normalizeDate(row.date);
      return normDate && normDate < currentWeekMondayStr;
    });

    if (exportType === 'day' && exportDayValue) {
      filteredData = filteredData.filter(row => normalizeDate(row.date) === exportDayValue);
    } else if (exportType === 'month' && exportMonthValue) {
      filteredData = filteredData.filter(row => normalizeDate(row.date).startsWith(exportMonthValue));
    }

    processExport(filteredData);
    setIsExporting(false);
  };

  const processExport = (dataToExport) => {
    if (!dataToExport || dataToExport.length === 0) {
      alert("No archived logs found for the selected timeframe.");
      return;
    }

    const combinedLogs = dataToExport.map(log => {
      if (log.is_vip) {
        return {
          Date: formatDateDisplay(log.date),
          'Time In': log.time_in,
          'Time Out': log.time_out || 'Active',
          Duration: log.time_out ? calculateDuration(log.time_in, log.time_out) : '-',
          Name: log.name,
          Type: 'VIP',
          'Address / Company': log.company || '',
          'Plate No': log.plate_no || '',
          Destination: log.destination || '',
          Purpose: log.purpose || '',
          'Gate In': log.gate_in || '',
          'Gate Out': log.gate_out || ''
        };
      } else {
        return {
          Date: formatDateDisplay(log.date),
          'Time In': log.time_in,
          'Time Out': log.time_out || 'Active',
          Duration: log.time_out ? calculateDuration(log.time_in, log.time_out) : '-',
          Name: log.name,
          Type: 'Regular',
          'Address / Company': log.address || '',
          'Plate No': '',
          Destination: log.destination || '',
          Purpose: log.purpose || '',
          'Gate In': log.gate_in || '',
          'Gate Out': log.gate_out || ''
        };
      }
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(combinedLogs);
    XLSX.utils.book_append_sheet(wb, ws, "Archived Logs");

    const category = showVip ? 'VIPLogs' : 'VisitorLogs';
    const filename = exportType === 'day' 
      ? `VisiTrack_Archived_${category}_${exportDayValue}.xlsx` 
      : `VisiTrack_Archived_${category}_${exportMonthValue || 'All'}.xlsx`;

    XLSX.writeFile(wb, filename);

    setExportMenuOpen(false);
    setExportType('');
  };

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
                placeholder={showVip ? "search by name or destination" : "search by name"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="archives-title-container">
              <h1 className="logs-page-title archives-title">System Archives</h1>
              <span className="archives-subtitle">Older Historical Logs</span>
            </div>

            <div className="calendar-container">
              {selectedDate && (
                <span className="selected-date-text">
                  {formatDateDisplay(selectedDate)}
                </span>
              )}
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

          <div className="archives-toggle-bar">
            <div className="archives-toggle-buttons">
              <button 
                className={`archives-toggle-btn ${!showVip ? 'active' : ''}`}
                onClick={() => { setShowVip(false); setSearchTerm(''); setSelectedDate(''); }}
              >
                Regular Archives
              </button>
              <button 
                className={`archives-toggle-btn ${showVip ? 'active' : ''}`}
                onClick={() => { setShowVip(true); setSearchTerm(''); setSelectedDate(''); }}
              >
                VIP Archives
              </button>
            </div>
            <div className="archives-info-text">
              🔒 Logs from previous calendar weeks are automatically archived here every Monday.
            </div>
          </div>

          <div className="logs-table-wrapper">
            <table className="logs-data-table">
              <thead>
                {showVip ? (
                  <tr>
                    <th>DATE</th>
                    <th>TIME IN</th>
                    <th>TIME OUT</th>
                    <th>DURATION</th>
                    <th>NAME</th>
                    <th>PERSON TO VISIT</th>
                  </tr>
                ) : (
                  <tr>
                    <th>DATE</th>
                    <th>TIME-IN</th>
                    <th>GATE-IN</th>
                    <th>TIME-OUT</th>
                    <th>GATE-OUT</th>
                    <th>DURATION</th>
                    <th>NAME</th>
                    <th>ADDRESS</th>
                    <th>DESTINATION</th>
                    <th>PURPOSE</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={showVip ? "6" : "10"} style={{ textAlign: 'center' }}>Loading archives...</td>
                  </tr>
                ) : filteredArchivedLogs.length > 0 ? (
                  filteredArchivedLogs.map((log) => (
                    <tr key={`arch-${log.id}`}>
                      {showVip ? (
                        <>
                          <td>{formatDateDisplay(log.date)}</td>
                          <td>{log.time_in}</td>
                          <td>{log.time_out || 'Active'}</td>
                          <td>{log.time_out ? calculateDuration(log.time_in, log.time_out) : '-'}</td>
                          <td>{log.name}</td>
                          <td>{log.destination}</td>
                        </>
                      ) : (
                        <>
                          <td>{formatDateDisplay(log.date)}</td>
                          <td>{log.time_in}</td>
                          <td>{log.gate_in || '—'}</td>
                          <td className={log.time_out ? '' : 'time-out-active'}>
                            {log.time_out || 'Active'}
                          </td>
                          <td>{log.gate_out || '—'}</td>
                          <td>{log.time_out ? calculateDuration(log.time_in, log.time_out) : '-'}</td>
                          <td>{log.name}</td>
                          <td>{log.address}</td>
                          <td>{log.destination}</td>
                          <td>{log.purpose}</td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={showVip ? "6" : "10"} style={{ textAlign: 'center' }}>No archived logs found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="logs-footer">
            <div className="export-container">
              <button className="export-btn" onClick={() => setExportMenuOpen(!exportMenuOpen)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export Archives
              </button>

              {exportMenuOpen && (
                <div className="export-dropdown" style={{ padding: '12px', minWidth: '220px', right: 0 }}>
                  {!exportType ? (
                    <>
                      <button onClick={() => setExportType('day')} style={{ width: '100%', marginBottom: '6px', textAlign: 'left', padding: '10px' }}>Export Specific Day</button>
                      <button onClick={() => setExportType('month')} style={{ width: '100%', textAlign: 'left', padding: '10px' }}>Export Specific Month</button>
                      <button onClick={() => { setExportType('all'); handleExport(); }} style={{ width: '100%', marginTop: '6px', textAlign: 'left', padding: '10px', background: '#10b981', color: 'white', borderRadius: '4px' }}>Export All Archives</button>
                    </>
                  ) : exportType === 'day' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a2820' }}>Select Day:</label>
                      <input
                        type="date"
                        value={exportDayValue}
                        onChange={(e) => setExportDayValue(e.target.value)}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
                      />
                      <button onClick={handleExport} disabled={isExporting || !exportDayValue} style={{ background: '#10b981', color: 'white', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}>
                        {isExporting ? 'Exporting...' : 'Download Excel'}
                      </button>
                      <button onClick={() => setExportType('')} style={{ background: '#f3f4f6', color: '#333', padding: '8px', borderRadius: '6px' }}>Back</button>
                    </div>
                  ) : exportType === 'month' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a2820' }}>Select Month:</label>
                      <input
                        type="month"
                        value={exportMonthValue}
                        onChange={(e) => setExportMonthValue(e.target.value)}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
                      />
                      <button onClick={handleExport} disabled={isExporting || !exportMonthValue} style={{ background: '#10b981', color: 'white', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}>
                        {isExporting ? 'Exporting...' : 'Download Excel'}
                      </button>
                      <button onClick={() => setExportType('')} style={{ background: '#f3f4f6', color: '#333', padding: '8px', borderRadius: '6px' }}>Back</button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
