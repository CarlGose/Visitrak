import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLanding.css';

export default function UserLanding() {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="ul-page">
      <div className="wup-bg-watermark"></div>
      <main className="ul-main">
        <div className="ul-card">
          <header className="ul-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '24px' }}>
            <img src="/wuplogo.png" alt="WUP Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12))' }} />
            <div style={{ textAlign: 'center' }}>
              <h1 className="ul-brand-name" style={{ margin: 0, fontSize: '2.3rem', lineHeight: '1.1' }}>VisiTrack</h1>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem', fontStyle: 'italic', color: '#666' }}>Handle visitors without worries</p>
            </div>
            <img src="/visitrak-badge.png" alt="VisiTrack Badge" style={{ width: '60px', height: '60px', objectFit: 'contain', filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12))' }} />
          </header>

          <h2 className="ul-welcome">Welcome</h2>
          <p className="ul-subtitle">Make your visit hassle-free with VisiTrack</p>
          
          <button className="ul-visit-btn" onClick={() => navigate('/fill-out')}>
            Proceed
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>

          <button className="ul-help-btn" onClick={() => setShowHelp(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            How it Works
          </button>
        </div>
      </main>

      {showHelp && (
        <div className="ul-help-overlay" onClick={() => setShowHelp(false)}>
          <div className="ul-help-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ul-help-close-x" onClick={() => setShowHelp(false)} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="ul-help-header">
              <h3>How to Use VisiTrack</h3>
              <p className="ul-help-modal-subtitle">Simple 4-Step Visitor Process</p>
            </div>
            <div className="ul-help-steps-container">
              <div className="ul-help-step-item">
                <div className="ul-help-step-num">1</div>
                <div className="ul-help-step-details">
                  <span className="ul-help-step-title">Data Privacy Agreement</span>
                  <p className="ul-help-step-desc">Accept our quick data privacy consent form before proceeding to input your data safely.</p>
                </div>
              </div>
              <div className="ul-help-step-item">
                <div className="ul-help-step-num">2</div>
                <div className="ul-help-step-details">
                  <span className="ul-help-step-title">Fill Visitor Form</span>
                  <p className="ul-help-step-desc">Provide your name, address, valid ID type, and destination. Make sure details match your physical ID.</p>
                </div>
              </div>
              <div className="ul-help-step-item">
                <div className="ul-help-step-num">3</div>
                <div className="ul-help-step-details">
                  <span className="ul-help-step-title">Get QR Entry Pass (10-Min Expiry)</span>
                  <p className="ul-help-step-desc">Generate your QR Pass. <strong>You can download the QR Code directly to your device</strong> or take a screenshot for quick offline scanning. Note that for security, it must be scanned by the guard within <strong>10 minutes</strong> of generation, or it will expire and require generating a new one.</p>
                </div>
              </div>
              <div className="ul-help-step-item">
                <div className="ul-help-step-num">4</div>
                <div className="ul-help-step-details">
                  <span className="ul-help-step-title">Scan at Gate for Access</span>
                  <p className="ul-help-step-desc">Present your active QR Pass to the guard at the entrance to scan in (Time-In). When you leave the campus, present it again to scan out (Time-Out).</p>
                </div>
              </div>
            </div>
            <button className="ul-help-footer-btn" onClick={() => setShowHelp(false)}>
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
