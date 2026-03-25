import React, { useState } from 'react';
import Header from '../components/Header';
import './Manage.css';

const initialGuards = [
  { id: 1, name: 'Leo Rivera', number: '180-203-11', password: '' },
  { id: 2, name: 'Kristine Joy Luis', number: '113-264-17', password: '' },
  { id: 3, name: 'James Roque', number: '773-344-42', password: '' },
  { id: 4, name: 'Jose Joseph', number: '221-342-54', password: '' },
  { id: 5, name: 'Michael Santos', number: '751-488-12', password: '' },
];

export default function Manage() {
  const [guards, setGuards] = useState(initialGuards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [currentGuard, setCurrentGuard] = useState(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setIsCameraActive(true);
      // We need a small delay to ensure the video element is rendered before setting its srcObject
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please ensure permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCurrentGuard({ ...currentGuard, photo: dataUrl });
      stopCamera();
    }
  };

  const openAddModal = () => {
    setModalType('add');
    setCurrentGuard({ name: '', number: '', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (guard) => {
    setModalType('edit');
    setCurrentGuard({ ...guard });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    stopCamera();
    setIsModalOpen(false);
    setCurrentGuard(null);
  };

  const handleSave = () => {
    if (modalType === 'add') {
      const newGuard = {
        ...currentGuard,
        id: guards.length ? Math.max(...guards.map(g => g.id)) + 1 : 1,
      };
      setGuards([...guards, newGuard]);
    } else {
      setGuards(guards.map(g => g.id === currentGuard.id ? currentGuard : g));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setGuards(guards.filter(g => g.id !== id));
  };

  return (
    <div className="manage-page">
      <Header />
      <main className="manage-content">
        <h1>Manage Guards</h1>

        <div className="manage-card">
          <div className="manage-card-header">
            <h2>Guards</h2>
            <button className="add-btn" onClick={openAddModal}>Add</button>
          </div>

          <div className="guards-list">
            {guards.map((guard) => (
              <div key={guard.id} className="guard-row">
                <div className="guard-info">
                  <div className="guard-avatar">
                    {guard.photo ? (
                      <img src={guard.photo} alt={guard.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                      </svg>
                    )}
                  </div>
                  <div className="guard-details">
                    <span className="guard-name">{guard.name}</span>
                    <span className="guard-number">{guard.number}</span>
                  </div>
                </div>
                <div className="guard-actions">
                  <button className="icon-btn edit-icon-btn" onClick={() => openEditModal(guard)}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  </button>
                  <button className="icon-btn delete-icon-btn" onClick={() => handleDelete(guard.id)}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{modalType === 'add' ? 'Register' : 'Edit'}</h2>

            <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={currentGuard?.name || ''}
                  onChange={(e) => setCurrentGuard({ ...currentGuard, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>ID Number</label>
                <input
                  type="text"
                  value={currentGuard?.number || ''}
                  onChange={(e) => setCurrentGuard({ ...currentGuard, number: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={currentGuard?.password || ''}
                  onChange={(e) => setCurrentGuard({ ...currentGuard, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group photo-group">
                <label>Photo</label>

                {isCameraActive ? (
                  <div className="camera-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', background: '#f5f5f5', padding: '16px', borderRadius: '12px' }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', backgroundColor: '#000' }}
                    />
                    <div className="camera-actions" style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
                      <button type="button" onClick={capturePhoto} className="save-btn" style={{ padding: '8px 24px', fontSize: '0.9rem', width: 'auto' }}>Capture</button>
                      <button type="button" onClick={stopCamera} style={{ padding: '8px 24px', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer', color: '#555', fontWeight: '600' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => setCurrentGuard({ ...currentGuard, photo: e.target.result });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <label htmlFor="photo-upload" className="photo-upload-icon" style={{ cursor: 'pointer', padding: currentGuard?.photo ? 0 : '', overflow: 'hidden', margin: 0, flexShrink: 0 }}>
                        {currentGuard?.photo ? (
                          <img src={currentGuard.photo} alt="Preview" style={{ width: '120px', height: '120px', maxWidth: '120px', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', display: 'block' }} />
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                            <div className="upload-arrow">
                              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                              </svg>
                            </div>
                          </>
                        )}
                      </label>
                      <div className="photo-options" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label htmlFor="photo-upload" style={{ color: 'var(--color-gold)', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '700', padding: '6px 12px', border: '1px solid var(--color-gold)', borderRadius: '6px', textAlign: 'center', transition: 'all 0.2s', width: '130px' }}>Choose File</label>
                        <button type="button" onClick={startCamera} style={{ background: 'var(--color-bg)', border: '1px solid #ccc', color: '#555', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '700', padding: '6px 12px', borderRadius: '6px', transition: 'all 0.2s', width: '130px' }}>Use Camera</button>
                        {currentGuard?.photo && (
                          <button type="button" onClick={() => setCurrentGuard({ ...currentGuard, photo: null })} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', padding: 0, textAlign: 'center', marginTop: '4px' }}>Remove Photo</button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {modalType === 'add' ? 'Create Account' : 'Edit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
