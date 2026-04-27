import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineViewGrid, HiOutlineCollection, HiOutlinePlusCircle,
  HiOutlineUser, HiOutlineChartBar, HiOutlineUsers
} from 'react-icons/hi';

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const location = useLocation();

  const mainLinks = [
    { to: '/dashboard', icon: <HiOutlineViewGrid />, text: 'Dashboard' },
    { to: '/profile', icon: <HiOutlineUser />, text: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <HiOutlineChartBar />, text: 'Analytics' },
    { to: '/admin/users', icon: <HiOutlineUsers />, text: 'Users' },
  ];

  return (
    <>
      <aside className="sidebar" id="sidebar">
        <div className="sidebar-brand">
          <img src="/logo.png" alt="FeedByMe Logo" style={{ width: '36px', height: '36px', borderRadius: '4px' }} />
          <span className="sidebar-brand-text">FeedByMe</span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Menu</div>
          {mainLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              <span>{link.text}</span>
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="sidebar-section-title">Admin</div>
              {adminLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-link-icon">{link.icon}</span>
                  <span>{link.text}</span>
                </NavLink>
              ))}
            </>
          )}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <div className="mobile-nav">
        {mainLinks.slice(0, 4).map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard'}
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="mobile-nav-link-icon">{link.icon}</span>
            {link.text}
          </NavLink>
        ))}
      </div>
    </>
  );
}
