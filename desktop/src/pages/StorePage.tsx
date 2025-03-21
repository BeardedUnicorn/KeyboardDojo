import {
  Diamond as DiamondIcon,
  ShoppingCart as CartIcon,
  CheckCircle as CheckIcon,
  AcUnit as FreezeIcon,
  Favorite as HeartIcon,
  Speed as SpeedIcon,
  DarkMode as DarkModeIcon,
  Terminal as TerminalIcon,
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
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';

import { useCurrency } from '@/hooks';
import { STORE_ITEMS } from '@/services';

import CurrencyDisplay from '../components/gamification/currency/CurrencyDisplay';

import type { FC, ReactNode, SyntheticEvent } from 'react';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`store-tabpanel-${index}`}
      aria-labelledby={`store-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const getIconForItem = (iconName: string) => {
  switch (iconName) {
    case 'AcUnit':
      return <FreezeIcon />;
    case 'Favorite':
      return <HeartIcon />;
    case 'Speed':
      return <SpeedIcon />;
    case 'DarkMode':
      return <DarkModeIcon />;
    case 'Terminal':
      return <TerminalIcon />;
    default:
      return <CartIcon />;
  }
};

const StorePage: FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    balance,
    purchaseItem,
    hasItem,
    getItemQuantity,
    getStoreItems,
  } = useCurrency();

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePurchaseClick = (itemId: string) => {
    setSelectedItem(itemId);
    setPurchaseDialogOpen(true);
  };

  const handlePurchaseConfirm = () => {
    if (!selectedItem) return;

    const item = STORE_ITEMS[selectedItem];

    // Check if one-time item is already owned
    if (item.category === 'cosmetic' && hasItem(item.id)) {
      setErrorMessage('You already own this item.');
      setPurchaseDialogOpen(false);
      setErrorDialogOpen(true);
      return;
    }

    // Try to purchase the item
    const success = purchaseItem(selectedItem);

    setPurchaseDialogOpen(false);

    if (success) {
      setSuccessDialogOpen(true);
    } else {
      setErrorMessage('Not enough gems to purchase this item.');
      setErrorDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setPurchaseDialogOpen(false);
    setSuccessDialogOpen(false);
    setErrorDialogOpen(false);
  };

  // Filter items by category
  const powerUps = getStoreItems().filter((item) => item.category === 'power_up');
  const boosts = getStoreItems().filter((item) => item.category === 'boost');
  const cosmetics = getStoreItems().filter((item) => item.category === 'cosmetic');

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Keyboard Dojo Store
        </Typography>

        <CurrencyDisplay variant="large" />
      </Box>

      <Typography variant="body1" paragraph>
        Spend your hard-earned Key Gems on power-ups, boosts, and cosmetic items to enhance your experience.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="store categories"
          centered
        >
          <Tab label="Power-Ups" />
          <Tab label="Boosts" />
          <Tab label="Cosmetics" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {powerUps.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  <Box sx={{ mr: 1 }}>
                    {getIconForItem(item.icon)}
                  </Box>
                  <Typography variant="h6">{item.name}</Typography>
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>

                  {getItemQuantity(item.id) > 0 && (
                    <Chip
                      icon={<CheckIcon />}
                      label={`Owned: ${getItemQuantity(item.id)}`}
                      color="success"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  )}
                </CardContent>

                <Divider />

                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DiamondIcon sx={{ color: theme.palette.primary.main, mr: 0.5 }} />
                    <Typography variant="h6" color="primary">
                      {item.price}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CartIcon />}
                    onClick={() => handlePurchaseClick(item.id)}
                    disabled={balance < item.price}
                  >
                    Buy
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {boosts.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: theme.palette.warning.main,
                    color: theme.palette.warning.contrastText,
                  }}
                >
                  <Box sx={{ mr: 1 }}>
                    {getIconForItem(item.icon)}
                  </Box>
                  <Typography variant="h6">{item.name}</Typography>
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>

                  {getItemQuantity(item.id) > 0 && (
                    <Chip
                      icon={<CheckIcon />}
                      label={`Owned: ${getItemQuantity(item.id)}`}
                      color="success"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  )}
                </CardContent>

                <Divider />

                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DiamondIcon sx={{ color: theme.palette.primary.main, mr: 0.5 }} />
                    <Typography variant="h6" color="primary">
                      {item.price}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<CartIcon />}
                    onClick={() => handlePurchaseClick(item.id)}
                    disabled={balance < item.price}
                  >
                    Buy
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {cosmetics.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                  }}
                >
                  <Box sx={{ mr: 1 }}>
                    {getIconForItem(item.icon)}
                  </Box>
                  <Typography variant="h6">{item.name}</Typography>
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>

                  {hasItem(item.id) && (
                    <Chip
                      icon={<CheckIcon />}
                      label="Owned"
                      color="success"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  )}
                </CardContent>

                <Divider />

                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DiamondIcon sx={{ color: theme.palette.primary.main, mr: 0.5 }} />
                    <Typography variant="h6" color="primary">
                      {item.price}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<CartIcon />}
                    onClick={() => handlePurchaseClick(item.id)}
                    disabled={balance < item.price || hasItem(item.id)}
                  >
                    {hasItem(item.id) ? 'Owned' : 'Buy'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Purchase confirmation dialog */}
      <Dialog
        open={purchaseDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="purchase-dialog-title"
      >
        <DialogTitle id="purchase-dialog-title">
          Confirm Purchase
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedItem && (
              <>
                Are you sure you want to purchase {STORE_ITEMS[selectedItem].name} for{' '}
                {STORE_ITEMS[selectedItem].price} gems?
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handlePurchaseConfirm} color="primary" variant="contained">
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="success-dialog-title"
      >
        <DialogTitle id="success-dialog-title" sx={{ bgcolor: 'success.main', color: 'success.contrastText' }}>
          Purchase Successful!
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <CheckIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
            <DialogContentText>
              You have successfully purchased {selectedItem && STORE_ITEMS[selectedItem].name}!
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" variant="contained">
            Continue Shopping
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error dialog */}
      <Dialog
        open={errorDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="error-dialog-title"
      >
        <DialogTitle id="error-dialog-title" sx={{ bgcolor: 'error.main', color: 'error.contrastText' }}>
          Purchase Failed
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mt: 2 }}>
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StorePage;
