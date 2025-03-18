import CloseIcon from '@mui/icons-material/Close';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useState, useEffect } from 'react';

import { useLogger } from '../services/loggerService';
import { updateService } from '../services/updateService';

import type { UpdateInfo, UpdateProgress } from '../services/updateService';

interface UpdateNotificationProps {
  /**
   * Whether to check for updates when the component mounts
   * @default true
   */
  checkOnMount?: boolean;
  
  /**
   * Whether to automatically check for updates periodically
   * @default true
   */
  autoCheck?: boolean;
  
  /**
   * Interval in minutes to check for updates
   * @default 60
   */
  checkInterval?: number;
  
  /**
   * Whether to show a floating button when updates are available
   * @default true
   */
  showFloatingButton?: boolean;
}

/**
 * Update Notification Component
 *
 * This component displays notifications when updates are available,
 * and allows the user to download and install updates.
 */
const UpdateNotification = ({
  checkOnMount = true,
  autoCheck = true,
  checkInterval = 60,
  showFloatingButton = true,
}: UpdateNotificationProps) => {
  const logger = useLogger('UpdateNotification');
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [updateProgress, setUpdateProgress] = useState<UpdateProgress>({
    status: 'idle',
    progress: 0,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the update service
    const initializeUpdateService = async () => {
      try {
        await updateService.initialize();

        // Add progress listener
        updateService.addProgressListener(handleProgressChange);

        // Check for updates on mount if enabled
        if (checkOnMount) {
          checkForUpdates();
        }

        // Set up automatic update checking if enabled
        let intervalId: number | null = null;

        if (autoCheck && checkInterval > 0) {
          intervalId = window.setInterval(() => {
            checkForUpdates();
          }, checkInterval * 60 * 1000);
        }

        // Clean up on unmount
        return () => {
          updateService.removeProgressListener(handleProgressChange);

          if (intervalId !== null) {
            clearInterval(intervalId);
          }
        };
      } catch (error) {
        logger.error('Error initializing update service:', error);
        setError('Failed to initialize update service');
      }
    };

    // Log component mount
    logger.component('mount', { checkOnMount, autoCheck, checkInterval, showFloatingButton });
    
    initializeUpdateService();
    
    // Clean up on unmount
    return () => {
      logger.component('unmount');
    };
  }, [checkOnMount, autoCheck, checkInterval]);

  // Handle progress changes
  const handleProgressChange = (progress: UpdateProgress) => {
    setUpdateProgress(progress);

    // Show error if there is one
    if (progress.status === 'error' && progress.error) {
      setError(progress.error);
      setSnackbarOpen(true);
    }

    // Show dialog when update is ready
    if (progress.status === 'ready') {
      setDialogOpen(true);
    }
  };

  // Check for updates
  const checkForUpdates = async () => {
    try {
      const info = await updateService.checkForUpdates();
      setUpdateInfo(info);

      // Show snackbar if update is available
      if (info?.available) {
        setSnackbarOpen(true);
      }
    } catch (error) {
      logger.error('Error checking for updates:', error);
      setError('Failed to check for updates');
      setSnackbarOpen(true);
    }
  };

  // Download and install update
  const downloadAndInstallUpdate = async () => {
    try {
      await updateService.downloadAndInstallUpdate();
    } catch (error) {
      logger.error('Error downloading and installing update:', error);
      setError('Failed to download and install update');
      setSnackbarOpen(true);
    }
  };

  // Restart app to apply update
  const restartApp = async () => {
    try {
      await updateService.restartApp();
    } catch (error) {
      logger.error('Error restarting app:', error);
      setError('Failed to restart app');
      setSnackbarOpen(true);
    }
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Close dialog
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Render progress bar based on status
  const renderProgressBar = () => {
    if (
      updateProgress.status === 'checking' || 
      updateProgress.status === 'downloading'
    ) {
      return (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress
            variant={
              updateProgress.status === 'checking' 
                ? 'indeterminate' 
                : 'determinate'
            }
            value={updateProgress.progress * 100}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              mt: 1, 
              textAlign: 'center',
            }}
          >
            {updateProgress.status === 'checking'
              ? 'Checking for updates...'
              : `Downloading update: ${Math.round(updateProgress.progress * 100)}%`}
          </Typography>
        </Box>
      );
    }

    return null;
  };

  // Render release notes if available
  const renderReleaseNotes = () => {
    if (!updateInfo?.body) return null;
    
    return (
      <Box 
        sx={{ 
          mt: 2, 
          mb: 2, 
          maxHeight: 200, 
          overflow: 'auto',
        }}
      >
        <Typography 
          variant="subtitle2" 
          gutterBottom
        >
          Release Notes:
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ whiteSpace: 'pre-line' }}
        >
          {updateInfo.body}
        </Typography>
      </Box>
    );
  };

  return (
    <>
      {/* Floating update button */}
      {showFloatingButton && 
       updateInfo?.available && 
       updateProgress.status !== 'downloading' && (
        <Tooltip title="Update available">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SystemUpdateIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
              borderRadius: 28,
              minWidth: 'auto',
              px: 2,
            }}
          >
            Update
          </Button>
        </Tooltip>
      )}

      {/* Update available snackbar */}
      <Snackbar
        open={snackbarOpen && !error && updateInfo?.available}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          onClose={handleSnackbarClose}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                setDialogOpen(true);
                setSnackbarOpen(false);
              }}
            >
              View
            </Button>
          }
        >
          Update available: v{updateInfo?.version}
        </Alert>
      </Snackbar>

      {/* Error snackbar */}
      <Snackbar
        open={snackbarOpen && !!error}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={handleSnackbarClose}>
          {error}
        </Alert>
      </Snackbar>

      {/* Update dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {updateProgress.status === 'ready' 
            ? 'Update Ready to Install' 
            : updateInfo?.available 
              ? 'Update Available' 
              : 'Check for Updates'}
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {updateInfo?.available ? (
            <>
              <DialogContentText>
                A new version of Keyboard Dojo is available:
              </DialogContentText>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Version {updateInfo.version}
              </Typography>
              
              {renderReleaseNotes()}
              
              <Typography variant="caption" color="text.secondary">
                Current version: {updateInfo.currentVersion}
                {updateInfo.date && ` • Released: ${new Date(updateInfo.date).toLocaleDateString()}`}
              </Typography>

              {renderProgressBar()}
            </>
          ) : (
            <DialogContentText>
              {updateProgress.status === 'checking' 
                ? 'Checking for updates...' 
                : 'You are using the latest version of Keyboard Dojo.'}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          {updateProgress.status === 'ready' ? (
            <>
              <Button onClick={handleDialogClose}>Later</Button>
              <Button onClick={restartApp} variant="contained" color="primary">
                Install and Restart
              </Button>
            </>
          ) : updateInfo?.available && updateProgress.status !== 'downloading' ? (
            <>
              <Button onClick={handleDialogClose}>Later</Button>
              <Button onClick={downloadAndInstallUpdate} variant="contained" color="primary">
                Download
              </Button>
            </>
          ) : updateProgress.status === 'downloading' ? (
            <Button onClick={handleDialogClose}>Hide</Button>
          ) : (
            <>
              <Button onClick={handleDialogClose}>Close</Button>
              <Button onClick={checkForUpdates} variant="outlined">
                Check Again
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateNotification;
