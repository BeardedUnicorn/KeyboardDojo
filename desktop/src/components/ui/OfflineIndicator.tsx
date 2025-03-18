import CloudSyncIcon from '@mui/icons-material/CloudSync';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { Box, Snackbar, Alert, Chip, Tooltip, Badge, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

import { offlineService } from '../../services';

interface OfflineIndicatorProps {
  /**
   * Position of the indicator on the screen
   * @default 'bottom-right'
   */
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';

  /**
   * Whether to show pending changes count when online
   * @default true
   */
  showPendingChanges?: boolean;
}

/**
 * Offline Indicator Component
 *
 * This component displays an indicator when the app is offline,
 * and optionally shows the number of pending changes when online.
 * It also displays notifications when connection status changes.
 */
const OfflineIndicator = ({
  position = 'bottom-right',
  showPendingChanges = true,
}: OfflineIndicatorProps) => {
  const theme = useTheme();
  const [isOffline, setIsOffline] = useState(offlineService.isOffline());
  const [pendingChanges, setPendingChanges] = useState(offlineService.getPendingChangesCount());
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Initialize the offline service
    offlineService.initialize();

    // Add listeners for offline status and sync events
    const handleOfflineChange = (offline: boolean) => {
      setIsOffline(offline);

      // Show appropriate notification
      if (offline) {
        setSnackbarMessage('You are offline. Changes will be saved locally and synced when you reconnect.');
      } else {
        setSnackbarMessage('You are back online');
      }
      setShowSnackbar(true);
    };

    const handleSyncChange = () => {
      setPendingChanges(offlineService.getPendingChangesCount());
    };

    offlineService.addOfflineListener(handleOfflineChange);
    offlineService.addSyncListener(handleSyncChange);

    // Initial state
    setIsOffline(offlineService.isOffline());
    setPendingChanges(offlineService.getPendingChangesCount());

    // Clean up listeners on unmount
    return () => {
      offlineService.removeOfflineListener(handleOfflineChange);
      offlineService.removeSyncListener(handleSyncChange);
    };
  }, []);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // If online and no pending changes, and not showing the online status, don't render anything
  if (!isOffline && pendingChanges === 0 && !showSnackbar) {
    return null;
  }

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

  // Render the appropriate indicator based on status
  const renderIndicator = () => {
    // If offline, show offline indicator
    if (isOffline) {
      return (
        <Tooltip title="You are currently offline. Changes will be saved locally and synced when you're back online.">
          <Chip
            icon={<WifiOffIcon />}
            label="Offline"
            color="error"
            variant="outlined"
            size="small"
            sx={{
              fontWeight: 'bold',
              boxShadow: theme.shadows[2],
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              '& .MuiChip-label': {
                fontWeight: 'bold',
              },
            }}
          />
        </Tooltip>
      );
    }

    // If online but have pending changes, show sync indicator
    if (showPendingChanges && pendingChanges > 0) {
      return (
        <Tooltip title={`${pendingChanges} changes waiting to be synced`}>
          <Badge badgeContent={pendingChanges} color="primary" max={99}>
            <Chip
              icon={<CloudSyncIcon />}
              label="Syncing"
              color="warning"
              variant="outlined"
              size="small"
              sx={{
                fontWeight: 'bold',
                boxShadow: theme.shadows[2],
                backgroundColor: 'rgba(237, 108, 2, 0.1)',
                '& .MuiChip-label': {
                  fontWeight: 'bold',
                },
              }}
              onClick={() => offlineService.syncPendingChanges()}
            />
          </Badge>
        </Tooltip>
      );
    }

    // If online and showing snackbar notification, show online indicator
    if (showSnackbar) {
      return (
        <Tooltip title="You are online">
          <Chip
            icon={<WifiIcon />}
            label="Online"
            color="success"
            variant="outlined"
            size="small"
            sx={{
              fontWeight: 'bold',
              boxShadow: theme.shadows[2],
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              '& .MuiChip-label': {
                fontWeight: 'bold',
              },
            }}
          />
        </Tooltip>
      );
    }

    return null;
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
        {renderIndicator()}
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={isOffline ? 'warning' : 'success'}
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
