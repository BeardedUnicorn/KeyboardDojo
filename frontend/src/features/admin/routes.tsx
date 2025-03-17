import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminLessons from './AdminLessons';
import AdminUsers from './AdminUsers';
import AdminLessonsManager from './AdminLessonsManager';

// Admin route guard
const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return element;
};

// Admin routes configuration
export const AdminRoutes = (
  <Route path="/admin" element={<AdminRoute element={<AdminLayout />} />}>
    <Route index element={<AdminDashboard />} />
    <Route path="lessons" element={<AdminLessons />} />
    <Route path="lessons-manager" element={<AdminLessonsManager />} />
    <Route path="users" element={<AdminUsers />} />
  </Route>
);

export default AdminRoutes; 