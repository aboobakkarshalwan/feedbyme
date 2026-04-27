export default function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title || 'Nothing here yet'}</h3>
      <p className="empty-state-text">{message || 'No items to display.'}</p>
      {action && action}
    </div>
  );
}
