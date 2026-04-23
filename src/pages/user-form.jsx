import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './user-form.css';

const destGroups = [
    {
        label: "Offices",
        options: [
            { value: "OFFICE OF STUDENT AFFAIRS", label: "Office of Student Affairs" }, ,
            { value: "PRESIDENT'S OFFICE", label: "President's Office" },
            { value: "ACCOUNTING", label: "Accounting" },
            { value: "REGISTRAR", label: "Registrar" }
        ]
    },
    {
        label: "Basic Education",
        options: [
            { value: "SHARE", label: "SHARE" },
            { value: "Center for Child Development", label: "Center for Child Development" },
            { value: "Elementary", label: "Elementary" },
            { value: "High School", label: "High School" }
        ]
    },
    {
        label: "College",
        options: [
            { value: "Arts and Sciences (CAS)", label: "Arts & Sciences (CAS)" },
            { value: "College of Business and Accountancy", label: "Business & Accountancy (CBA)" },
            { value: "Criminal Justice Education (CCJE)", label: "Criminal Justice (CCJE)" },
            { value: "Education (CoEd)", label: "Education (CoEd)" },
            { value: "Engineering and Computer Technology (CECT)", label: "Engineering & Tech (CECT)" },
            { value: "Hospitality and Tourism Management (CHTM)", label: "Tourism & Hospitality (CHTM)" },
            { value: "Nursing", label: "Nursing" },
            { value: "Allied Medical Sciences", label: "Allied Medical Sciences" }
        ]
    }
];

const UserForm = () => {
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('visitrak_qr_form');
        if (saved) return JSON.parse(saved);
        return {
            name: '',
            address: '',
            destination: '',
            purpose: '',
            date: new Date().toISOString().split('T')[0]
        };
    });

    const [qrValue, setQrValue] = useState(() => localStorage.getItem('visitrak_qr_value') || '');
    const [isSubmitted, setIsSubmitted] = useState(() => !!localStorage.getItem('visitrak_qr_value'));
    const [isInside, setIsInside] = useState(false);

    // Custom Dropdown State
    const [destOpen, setDestOpen] = useState(false);
    const destRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (destRef.current && !destRef.current.contains(event.target)) {
                setDestOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Hook to check status on load and subscribe to real-time changes
    useEffect(() => {
        if (!isSubmitted || !formData.name) return;

        const checkStatus = async () => {
            const { data } = await supabase
                .from('visitor_logs')
                .select('*')
                .eq('name', formData.name)
                .eq('date', formData.date)
                .order('id', { ascending: false })
                .limit(1);

            if (data && data.length > 0) {
                const log = data[0];
                if (log.is_active === false && log.time_out) {
                    handleClear(); // Already scanned out
                } else if (log.is_active === true) {
                    setIsInside(true); // Scanned in, but not out
                }
            }
        };

        checkStatus();

        const channel = supabase
            .channel('qr-status-watch')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'visitor_logs' }, (payload) => {
                const rowObj = payload.new || payload.old || {};

                // If it's a new or updated record for this visitor today
                if (rowObj.name === formData.name) {
                    if (payload.eventType === 'INSERT' && rowObj.is_active === true) {
                        setIsInside(true); // They just timed in!
                    }
                    else if (payload.eventType === 'UPDATE') {
                        if (rowObj.is_active === false && rowObj.time_out) {
                            handleClear(); // Automatically clear when scanned out
                        } else if (rowObj.is_active === true) {
                            setIsInside(true);
                        }
                    }
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [isSubmitted, formData.name, formData.date]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Stringify the form data to be encoded as a QR Code
        const qrData = JSON.stringify({
            name: formData.name,
            address: formData.address,
            destination: formData.destination,
            purpose: formData.purpose,
            date: formData.date
        });

        localStorage.setItem('visitrak_qr_form', JSON.stringify(formData));
        localStorage.setItem('visitrak_qr_value', qrData);

        setQrValue(qrData);
        setIsSubmitted(true);
    };

    const handleClear = () => {
        localStorage.removeItem('visitrak_qr_form');
        localStorage.removeItem('visitrak_qr_value');
        setFormData({
            name: '',
            address: '',
            destination: '',
            purpose: '',
            date: new Date().toISOString().split('T')[0]
        });
        setQrValue('');
        setIsInside(false);
        setIsSubmitted(false);
    };

    const handleBack = () => {
        handleClear();
    };

    // Form View
    if (!isSubmitted) {
        return (
            <div className="form-page">
                <div className="form-wrapper">
                    <div className="form-brand">
                        <img src="/wuplogo.png" alt="VisiTrack Logo" />
                        <span>VisiTrack</span>
                    </div>

                    <form className="form-card" onSubmit={handleSubmit}>
                        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                            <h2 className="form-title">Visitor Access Form</h2>
                            <p className="form-subtitle">Fill out the form below to generate your entry pass</p>
                        </div>
                        <div className="form-field">
                            <label htmlFor="name">Full Name <span className="req">*</span></label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="e.g. James Smith"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="address">Address <span className="req">*</span></label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                placeholder="e.g. Mabini Extension"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field" ref={destRef} style={{ position: 'relative' }}>
                            <label>Destination <span className="req">*</span></label>
                            <div
                                className={`custom-select ${destOpen ? 'open' : ''}`}
                                onClick={() => setDestOpen(!destOpen)}
                            >
                                {formData.destination || <span style={{ color: 'rgba(26, 40, 32, 0.4)' }}>Select a destination...</span>}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>

                            {destOpen && (
                                <div className="custom-options">
                                    {destGroups.map((group, idx) => (
                                        <div key={idx}>
                                            <div className="custom-optgroup">{group.label}</div>
                                            {group.options.map((opt, i) => (
                                                <div
                                                    key={i}
                                                    className="custom-option"
                                                    onClick={() => {
                                                        handleChange({ target: { name: 'destination', value: opt.value } });
                                                        setDestOpen(false);
                                                    }}
                                                >
                                                    {opt.label}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="purpose">Purpose of Visit <span className="req">*</span></label>
                            <input
                                type="text"
                                id="purpose"
                                name="purpose"
                                placeholder="e.g. Transcript of Records"
                                value={formData.purpose}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Date of Visit</label>
                            <div style={{ padding: '14px 16px', background: 'rgba(255, 255, 255, 0.4)', border: '2px solid rgba(107, 143, 126, 0.2)', borderRadius: '14px', fontSize: '1rem', color: 'rgba(26, 40, 32, 0.6)', fontFamily: 'Outfit', fontWeight: '600', userSelect: 'none' }}>
                                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-submit">
                                Generate Entry Pass
                            </button>
                        </div>
                    </form>

                    <p style={{ marginTop: '24px', fontSize: '0.9rem' }}>
                        <Link to="/" style={{ color: 'var(--color-card)', fontWeight: '600', textDecoration: 'none' }}>
                            ← Back to Home
                        </Link>
                    </p>
                </div>
            </div>
        );
    }
    // Direct QR / Ticket View
    const displayDate = new Date(formData.date).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    });

    return (
        <div className="form-page qr-result-page">
            <header className="gd-header vip-header-centered" style={{ backgroundColor: '#f5f2eb', borderBottom: '1px solid #ddd', width: '100%', position: 'absolute', top: 0, left: 0, padding: '12px 0' }}>
                <img src="/wuplogo.png" alt="VisiTrack Logo" className="gd-header-logo" style={{ margin: '0 auto', display: 'block', width: '44px', height: '44px' }} />
            </header>

            <div className="qr-pass-card">
                <div className="qr-pass-header">
                    <h2>Your QR Code</h2>
                </div>

                <div className="qr-pass-body">
                    <div className="qr-code-box">
                        <QRCode
                            value={qrValue}
                            size={220}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="Q"
                        />
                    </div>

                    <div className="qr-instruction-alert">
                        Present this QR code to the guard to scan<br />for Time in and Time Out
                    </div>

                    <div className="qr-details-list">
                        <div className="qr-detail-row">
                            <span className="qr-detail-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </span>
                            <span className="qr-detail-label">Name:</span>
                            <span className="qr-detail-value">{formData.name}</span>
                        </div>
                        <div className="qr-detail-row">
                            <span className="qr-detail-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </span>
                            <span className="qr-detail-label">Address:</span>
                            <span className="qr-detail-value">{formData.address}</span>
                        </div>
                        <div className="qr-detail-row">
                            <span className="qr-detail-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                            </span>
                            <span className="qr-detail-label">Destination:</span>
                            <span className="qr-detail-value">{formData.destination}</span>
                        </div>
                        <div className="qr-detail-row">
                            <span className="qr-detail-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                            </span>
                            <span className="qr-detail-label">Purpose:</span>
                            <span className="qr-detail-value">{formData.purpose}</span>
                        </div>
                        <div className="qr-detail-row">
                            <span className="qr-detail-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </span>
                            <span className="qr-detail-label">Date:</span>
                            <span className="qr-detail-value">{displayDate}</span>
                        </div>
                    </div>

                    <div className="qr-pass-footer">
                        <button
                            onClick={handleBack}
                            className="qr-finish-btn"
                            disabled={isInside}
                            style={isInside ? {
                                opacity: 0.6,
                                cursor: 'not-allowed',
                                background: '#aaa',
                                border: 'none',
                                color: '#fff'
                            } : {}}
                        >
                            {isInside ? 'Currently Inside (Finish Disabled)' : 'Finish'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
