import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FeedbackProvider } from './context/FeedbackContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProjectProvider } from './context/ProjectContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProjectBoard from './pages/ProjectBoard';
import FeedbackNew from './pages/FeedbackNew';
import FeedbackDetail from './pages/FeedbackDetail';
import FeedbackEdit from './pages/FeedbackEdit';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
// import Presentation from './pages/Presentation';
import NotFound from './pages/NotFound';

import './index.css';

// Protected route wrapper
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader text="Authenticating..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <div className="app-layout">
      <Sidebar />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

// Public layout wrapper (with Sidebar/Navbar but no auth check)
function PublicLayout() {
  const { loading } = useAuth();
  if (loading) return <Loader text="Loading..." />;
  return (
    <div className="app-layout">
      <Sidebar />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

// Admin route wrapper
function AdminRoute() {
  const { isAdmin, loading } = useAuth();
  if (loading) return <Loader text="Authenticating..." />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

// Guest only route (redirect if logged in)
function GuestRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader text="Loading..." />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      {/* <Route path="/presentation" element={<Presentation />} /> */}

      {/* Guest-only routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
      </Route>

      {/* Public Layout Routes (Boards and Feedback) */}
      <Route element={<PublicLayout />}>
        <Route path="/board/:projectId" element={<ProjectBoard />} />
        <Route path="/board/:projectId/new" element={<FeedbackNew />} />
        <Route path="/feedback/:id" element={<FeedbackDetail />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedback/:id/edit" element={<FeedbackEdit />} />

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ProjectProvider>
            <FeedbackProvider>
              <AppRoutes />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 2500,
                  style: {
                    background: '#ffffff',
                    color: '#1b1b1b',
                    border: '2px solid #8d8d8d',
                    borderRadius: '4px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    padding: '12px 16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  },
                  success: {
                    iconTheme: { primary: '#008817', secondary: '#ffffff' }
                  },
                  error: {
                    iconTheme: { primary: '#e31c3d', secondary: '#ffffff' }
                  }
                }}
              />
            </FeedbackProvider>
          </ProjectProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}
