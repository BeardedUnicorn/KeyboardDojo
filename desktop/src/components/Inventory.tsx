import {
  Inventory2 as InventoryIcon,
  Favorite as HeartIcon,
  AccessTime as TimeIcon,
  Palette as ThemeIcon,
  Speed as BoostIcon,
  AcUnit as StreakIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  useTheme,
  CircularProgress,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import { currencyService, STORE_ITEMS } from '../services';
import { formatTimeRemaining } from '../utils/dateTimeUtils';

import type { FC } from 'react';

// Helper function to get the appropriate icon for an inventory item
const getItemIcon = (itemId: string) => {
  switch (itemId) {
    case 'heart_refill':
      return <HeartIcon color="error" />;
    case 'streak_freeze':
      return <StreakIcon color="info" />;
    case 'xp_boost':
      return <BoostIcon color="warning" />;
    case 'dark_theme':
    case 'retro_theme':
      return <ThemeIcon color="secondary" />;
    default:
      return <InventoryIcon />;
  }
};

interface InventoryProps {
  onClose?: () => void;
}

const Inventory: FC<InventoryProps> = () => {
  const theme = useTheme();
  const [inventory, setInventory] = useState<Record<string, { quantity: number; purchaseDate: string }>>({});
  const [activeBoosts, setActiveBoosts] = useState<Record<string, { startTime: string; endTime: string }>>({});
  const [loading, setLoading] = useState(true);
  const [useDialog, setUseDialog] = useState<{ open: boolean; itemId: string | null }>({
    open: false,
    itemId: null,
  });
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Load inventory data on mount
  useEffect(() => {
    const currencyData = currencyService.getCurrencyData();
    setInventory(currencyData.inventory);
    setActiveBoosts(currencyData.activeBoosts);
    setLoading(false);

    // Subscribe to currency changes
    const handleCurrencyChange = () => {
      const updatedData = currencyService.getCurrencyData();
      setInventory(updatedData.inventory);
      setActiveBoosts(updatedData.activeBoosts);
    };

    currencyService.subscribe(handleCurrencyChange);

    // Set up timer to update remaining time for boosts
    const timer = setInterval(() => {
      setActiveBoosts({ ...currencyService.getCurrencyData().activeBoosts });
    }, 1000);

    return () => {
      currencyService.unsubscribe(handleCurrencyChange);
      clearInterval(timer);
    };
  }, []);

  // Handle use item click
  const handleUseItemClick = (itemId: string) => {
    setUseDialog({
      open: true,
      itemId,
    });
  };

  // Handle use item confirmation
  const handleUseItemConfirm = () => {
    const itemId = useDialog.itemId;
    if (!itemId) return;

    const item = STORE_ITEMS[itemId];
    if (!item) return;

    const success = currencyService.useItem(itemId);

    setUseDialog({ open: false, itemId: null });

    if (success) {
      setNotification({
        open: true,
        message: `Successfully used ${item.name}!`,
        severity: 'success',
      });
    } else {
      setNotification({
        open: true,
        message: `Failed to use ${item.name}.`,
        severity: 'error',
      });
    }
  };

  // Handle use dialog close
  const handleUseDialogClose = () => {
    setUseDialog({ open: false, itemId: null });
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Check if a boost is active
  const isBoostActive = (boostId: string) => {
    return currencyService.isBoostActive(boostId);
  };

  // Get remaining time for a boost
  const getBoostRemainingTime = (boostId: string) => {
    return currencyService.getBoostRemainingTime(boostId);
  };

  // Get inventory items
  const getInventoryItems = () => {
    return Object.entries(inventory)
      .filter(([itemId, data]) => data.quantity > 0)
      .map(([itemId, data]) => ({
        ...STORE_ITEMS[itemId],
        id: itemId,
        quantity: data.quantity,
        purchaseDate: data.purchaseDate,
      }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const inventoryItems = getInventoryItems();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Inventory
      </Typography>

      {inventoryItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Your inventory is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Visit the store to purchase items
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {inventoryItems.map((item) => {
            const isActive = item.category === 'boost' && isBoostActive(item.id);
            const remainingTime = isActive ? getBoostRemainingTime(item.id) : 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Badge
                    badgeContent={item.quantity}
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      '& .MuiBadge-badge': {
                        fontSize: '0.8rem',
                        height: '22px',
                        minWidth: '22px',
                      },
                    }}
                  />

                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: isActive ? theme.palette.success.main : theme.palette.primary.main,
                      color: isActive ? theme.palette.success.contrastText : theme.palette.primary.contrastText,
                    }}
                  >
                    <Box sx={{ mr: 1 }}>{getItemIcon(item.id)}</Box>
                    <Typography variant="h6" component="h2">
                      {item.name}
                    </Typography>
                    {isActive && (
                      <ActiveIcon sx={{ ml: 'auto', color: theme.palette.success.contrastText }} />
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {item.description}
                    </Typography>

                    {item.category === 'boost' && (
                      <Box sx={{ mt: 1 }}>
                        {isActive ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'success.main' }} />
                            <Typography variant="body2" color="success.main">
                              Active - {formatTimeRemaining(remainingTime)} remaining
                            </Typography>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              Duration: {(item as any).duration / (1000 * 60 * 60)} hours
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </CardContent>

                  <Divider />

                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Chip
                      label={`Quantity: ${item.quantity}`}
                      color="primary"
                      variant="outlined"
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUseItemClick(item.id)}
                      disabled={isActive}
                    >
                      {isActive ? 'Active' : 'Use'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Use item confirmation dialog */}
      <Dialog open={useDialog.open} onClose={handleUseDialogClose}>
        <DialogTitle>Confirm Use</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {useDialog.itemId && (
              <>
                Are you sure you want to use <strong>{STORE_ITEMS[useDialog.itemId]?.name}</strong>?
                {STORE_ITEMS[useDialog.itemId]?.category === 'boost' && (
                  <Box component="span" display="block" mt={1}>
                    This will activate the boost for{' '}
                    {(STORE_ITEMS[useDialog.itemId] as any).duration / (1000 * 60 * 60)} hours.
                  </Box>
                )}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUseDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUseItemConfirm} color="primary" variant="contained">
            Use Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Inventory;
