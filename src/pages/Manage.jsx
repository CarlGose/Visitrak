import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import { GATE_OPTIONS } from '../data/mockData';
import './Manage.css';

export default function Manage() {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [currentGuard, setCurrentGuard] = useState(null);
  const [saving, setSaving] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);

  // ── Upload photo to Supabase Storage ──
  const uploadPhoto = async (dataUrl, guardId) => {
    // Convert data URL → Blob
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const ext = blob.type.split('/')[1] || 'jpg';
    const filename = `guard-${guardId || Date.now()}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('guard-photos')
      .upload(filename, blob, { upsert: true, contentType: blob.type });

    if (uploadError) throw new Error('Photo upload failed: ' + uploadError.message);

    const { data: { publicUrl } } = supabase.storage
      .from('guard-photos')
      .getPublicUrl(filename);

    return publicUrl;
  };

  // ── Fetch guards from Supabase ──
  const fetchGuards = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('guards')
      .select('*')
      .order('id', { ascending: true });
    if (!error && data) setGuards(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGuards();

    // Realtime updates
    const channel = supabase
      .channel('manage-guards')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'guards' },
        () => { fetchGuards(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── Camera helpers ──
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access the camera. Please ensure permissions are granted.');
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
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      setCurrentGuard({ ...currentGuard, photo: canvas.toDataURL('image/jpeg') });
      stopCamera();
    }
  };

  // ── Modal helpers ──
  const openAddModal = () => {
    setModalType('add');
    setCurrentGuard({ name: '', guard_id: '', password: '', gate: '', photo: null });
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

  // ── Save (insert or update) ──
  const handleSave = async () => {
    setSaving(true);
    try {
      // If photo is a new data URL (from file/camera), upload to Storage first
      let photoUrl = currentGuard.photo || null;
      if (photoUrl && photoUrl.startsWith('data:')) {
        photoUrl = await uploadPhoto(photoUrl, currentGuard.guard_id);
      }

      if (modalType === 'add') {
        const { error } = await supabase.from('guards').insert([{
          name: currentGuard.name,
          guard_id: currentGuard.guard_id,
          password: currentGuard.password,
          gate: currentGuard.gate || null,
          photo: photoUrl,
        }]);
        if (error) throw new Error(error.message);
      } else {
        const updateData = {
          name: currentGuard.name,
          guard_id: currentGuard.guard_id,
          gate: currentGuard.gate || null,
          photo: photoUrl,
        };
        // Only update password if one was entered
        if (currentGuard.password) updateData.password = currentGuard.password;

        const { error } = await supabase
          .from('guards')
          .update(updateData)
          .eq('id', currentGuard.id);
        if (error) throw new Error(error.message);
      }
      closeModal();
    } catch (err) {
      alert('Error saving guard: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this guard?')) return;
    const { error } = await supabase.from('guards').delete().eq('id', id);
    if (error) alert('Error deleting guard: ' + error.message);
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
            {loading ? (
              <p style={{ textAlign: 'center', color: '#888', padding: '24px 0' }}>Loading...</p>
            ) : guards.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', padding: '24px 0' }}>No guards registered.</p>
            ) : guards.map((guard) => (
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
                    <span className="guard-number">{guard.guard_id}</span>
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
                <label>Guard ID</label>
                <input
                  type="text"
                  value={currentGuard?.guard_id || ''}
                  onChange={(e) => setCurrentGuard({ ...currentGuard, guard_id: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Gate</label>
                <select
                  value={currentGuard?.gate || ''}
                  onChange={(e) => setCurrentGuard({ ...currentGuard, gate: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', background: '#fff', color: '#222', cursor: 'pointer' }}
                >
                  <option value="" disabled>— Select Gate —</option>
                  {GATE_OPTIONS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={currentGuard?.password || ''}
                  onChange={(e) => setCurrentGuard({ ...currentGuard, password: e.target.value })}
                  required={modalType === 'add'}
                  placeholder={modalType === 'edit' ? 'Leave blank to keep current' : ''}
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
                          reader.onload = (ev) => setCurrentGuard({ ...currentGuard, photo: ev.target.result });
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
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? 'Saving...' : modalType === 'add' ? 'Create Account' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
