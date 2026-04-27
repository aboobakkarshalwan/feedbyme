export function SkeletonCard() {
  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <div className="skeleton skeleton-line w-75" style={{ height: 20, marginBottom: 12 }} />
      <div className="flex gap-2 mb-4">
        <div className="skeleton" style={{ width: 60, height: 22, borderRadius: 'var(--radius-full)' }} />
        <div className="skeleton" style={{ width: 50, height: 22, borderRadius: 'var(--radius-full)' }} />
        <div className="skeleton" style={{ width: 70, height: 22, borderRadius: 'var(--radius-full)' }} />
      </div>
      <div className="skeleton skeleton-line w-full" />
      <div className="skeleton skeleton-line w-75" />
      <div className="skeleton skeleton-line w-50" style={{ marginBottom: 16 }} />
      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
        <div className="flex gap-2 items-center">
          <div className="skeleton skeleton-circle" style={{ width: 28, height: 28 }} />
          <div className="skeleton" style={{ width: 80, height: 12 }} />
        </div>
        <div className="skeleton" style={{ width: 60, height: 28, borderRadius: 'var(--radius-full)' }} />
      </div>
    </div>
  );
}

export function SkeletonLine({ width = '100%', height = 14 }) {
  return <div className="skeleton" style={{ width, height, borderRadius: 'var(--radius-md)', marginBottom: 8 }} />;
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {[1,2,3,4,5].map(i => (
              <th key={i}><div className="skeleton" style={{ width: '60%', height: 12 }} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {[1,2,3,4,5].map(j => (
                <td key={j}><div className="skeleton" style={{ width: `${50 + Math.random() * 40}%`, height: 14 }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ padding: '60px 20px' }}>
      <div style={{
        width: 40, height: 40, border: '3px solid var(--glass-border)',
        borderTopColor: 'var(--accent-primary)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{text}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
