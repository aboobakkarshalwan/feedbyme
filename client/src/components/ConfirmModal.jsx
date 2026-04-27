import { HiOutlineExclamation, HiOutlineX } from 'react-icons/hi';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', danger = false }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }} onClick={onCancel}>
      <div style={{
        width: '100%', maxWidth: 460,
        background: '#ffffff',
        border: '2px solid #1b1b1b',
        borderRadius: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '2px solid var(--glass-border)',
          background: 'var(--bg-secondary)'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem',
            color: 'var(--text-1)'
          }}>{title || 'Confirm Action'}</h3>
          <button onClick={onCancel} aria-label="Close" style={{
            width: 32, height: 32, borderRadius: 2,
            background: 'none', border: '2px solid transparent', color: 'var(--text-1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '1.2rem'
          }}><HiOutlineX /></button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {danger && (
            <div style={{
              width: 44, height: 44, borderRadius: 4, flexShrink: 0,
              background: 'var(--red-muted)', border: '1px solid var(--red)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--red)', fontSize: '1.3rem'
            }}>
              <HiOutlineExclamation />
            </div>
          )}
          <p style={{ color: 'var(--text-1)', fontSize: '1rem', lineHeight: 1.6 }}>
            {message || 'Are you sure you want to proceed?'}
          </p>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 12,
          padding: '20px 24px', borderTop: '1px solid var(--glass-border)',
          background: 'var(--bg-secondary)'
        }}>
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
          <button className={`btn btn-sm ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
