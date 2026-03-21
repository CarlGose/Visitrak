import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Link } from 'react-router-dom';
import './user-form.css';

const UserForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        destination: '',
        purpose: '',
        date: ''
    });

    const [qrValue, setQrValue] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        setQrValue(qrData);
        setIsSubmitted(true);
    };

    const handleBack = () => {
        setFormData({
            name: '',
            address: '',
            destination: '',
            purpose: '',
            date: ''
        });
        setQrValue('');
        setIsSubmitted(false);
    };

    // Form View
    if (!isSubmitted) {
        return (
            <div className="form-page">
                <div className="form-wrapper">
                    <div className="form-header">
                        <h2 className="form-title">Visitor Registration</h2>
                        <p className="form-subtitle">Fill out the form below to generate your entry pass</p>
                    </div>

                    <form className="form-card" onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="name">Full Name</label>
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
                            <label htmlFor="address">Address</label>
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

                        <div className="form-field">
                            <label htmlFor="destination">Destination</label>
                            <input
                                type="text"
                                id="destination"
                                name="destination"
                                placeholder="e.g. Registrar"
                                value={formData.destination}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="purpose">Purpose of Visit</label>
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
                            <label htmlFor="date">Date of Visit</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
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
                        Present this QR code to the guard to scan<br/>for Time Out
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
                        <button onClick={handleBack} className="qr-finish-btn">
                            Finish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
