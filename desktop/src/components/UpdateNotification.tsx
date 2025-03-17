import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  Snackbar,
  Alert,
  Typography,
  Box,
} from '@mui/material';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import CloseIcon from '@mui/icons-material/Close';
import { updateService, UpdateInfo, UpdateProgress, UpdateStatus } from '../services/updateService';

interface UpdateNotificationProps {
  checkOnMount?: boolean;
  autoCheck?: boolean;
  checkInterval?: number; // in minutes
}

/**
 * Update Notification Component
 * 
 * This component displays notifications when updates are available,
 * and allows the user to download and install updates.
 */
export const UpdateNotification = ({
  checkOnMount = true,
  autoCheck = true,
  checkInterval = 60, // 1 hour
}: UpdateNotificationProps) => {
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
        console.error('Error initializing update service:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
    };
    
    initializeUpdateService();
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
      console.error('Error checking for updates:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setSnackbarOpen(true);
    }
  };
  
  // Download and install update
  const downloadAndInstallUpdate = async () => {
    try {
      await updateService.downloadAndInstallUpdate();
    } catch (error) {
      console.error('Error downloading and installing update:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setSnackbarOpen(true);
    }
  };
  
  // Restart app to apply update
  const restartApp = async () => {
    try {
      await updateService.restartApp();
    } catch (error) {
      console.error('Error restarting app:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
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
    if (updateProgress.status === 'checking' || updateProgress.status === 'downloading') {
      return (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress
            variant={updateProgress.status === 'checking' ? 'indeterminate' : 'determinate'}
            value={updateProgress.progress * 100}
          />
          <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
            {updateProgress.status === 'checking'
              ? 'Checking for updates...'
              : `Downloading update: ${Math.round(updateProgress.progress * 100)}%`}
          </Typography>
        </Box>
      );
    }
    
    return null;
  };
  
  return (
    <>
      {/* Update available snackbar */}
      <Snackbar
        open={snackbarOpen && !error && updateInfo?.available}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={handleSnackbarClose}>
          {error}
        </Alert>
      </Snackbar>
      
      {/* Update dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Update Available
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
              <Typography variant="body2" sx={{ mb: 2 }}>
                {updateInfo.body || 'No release notes available.'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Current version: {updateInfo.currentVersion}
              </Typography>
              
              {renderProgressBar()}
            </>
          ) : (
            <DialogContentText>
              You are using the latest version of Keyboard Dojo.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
          {updateInfo?.available && (
            <>
              {updateProgress.status === 'ready' ? (
                <Button
                  onClick={restartApp}
                  variant="contained"
                  color="primary"
                  startIcon={<SystemUpdateIcon />}
                >
                  Restart Now
                </Button>
              ) : (
                <Button
                  onClick={downloadAndInstallUpdate}
                  variant="contained"
                  color="primary"
                  startIcon={<SystemUpdateIcon />}
                  disabled={updateProgress.status === 'downloading'}
                >
                  {updateProgress.status === 'downloading' ? 'Downloading...' : 'Update Now'}
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateNotification; 