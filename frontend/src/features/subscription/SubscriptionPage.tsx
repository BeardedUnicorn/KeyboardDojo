import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Stack,
  Container,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { RootState } from '../../store';
import { 
  fetchUserSubscription, 
  createStripeCheckoutSession, 
  cancelUserSubscription 
} from './subscriptionSlice';
import { SubscriptionPlan, formatDate, getPlanDisplayName, getStatusDisplayName } from '../../api/subscriptionService';

const SubscriptionPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  
  const { 
    subscription, 
    loading, 
    error, 
    isPremium, 
    checkoutUrl 
  } = useSelector((state: RootState) => state.subscription);
  
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchUserSubscription());
  }, [dispatch]);

  useEffect(() => {
    // If checkout URL is available, redirect to Stripe
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  const handleSubscribe = (plan: SubscriptionPlan) => {
    dispatch(createStripeCheckoutSession(plan));
  };

  const handleCancelSubscription = () => {
    dispatch(cancelUserSubscription());
    setOpenCancelDialog(false);
  };

  if (loading && !subscription) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading subscription information...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">
          Please sign in to manage your subscription
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ ml: 2 }}
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Subscription Management
      </Typography>
      
      {subscription ? (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Current Subscription
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ mr: 2 }}>
                Status:
              </Typography>
              <Chip 
                label={getStatusDisplayName(subscription.status)} 
                color={subscription.status === 'active' ? 'success' : 'default'} 
              />
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Plan
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {getPlanDisplayName(subscription.plan)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Renews On
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {formatDate(subscription.currentPeriodEnd)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            {subscription.cancelAtPeriodEnd ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Your subscription will end on {formatDate(subscription.currentPeriodEnd)}.
              </Alert>
            ) : (
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => setOpenCancelDialog(true)}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Cancel Subscription'}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Choose a Subscription Plan
          </Typography>
          <Typography variant="body1" paragraph>
            Unlock premium features and access to all lessons with a subscription.
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Monthly Plan
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    $9.99 <Typography variant="subtitle1" component="span">/month</Typography>
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography>Access to all premium lessons</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography>Advanced progress tracking</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography>No advertisements</Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={() => handleSubscribe(SubscriptionPlan.MONTHLY)}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Subscribe Now'}
                  </Button>
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: '2px solid #2e7d32',
                position: 'relative'
              }}>
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 20, 
                    bgcolor: '#2e7d32', 
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                  }}
                >
                  <Typography variant="subtitle2">BEST VALUE</Typography>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Annual Plan
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    $89.99 <Typography variant="subtitle1" component="span">/year</Typography>
                  </Typography>
                  <Typography variant="subtitle2" color="success.main" gutterBottom>
                    Save 25% compared to monthly
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography>Access to all premium lessons</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography>Advanced progress tracking</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography>No advertisements</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography>Priority support</Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="success"
                    onClick={() => handleSubscribe(SubscriptionPlan.ANNUAL)}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Subscribe Now'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Cancel Subscription Confirmation Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
      >
        <DialogTitle>Cancel Subscription?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your subscription? You'll continue to have access to premium features until the end of your current billing period ({subscription && formatDate(subscription.currentPeriodEnd)}).
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>Keep Subscription</Button>
          <Button onClick={handleCancelSubscription} color="error" autoFocus>
            {loading ? <CircularProgress size={24} /> : 'Cancel Subscription'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionPage; 