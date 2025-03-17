import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert
} from '@mui/material';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import { updaterService, UpdateInfo, UpdateProgress, UpdateStatus } from '../../../shared/src/utils';

interface UpdateNotificationProps {
  checkOnMount?: boolean;
  checkInterval?: number; // in minutes
}

const UpdateNotification = ({ checkOnMount = true, checkInterval = 60 }: UpdateNotificationProps) => {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('not-available');
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [updateProgress, setUpdateProgress] = useState<UpdateProgress | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Add update event listener
    const unsubscribe = updaterService.addListener((status, info) => {
      setUpdateStatus(status);
      
      if (status === 'available' && info && 'version' in info) {
        setUpdateInfo(info as UpdateInfo);
        setOpen(true);
      } else if (status === 'downloading' && info && 'percent' in info) {
        setUpdateProgress(info as UpdateProgress);
      } else if (status === 'downloaded') {
        // Show dialog to restart and install
        setOpen(true);
      } else if (status === 'error' && info instanceof Error) {
        setError(info);
      }
    });

    // Enable auto updates if specified
    if (checkOnMount) {
      updaterService.enableAutoUpdates(checkInterval).catch(error => {
        console.error('Failed to enable auto updates:', error);
      });
    }

    return () => {
      unsubscribe();
      updaterService.disableAutoUpdates().catch(error => {
        console.error('Failed to disable auto updates:', error);
      });
    };
  }, [checkOnMount, checkInterval]);

  const handleCheckForUpdates = () => {
    updaterService.checkForUpdates().catch(error => {
      console.error('Failed to check for updates:', error);
    });
  };

  const handleDownload = () => {
    updaterService.downloadUpdate().catch(error => {
      console.error('Failed to download update:', error);
    });
  };

  const handleInstall = () => {
    updaterService.installUpdate().catch(error => {
      console.error('Failed to install update:', error);
    });
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Render nothing if no update is available and no error
  if (updateStatus === 'not-available' && !error) {
    return null;
  }

  return (
    <>
      {/* Update available button */}
      {updateStatus === 'available' && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<SystemUpdateIcon />}
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 1000,
          }}
        >
          Update Available
        </Button>
      )}

      {/* Update dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {updateStatus === 'available'
            ? 'Update Available'
            : updateStatus === 'downloading'
            ? 'Downloading Update'
            : updateStatus === 'downloaded'
            ? 'Update Ready to Install'
            : 'Check for Updates'}
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message}
            </Alert>
          )}

          {updateStatus === 'available' && updateInfo && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                A new version of Keyboard Dojo is available!
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                Version: {updateInfo.version}
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                Released: {new Date(updateInfo.releaseDate).toLocaleDateString()}
              </Typography>
              
              {updateInfo.releaseNotes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Release Notes:
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {updateInfo.releaseNotes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {updateStatus === 'downloading' && updateProgress && (
            <Box>
              <Typography variant="body2" gutterBottom>
                Downloading update... {Math.round(updateProgress.percent)}%
              </Typography>
              
              <LinearProgress
                variant="determinate"
                value={updateProgress.percent}
                sx={{ mt: 1, mb: 2 }}
              />
              
              <Typography variant="caption" color="text.secondary">
                {(updateProgress.transferred / 1024 / 1024).toFixed(2)} MB of{' '}
                {(updateProgress.total / 1024 / 1024).toFixed(2)} MB
                {' • '}
                {(updateProgress.bytesPerSecond / 1024 / 1024).toFixed(2)} MB/s
              </Typography>
            </Box>
          )}

          {updateStatus === 'downloaded' && (
            <Typography variant="body1">
              The update has been downloaded and is ready to install. The application will restart to
              complete the installation.
            </Typography>
          )}

          {updateStatus === 'not-available' && (
            <Typography variant="body1">
              You're using the latest version of Keyboard Dojo.
            </Typography>
          )}
        </DialogContent>
        
        <DialogActions>
          {updateStatus === 'available' && (
            <>
              <Button onClick={handleClose}>Later</Button>
              <Button onClick={handleDownload} variant="contained" color="primary">
                Download
              </Button>
            </>
          )}

          {updateStatus === 'downloading' && (
            <Button onClick={handleClose}>Hide</Button>
          )}

          {updateStatus === 'downloaded' && (
            <>
              <Button onClick={handleClose}>Later</Button>
              <Button onClick={handleInstall} variant="contained" color="primary">
                Install and Restart
              </Button>
            </>
          )}

          {updateStatus === 'not-available' && (
            <>
              <Button onClick={handleClose}>Close</Button>
              <Button onClick={handleCheckForUpdates} variant="outlined">
                Check Again
              </Button>
            </>
          )}

          {updateStatus === 'error' && (
            <>
              <Button onClick={handleClose}>Close</Button>
              <Button onClick={handleCheckForUpdates} variant="outlined">
                Try Again
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateNotification; 