import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { CheckIcon, FavoriteIcon } from '../components/icons';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SubscriptionTier } from '../services/subscriptionService';
import { formatDate } from '../utils/dateUtils';

// Mock data for subscription plans
const mockPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Basic keyboard shortcuts',
      'Limited lessons',
      'Progress tracking',
    ],
    isPopular: false,
    tier: SubscriptionTier.FREE
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    interval: 'month',
    features: [
      'All keyboard shortcuts',
      'Unlimited lessons',
      'Advanced progress tracking',
      'Custom practice sessions',
      'No ads',
    ],
    isPopular: true,
    tier: SubscriptionTier.PREMIUM
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    interval: 'month',
    features: [
      'Everything in Premium',
      'Team collaboration',
      'Analytics dashboard',
      'Priority support',
      'Custom shortcuts',
      'API access',
    ],
    isPopular: false,
    tier: SubscriptionTier.PRO
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

const SubscriptionPage: React.FC = () => {
  const { 
    hasPremium,
    isPremiumLoading: isLoading
  } = useSubscription();

  // Mock state for the subscription page
  const [plans] = useState(mockPlans);
  const [activePlan] = useState({
    ...mockPlans[0],
    expiresAt: new Date().toISOString(),
    paymentMethod: 'Credit Card'
  });
  const [hasPro] = useState(false);
  
  const [tabValue, setTabValue] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [autoRenew, setAutoRenew] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
    setPaymentMethod('');
    setError(null);
  };

  // Mock subscription functions
  const subscribe = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setSuccess('Subscription successful!');
    setCheckoutOpen(false);
  };

  const cancelSubscription = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setSuccess('Subscription cancelled!');
  };

  const simulateSubscription = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setSuccess('Subscription simulated!');
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      await subscribe();
      setSuccess('Successfully subscribed!');
      setCheckoutOpen(false);
    } catch (err) {
      setError('Failed to process subscription. Please try again.');
      console.error('Subscription error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Render subscription plans
  const renderPlans = () => {
    return (
      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} md={plan.id === 'free' ? 12 : 6} key={plan.id}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                borderWidth: plan.id === activePlan?.id ? 2 : 1,
                borderColor: plan.id === activePlan?.id ? 'primary.main' : 'divider',
              }}
            >
              {plan.id === activePlan?.id && (
                <Chip 
                  label="Current Plan" 
                  color="primary" 
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10,
                    fontWeight: 'bold'
                  }}
                />
              )}
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {plan.name}
                </Typography>
                
                <Typography variant="h4" component="div" color="primary" gutterBottom>
                  ${plan.price.toFixed(2)}
                  {plan.interval !== 'month' && plan.price > 0 && (
                    <Typography variant="body2" component="span" color="text.secondary">
                      /year
                    </Typography>
                  )}
                  {plan.interval === 'month' && plan.price > 0 && (
                    <Typography variant="body2" component="span" color="text.secondary">
                      /month
                    </Typography>
                  )}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <List dense>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                {plan.id === 'free' ? (
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    disabled
                  >
                    Current Free Plan
                  </Button>
                ) : plan.id === activePlan?.id ? (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    fullWidth
                    onClick={cancelSubscription}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <CircularProgress size={24} /> : 'Cancel Subscription'}
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isProcessing}
                  >
                    Subscribe
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Render current subscription details
  const renderSubscriptionDetails = () => {
    if (!activePlan || activePlan.id === 'free') {
      return (
        <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
          <Typography variant="h6" gutterBottom>
            No Active Subscription
          </Typography>
          <Typography variant="body1">
            You are currently on the free plan. Subscribe to a premium plan to unlock additional features.
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>
          Current Subscription
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Plan
            </Typography>
            <Typography variant="body1" gutterBottom>
              {activePlan.name}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Typography variant="body1" gutterBottom>
              Active
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Price
            </Typography>
            <Typography variant="body1" gutterBottom>
              ${activePlan.price.toFixed(2)}/{activePlan.interval}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Auto-renew
            </Typography>
            <Typography variant="body1" gutterBottom>
              {hasPremium ? 'Enabled' : 'Disabled'}
            </Typography>
          </Grid>
          
          {activePlan.expiresAt && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Expires
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDate(new Date(activePlan.expiresAt))}
              </Typography>
            </Grid>
          )}
          
          {activePlan.paymentMethod && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Payment Method
              </Typography>
              <Typography variant="body1" gutterBottom>
                {activePlan.paymentMethod}
              </Typography>
            </Grid>
          )}
        </Grid>
        
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="outlined" 
            color="error"
            onClick={cancelSubscription}
            disabled={isProcessing}
          >
            {isProcessing ? <CircularProgress size={24} /> : 'Cancel Subscription'}
          </Button>
        </Box>
      </Paper>
    );
  };

  // Render demo section
  const renderDemoSection = () => {
    return (
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>
          Demo Subscription
        </Typography>
        <Typography variant="body2" paragraph>
          For demonstration purposes, you can simulate subscribing to premium plans without payment.
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => simulateSubscription()}
            disabled={isProcessing}
            startIcon={<FavoriteIcon />}
          >
            Simulate Premium Monthly
          </Button>
          
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => simulateSubscription()}
            disabled={isProcessing}
          >
            Simulate Pro Monthly
          </Button>
        </Box>
      </Paper>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Subscription
      </Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="subscription tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="Plans" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="My Subscription" id="tab-1" aria-controls="tabpanel-1" />
        <Tab label="Demo" id="tab-2" aria-controls="tabpanel-2" />
      </Tabs>
      
      <TabPanel value={tabValue} index={0}>
        {renderPlans()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {renderSubscriptionDetails()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        {renderDemoSection()}
      </TabPanel>
      
      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onClose={handleCloseCheckout} maxWidth="sm" fullWidth>
        <DialogTitle>Complete Your Subscription</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Selected Plan: {plans.find(p => p.id === selectedPlan)?.name}
            </Typography>
            <Typography variant="body1" color="primary" gutterBottom>
              ${plans.find(p => p.id === selectedPlan)?.price.toFixed(2)}/
              {plans.find(p => p.id === selectedPlan)?.interval}
            </Typography>
          </Box>
          
          <TextField
            label="Payment Method"
            placeholder="Card number or payment details"
            fullWidth
            margin="normal"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
              />
            }
            label="Auto-renew subscription"
            sx={{ mt: 2 }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Note: This is a demo application. No actual payment will be processed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCheckout}>Cancel</Button>
          <Button 
            onClick={handleSubscribe} 
            variant="contained" 
            color="primary"
            disabled={!paymentMethod || isProcessing}
          >
            {isProcessing ? <CircularProgress size={24} /> : 'Subscribe'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionPage; 