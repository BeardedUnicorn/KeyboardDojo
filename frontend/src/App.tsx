import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './features/dashboard/Dashboard';
import Lessons from './features/lessons/Lessons';
import Practice from './features/practice/Practice';
import Profile from './features/profile/Profile';
import Settings from './features/settings/Settings';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import OAuthCallback from './features/auth/OAuthCallback';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes (public) */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
        
        {/* Protected Routes (require authentication) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
