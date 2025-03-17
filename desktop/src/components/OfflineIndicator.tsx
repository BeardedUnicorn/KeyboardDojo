import { useEffect, useState } from 'react';
import { Box, Chip, Tooltip, Badge } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { offlineService } from '../services/offlineService';

interface OfflineIndicatorProps {
  showPendingChanges?: boolean;
}

/**
 * Offline Indicator Component
 * 
 * This component displays an indicator when the app is offline,
 * and optionally shows the number of pending changes.
 */
export const OfflineIndicator = ({ showPendingChanges = true }: OfflineIndicatorProps) => {
  const [isOffline, setIsOffline] = useState(offlineService.isOffline());
  const [pendingChanges, setPendingChanges] = useState(offlineService.getPendingChangesCount());
  
  useEffect(() => {
    // Initialize the offline service
    offlineService.initialize();
    
    // Add listeners for offline status and sync events
    const handleOfflineChange = (offline: boolean) => {
      setIsOffline(offline);
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
  
  // If online and no pending changes, don't show anything
  if (!isOffline && pendingChanges === 0) {
    return null;
  }
  
  // If offline, show offline indicator
  if (isOffline) {
    return (
      <Tooltip title="You are currently offline. Changes will be saved locally and synced when you're back online.">
        <Chip
          icon={<WifiOffIcon />}
          label="Offline"
          color="error"
          size="small"
          sx={{
            marginRight: 1,
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
            size="small"
            sx={{
              marginRight: 1,
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
  
  return null;
};

export default OfflineIndicator; 