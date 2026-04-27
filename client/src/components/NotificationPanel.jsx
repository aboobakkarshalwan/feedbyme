import { useNavigate } from 'react-router-dom';
import { HiOutlineX, HiCheck } from 'react-icons/hi';
import { useNotifications } from '../context/NotificationContext';
import { formatDate } from '../utils/helpers';

export default function NotificationPanel({ onClose }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleClick = (notification) => {
    if (!notification.read) markAsRead(notification._id);
    if (notification.feedbackId) {
      navigate(`/feedback/${notification.feedbackId._id || notification.feedbackId}`);
      onClose();
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      status_update: '🔄',
      comment: '💬',
      upvote: '👍',
      assignment: '📋'
    };
    return icons[type] || '🔔';
  };

  const getTypeColor = (type) => {
    const colors = {
      status_update: 'var(--cyan-muted)',
      comment: 'var(--accent-muted)',
      upvote: 'var(--green-muted)',
      assignment: 'var(--amber-muted)'
    };
    return colors[type] || 'var(--glass-bg)';
  };

  return (
    <>
      <div className="notification-panel-overlay" onClick={onClose} />
      <div className="notification-panel" id="notification-panel">
        <div className="notification-panel-header">
          <div>
            <h3 className="notification-panel-title">Notifications</h3>
            {unreadCount > 0 && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button className="btn btn-sm btn-ghost" onClick={markAllAsRead}>
                <HiCheck /> Mark all read
              </button>
            )}
            <button className="modal-close" onClick={onClose} aria-label="Close notifications">
              <HiOutlineX />
            </button>
          </div>
        </div>

        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <div className="empty-state-icon">🔔</div>
              <div className="empty-state-title">No notifications</div>
              <div className="empty-state-text">You're all caught up!</div>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif._id}
                className={`notification-item ${!notif.read ? 'unread' : ''}`}
                onClick={() => handleClick(notif)}
              >
                <div
                  className="notification-icon"
                  style={{ background: getTypeColor(notif.type) }}
                >
                  {getTypeIcon(notif.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-message">{notif.message}</div>
                  <div className="notification-time">{formatDate(notif.createdAt)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
