import {
  ShoppingCart as CartIcon,
  Diamond as GemIcon,
  Favorite as HeartIcon,
  AccessTime as TimeIcon,
  Palette as ThemeIcon,
  Speed as BoostIcon,
  AcUnit as StreakIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Tabs,
  Tab,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  useTheme,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import { currencyService, STORE_ITEMS } from '../../../services';

import CurrencyDisplay from './CurrencyDisplay';

import type { FC, SyntheticEvent } from 'react';

// Helper function to get the appropriate icon for a store item
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
      return <CartIcon />;
  }
};

interface StoreProps {
  onClose?: () => void;
}

const Store: FC<StoreProps> = ({ onClose: _onClose }) => {
  const theme = useTheme();
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [purchaseDialog, setPurchaseDialog] = useState<{ open: boolean; itemId: string | null }>({
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

  // Load currency data on mount
  useEffect(() => {
    setBalance(currencyService.getBalance());

    // Subscribe to currency changes
    const handleCurrencyChange = (event: { newBalance: number }) => {
      setBalance(event.newBalance);
    };

    currencyService.subscribe(handleCurrencyChange);

    return () => {
      currencyService.unsubscribe(handleCurrencyChange);
    };
  }, []);

  // Handle tab change
  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle purchase click
  const handlePurchaseClick = (itemId: string) => {
    setPurchaseDialog({
      open: true,
      itemId,
    });
  };

  // Handle purchase confirmation
  const handlePurchaseConfirm = () => {
    const itemId = purchaseDialog.itemId;
    if (!itemId) return;

    const item = STORE_ITEMS[itemId];
    if (!item) return;

    const success = currencyService.purchaseItem(itemId);

    setPurchaseDialog({ open: false, itemId: null });

    if (success) {
      setNotification({
        open: true,
        message: `Successfully purchased ${item.name}!`,
        severity: 'success',
      });
    } else {
      setNotification({
        open: true,
        message: `Not enough gems to purchase ${item.name}.`,
        severity: 'error',
      });
    }
  };

  // Handle purchase dialog close
  const handlePurchaseDialogClose = () => {
    setPurchaseDialog({ open: false, itemId: null });
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Filter items by category
  const getFilteredItems = () => {
    const categories = ['power_up', 'boost', 'cosmetic'];
    const selectedCategory = categories[activeTab];

    return Object.entries(STORE_ITEMS).filter(
      ([_, item]) => item.category === selectedCategory,
    );
  };

  // Check if user can afford an item
  const canAfford = (price: number) => {
    return balance >= price;
  };

  // Check if user already owns a one-time item
  const alreadyOwns = (itemId: string) => {
    const item = STORE_ITEMS[itemId];
    if (item.category === 'cosmetic' && (item as { oneTime?: boolean }).oneTime) {
      return currencyService.hasItem(itemId);
    }
    return false;
  };

  // Get item quantity
  const getItemQuantity = (itemId: string) => {
    return currencyService.getItemQuantity(itemId);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Store
        </Typography>
        <CurrencyDisplay amount={balance} size="large" />
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab
          icon={<HeartIcon />}
          label="Power-ups"
          iconPosition="start"
          sx={{ minHeight: 64 }}
        />
        <Tab
          icon={<BoostIcon />}
          label="Boosts"
          iconPosition="start"
          sx={{ minHeight: 64 }}
        />
        <Tab
          icon={<ThemeIcon />}
          label="Cosmetics"
          iconPosition="start"
          sx={{ minHeight: 64 }}
        />
      </Tabs>

      <Grid container spacing={3}>
        {getFilteredItems().map(([itemId, item]) => {
          const owned = alreadyOwns(itemId);
          const quantity = getItemQuantity(itemId);
          const affordable = canAfford(item.price);

          return (
            <Grid item xs={12} sm={6} md={4} key={itemId}>
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
                {quantity > 0 && (
                  <Badge
                    badgeContent={quantity}
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
                )}

                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  <Box sx={{ mr: 1 }}>{getItemIcon(itemId)}</Box>
                  <Typography variant="h6" component="h2">
                    {item.name}
                  </Typography>
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>

                  {item.category === 'boost' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Duration: {(item as { duration: number }).duration / (1000 * 60 * 60)} hours
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <Divider />

                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Chip
                    icon={<GemIcon />}
                    label={item.price}
                    color={affordable ? 'primary' : 'default'}
                    variant="outlined"
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePurchaseClick(itemId)}
                    disabled={owned || !affordable}
                  >
                    {owned ? 'Owned' : 'Purchase'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Purchase confirmation dialog */}
      <Dialog open={purchaseDialog.open} onClose={handlePurchaseDialogClose}>
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {purchaseDialog.itemId && (
              <>
                Are you sure you want to purchase{' '}
                <strong>{STORE_ITEMS[purchaseDialog.itemId]?.name}</strong> for{' '}
                <strong>{STORE_ITEMS[purchaseDialog.itemId]?.price} gems</strong>?
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePurchaseDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePurchaseConfirm} color="primary" variant="contained">
            Purchase
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

export default Store;
