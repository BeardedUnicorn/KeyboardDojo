import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import { CircularProgress, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { getToken, verifyToken } from '../../api/authService';

/**
 * ProtectedRoute component that redirects to login if not authenticated
 */
const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      if (isAuthenticated) {
        setIsVerified(true);
        setIsVerifying(false);
        return;
      }

      // Try to verify from token if available
      const token = getToken();
      if (token) {
        try {
          const { valid } = await verifyToken(token);
          setIsVerified(valid);
        } catch (error) {
          setIsVerified(false);
        }
      } else {
        setIsVerified(false);
      }
      
      setIsVerifying(false);
    };

    verifySession();
  }, [isAuthenticated]);

  if (isVerifying) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isVerified ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute; 