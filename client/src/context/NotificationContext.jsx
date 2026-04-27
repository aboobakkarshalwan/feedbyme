import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false
};

function notificationReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload.notifications, unreadCount: action.payload.unreadCount, loading: false };
    case 'MARK_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => n._id === action.payload ? { ...n, read: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    case 'MARK_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { isAuthenticated } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.get('/notifications');
      dispatch({ type: 'SET_NOTIFICATIONS', payload: res.data });
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    } else {
      dispatch({ type: 'RESET' });
    }
  }, [isAuthenticated, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      dispatch({ type: 'MARK_READ', payload: id });
    } catch { /* ignore */ }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      dispatch({ type: 'MARK_ALL_READ' });
    } catch { /* ignore */ }
  };

  return (
    <NotificationContext.Provider value={{
      ...state,
      fetchNotifications,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

export default NotificationContext;
