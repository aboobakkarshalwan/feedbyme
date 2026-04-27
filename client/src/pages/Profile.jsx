import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getInitials, formatFullDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSubmitting(true);
    try {
      await updateProfile({ name: form.name });
      toast.success('Profile updated');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-enter">
      <h1 className="page-title mb-6">Profile</h1>

      <div className="glass-card profile-card">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem' }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>{user?.email}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-feature' : 'badge-general'}`} style={{ marginTop: 6 }}>
              {user?.role}
            </span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 20 }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            {editing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  id="profile-name"
                />
                <button className="btn btn-primary btn-icon" onClick={handleSave} disabled={submitting}>
                  <HiOutlineCheck />
                </button>
                <button className="btn btn-secondary btn-icon" onClick={() => { setEditing(false); setForm({ name: user?.name || '' }); }}>
                  <HiOutlineX />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '0.9rem' }}>{user?.name}</span>
                <button className="btn btn-sm btn-ghost" onClick={() => setEditing(true)}>
                  <HiOutlinePencil /> Edit
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>{user?.email}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>{user?.role}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Member Since</label>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>{formatFullDate(user?.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
