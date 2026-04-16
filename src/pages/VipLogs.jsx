import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';
import './Logs.css';

export default function VipLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const [exportType, setExportType] = useState(''); // 'month' or 'day'
  const [exportMonthValue, setExportMonthValue] = useState('');
  const [exportDayValue, setExportDayValue] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('visitor_logs')
      .select('*')
      .eq('is_vip', true)
      .order('id', { ascending: false });

    if (!error && data) {
      setLogs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();

    const channel = supabase
      .channel('viplogs-visitor-logs')
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
      if(!timeStr) return 0;
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
      if(inMins === 0 || outMins === 0) return '';
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


  const handleExport = async () => {
    setIsExporting(true);
    let query = supabase.from('visitor_logs').select('*').order('date', { ascending: false }).order('time_in', { ascending: false });

    if (exportType === 'day' && exportDayValue) {
      const { data } = await query;
      const filteredData = (data || []).filter(row => {
          const normDate = normalizeDate(row.date);
          return normDate === exportDayValue;
      });
      processExport(filteredData);
    } else if (exportType === 'month' && exportMonthValue) {
      const { data } = await query;
      const filteredData = (data || []).filter(row => {
          const normDate = normalizeDate(row.date);
          return normDate.startsWith(exportMonthValue);
      });
      processExport(filteredData);
    }
    
    setIsExporting(false);
  };

  const processExport = (dataToExport) => {
    if (!dataToExport || dataToExport.length === 0) {
      alert("No logs found for the selected timeframe.");
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
          'Expected Date': log.expected_date ? formatDateDisplay(log.expected_date) : ''
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
          'Expected Date': ''
        };
      }
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(combinedLogs);
    XLSX.utils.book_append_sheet(wb, ws, "All Logs");

    const filename = exportType === 'day' ? `WUP-VipLogs_${exportDayValue}.xlsx` : `WUP-VipLogs_${exportMonthValue}.xlsx`;
    XLSX.writeFile(wb, filename);

    setExportMenuOpen(false);
    setExportType('');
  };

  const filteredVipLogs = logs.filter(log => {
    const matchesSearch =
      log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.destination.toLowerCase().includes(searchTerm.toLowerCase());
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
                placeholder="search by name or destination"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <h1 className="logs-page-title">VIP Logs</h1>

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
                  <th>TIME IN</th>
                  <th>TIME OUT</th>
                  <th>DURATION</th>
                  <th>NAME</th>
                  <th>DESTINATION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td>
                  </tr>
                ) : filteredVipLogs.length > 0 ? (
                  filteredVipLogs.map((log) => (
                    <tr key={`vip-${log.id}`}>
                      <td>{formatDateDisplay(log.date)}</td>
                      <td>{log.time_in}</td>
                      <td>{log.time_out || 'Active'}</td>
                      <td>{log.time_out ? calculateDuration(log.time_in, log.time_out) : '-'}</td>
                      <td>{log.name}</td>
                      <td>{log.destination}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>No VIP logs found</td>
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
                Export
              </button>
              {exportMenuOpen && (
                <div className="export-dropdown" style={{ padding: '12px', minWidth: '220px', right: 0 }}>
                  {!exportType ? (
                    <>
                      <button onClick={() => setExportType('day')} style={{ width: '100%', marginBottom: '6px', textAlign: 'left', padding: '10px' }}>Export Specific Day</button>
                      <button onClick={() => setExportType('month')} style={{ width: '100%', textAlign: 'left', padding: '10px' }}>Export Specific Month</button>
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
                  ) : (
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
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
