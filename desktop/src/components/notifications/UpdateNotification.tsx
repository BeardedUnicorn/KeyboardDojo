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
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';

import { updateService, useLogger } from '../../services';

import type { UpdateInfo, UpdateProgress } from '../../services';

// Styles object for consistent styling
const STYLES = {
  floatingButton: {
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: 1000,
    borderRadius: 28,
    minWidth: 'auto',
    px: 2,
  },
  closeButton: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  progressContainer: {
    width: '100%',
    mt: 2,
  },
  progressText: {
    display: 'block',
    mt: 1,
    textAlign: 'center',
  },
  releaseNotesContainer: {
    mt: 2,
    mb: 2,
    maxHeight: 200,
    overflow: 'auto',
  },
  versionText: {
    mt: 2,
    mb: 1,
  },
  versionInfo: {
    color: 'text.secondary',
  },
};

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
const UpdateNotification = memo(({
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

  // Handle progress changes
  const handleProgressChange = useCallback((progress: UpdateProgress) => {
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
  }, []);

  // Check for updates
  const checkForUpdates = useCallback(async () => {
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
  }, [logger]);

  // Download and install update
  const downloadAndInstallUpdate = useCallback(async () => {
    try {
      await updateService.downloadAndInstallUpdate();
    } catch (error) {
      logger.error('Error downloading and installing update:', error);
      setError('Failed to download and install update');
      setSnackbarOpen(true);
    }
  }, [logger]);

  // Restart app to apply update
  const restartApp = useCallback(async () => {
    try {
      await updateService.restartApp();
    } catch (error) {
      logger.error('Error restarting app:', error);
      setError('Failed to restart app');
      setSnackbarOpen(true);
    }
  }, [logger]);

  // Close snackbar
  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  // Close dialog
  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  // Open dialog and close snackbar
  const handleViewUpdate = useCallback(() => {
    setDialogOpen(true);
    setSnackbarOpen(false);
  }, []);

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
  }, [checkOnMount, autoCheck, checkInterval, logger, handleProgressChange, checkForUpdates]);

  // Memoized progress bar component
  const ProgressBar = useMemo(() => {
    if (updateProgress.status === 'checking' || updateProgress.status === 'downloading') {
      return (
        <Box sx={STYLES.progressContainer}>
          <LinearProgress
            variant={updateProgress.status === 'checking' ? 'indeterminate' : 'determinate'}
            value={updateProgress.progress * 100}
          />
          <Typography variant="caption" sx={STYLES.progressText}>
            {updateProgress.status === 'checking'
              ? 'Checking for updates...'
              : `Downloading update: ${Math.round(updateProgress.progress * 100)}%`}
          </Typography>
        </Box>
      );
    }

    return null;
  }, [updateProgress.status, updateProgress.progress]);

  // Memoized release notes component
  const ReleaseNotes = useMemo(() => {
    if (!updateInfo?.body) return null;

    return (
      <Box sx={STYLES.releaseNotesContainer}>
        <Typography variant="subtitle2" gutterBottom>
          Release Notes:
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
          {updateInfo.body}
        </Typography>
      </Box>
    );
  }, [updateInfo?.body]);

  // Memoized dialog title
  const dialogTitle = useMemo(() => {
    if (updateProgress.status === 'ready') {
      return 'Update Ready to Install';
    } else if (updateInfo?.available) {
      return 'Update Available';
    }
    return 'Check for Updates';
  }, [updateProgress.status, updateInfo?.available]);

  // Memoized dialog actions
  const DialogActionButtons = useMemo(() => {
    if (updateProgress.status === 'ready') {
      return (
        <>
          <Button onClick={handleDialogClose}>Later</Button>
          <Button onClick={restartApp} variant="contained" color="primary">
            Install and Restart
          </Button>
        </>
      );
    } else if (updateInfo?.available && updateProgress.status !== 'downloading') {
      return (
        <>
          <Button onClick={handleDialogClose}>Later</Button>
          <Button onClick={downloadAndInstallUpdate} variant="contained" color="primary">
            Download
          </Button>
        </>
      );
    } else if (updateProgress.status === 'downloading') {
      return <Button onClick={handleDialogClose}>Hide</Button>;
    }

    return (
      <>
        <Button onClick={handleDialogClose}>Close</Button>
        <Button onClick={checkForUpdates} variant="outlined">
          Check Again
        </Button>
      </>
    );
  }, [
    updateProgress.status,
    updateInfo?.available,
    handleDialogClose,
    restartApp,
    downloadAndInstallUpdate,
    checkForUpdates,
  ]);

  return (
    <>
      {/* Floating update button */}
      {showFloatingButton && updateInfo?.available && updateProgress.status !== 'downloading' && (
        <Tooltip title="Update available">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SystemUpdateIcon />}
            onClick={() => setDialogOpen(true)}
            sx={STYLES.floatingButton}
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
              onClick={handleViewUpdate}
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
          {dialogTitle}
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={STYLES.closeButton}
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
              <Typography variant="h6" sx={STYLES.versionText}>
                Version {updateInfo.version}
              </Typography>

              {ReleaseNotes}

              <Typography variant="caption" sx={STYLES.versionInfo}>
                Current version: {updateInfo.currentVersion}
                {updateInfo.date && ` • Released: ${new Date(updateInfo.date).toLocaleDateString()}`}
              </Typography>

              {ProgressBar}
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
          {DialogActionButtons}
        </DialogActions>
      </Dialog>
    </>
  );
});

// Add display name for debugging
UpdateNotification.displayName = 'UpdateNotification';

export default UpdateNotification;
