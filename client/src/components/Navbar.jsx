import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationPanel from './NotificationPanel';
import { getInitials } from '../utils/helpers';
import { HiOutlineBell, HiOutlineLogout, HiOutlineUser, HiOutlineChevronDown } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close dropdown on route change
  useEffect(() => { setShowDropdown(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Page title based on route
  const getTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/feedback/new') return 'Submit Feedback';
    if (path.startsWith('/feedback/')) return 'Feedback';
    if (path === '/feedback') return 'Feedback';
    if (path === '/profile') return 'Profile';
    if (path === '/admin/users') return 'Users';
    if (path === '/admin') return 'Analytics';
    return '';
  };

  return (
    <>
      <header className="navbar" id="navbar">
        <div className="navbar-title">{getTitle()}</div>
        <div className="navbar-actions">
          {/* Notifications */}
          <button
            className="navbar-icon-btn"
            onClick={() => setShowNotifications(true)}
            aria-label="Notifications"
            id="notif-btn"
          >
            <HiOutlineBell />
            {unreadCount > 0 && (
              <span className="badge" style={{
                position: 'absolute', top: -2, right: -2,
                minWidth: 16, height: 16, padding: '0 4px',
                borderRadius: 999, background: 'var(--red)', color: 'white',
                fontSize: '0.55rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {/* Avatar dropdown */}
          <div className="avatar-dropdown" ref={dropdownRef}>
            <button
              className="avatar-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              id="avatar-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {getInitials(user?.name)}
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <div style={{
                  padding: '10px 12px 8px',
                  borderBottom: '1px solid var(--glass-border)'
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-1)' }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 1 }}>
                    {user?.email}
                  </div>
                </div>
                <div style={{ padding: '4px 0' }}>
                  <button className="dropdown-item" onClick={() => navigate('/profile')}>
                    <HiOutlineUser /> Profile
                  </button>
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <HiOutlineLogout /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
}
