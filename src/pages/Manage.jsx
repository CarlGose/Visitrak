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
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                  </div>
                  <div className="guard-details">
                    <span className="guard-name">{guard.name}</span>
                    <span className="guard-number">{guard.number}</span>
                  </div>
                </div>
                <div className="guard-actions">
                  <button className="icon-btn edit-icon-btn" onClick={() => openEditModal(guard)}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </button>
                  <button className="icon-btn delete-icon-btn" onClick={() => handleDelete(guard.id)}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
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
                  onChange={(e) => setCurrentGuard({...currentGuard, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>ID Number</label>
                <input 
                  type="text" 
                  value={currentGuard?.number || ''} 
                  onChange={(e) => setCurrentGuard({...currentGuard, number: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={currentGuard?.password || ''} 
                  onChange={(e) => setCurrentGuard({...currentGuard, password: e.target.value})}
                  required
                />
              </div>

              <div className="form-group photo-group">
                <label>Photo</label>
                <div className="photo-upload-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  <div className="upload-arrow">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                    </svg>
                  </div>
                </div>
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
