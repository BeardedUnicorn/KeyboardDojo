import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ErrorBoundary } from '@sentry/react';
import { RootState } from './store';
import './App.css';
import { Box, Typography } from '@mui/material';
import { setUser } from './utils/sentry';
import ErrorFallback from './components/ErrorFallback';

// Auth Components
import Login from './features/auth/Login';
import Register from './features/auth/Register';
// Import PremiumFeature from components instead of features
import PremiumFeature from './components/subscription/PremiumFeature';

// Dashboard Components
import Dashboard from './features/dashboard/Dashboard';
import LessonDetail from './features/lessons/LessonDetail';
import Lessons from './features/lessons/Lessons';
import Profile from './features/profile/Profile';

// Subscription Components
import SubscriptionPage from './features/subscription/SubscriptionPage';
import SubscriptionSuccess from './features/subscription/SubscriptionSuccess';

// Marketing Components
import Home from './features/marketing/Home';
import About from './features/marketing/About';
import Features from './features/marketing/Features';
import Contact from './features/marketing/Contact';
import Pricing from './features/marketing/Pricing';
import MarketingLayout from './features/marketing/MarketingLayout';

// Desktop App Components
import DesktopComparison from './pages/DesktopComparison';

// Admin Components
import AdminDashboard from './features/admin/AdminDashboard';
import AdminLessonsManager from './features/admin/AdminLessonsManager';
import AdminUsers from './features/admin/AdminUsers';

// Guards
const PrivateRoute: React.FC<{ element: React.ReactElement; requireAdmin?: boolean }> = ({ 
  element, 
  requireAdmin = false 
}) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state: RootState) => state.auth.user?.isAdmin);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return element;
};

const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return !isAuthenticated ? element : <Navigate to="/dashboard" />;
};

const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Set user context in Sentry if authenticated
    if (user) {
      setUser({
        id: user.userId,
        email: user.email,
        username: user.name
      });
    }
  }, [user]);

  return (
    <ErrorBoundary fallback={(errorData) => <ErrorFallback error={errorData.error as Error} resetError={errorData.resetError} />}>
      <Router>
        <Routes>
          {/* Marketing Routes */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/desktop-comparison" element={<DesktopComparison />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/signup" element={<PublicRoute element={<Register />} />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/lessons" element={<PrivateRoute element={<Lessons />} />} />
          <Route path="/lessons/:lessonId" element={<PrivateRoute element={<LessonDetail />} />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/subscription" element={<PrivateRoute element={<SubscriptionPage />} />} />
          <Route path="/subscription/success" element={<PrivateRoute element={<SubscriptionSuccess />} />} />
          <Route path="/premium-features" element={<PrivateRoute element={
            <PremiumFeature>
              <Box sx={{ p: 3 }}>
                <Typography variant="h4">Premium Features</Typography>
                <Typography variant="body1">
                  Explore all the premium features available to subscribers.
                </Typography>
              </Box>
            </PremiumFeature>
          } />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute element={<AdminDashboard />} requireAdmin={true} />} />
          <Route path="/admin/lessons" element={<PrivateRoute element={<AdminLessonsManager />} requireAdmin={true} />} />
          <Route path="/admin/users" element={<PrivateRoute element={<AdminUsers />} requireAdmin={true} />} />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
