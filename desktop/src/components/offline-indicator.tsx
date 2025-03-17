import { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, Chip, useTheme } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';

interface OfflineIndicatorProps {
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
}

const OfflineIndicator = ({ position = 'bottom-right' }: OfflineIndicatorProps) => {
  const theme = useTheme();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSnackbarMessage('You are back online');
      setShowSnackbar(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSnackbarMessage('You are offline. Changes will be synced when you reconnect.');
      setShowSnackbar(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // Position styles
  const positionStyles = {
    'top-right': {
      top: 16,
      right: 16,
    },
    'bottom-right': {
      bottom: 16,
      right: 16,
    },
    'bottom-left': {
      bottom: 16,
      left: 16,
    },
    'top-left': {
      top: 16,
      left: 16,
    },
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          ...positionStyles[position],
          zIndex: 1000,
        }}
      >
        <Chip
          icon={isOnline ? <WifiIcon /> : <WifiOffIcon />}
          label={isOnline ? 'Online' : 'Offline'}
          color={isOnline ? 'success' : 'error'}
          variant="outlined"
          sx={{
            fontWeight: 'bold',
            boxShadow: theme.shadows[2],
            backgroundColor: isOnline ? 'rgba(46, 125, 50, 0.1)' : 'rgba(211, 47, 47, 0.1)',
          }}
        />
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={isOnline ? 'success' : 'warning'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default OfflineIndicator; 