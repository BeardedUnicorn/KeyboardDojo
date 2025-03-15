import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';

import { AppDispatch } from '../../store/store';
import {
  fetchUserSubscription,
  createStripeCheckoutSession,
  cancelUserSubscription,
  selectSubscription,
  selectIsPremium,
  selectCheckoutUrl,
  selectSubscriptionLoading,
  selectSubscriptionError,
  resetCheckoutUrl,
} from './subscriptionSlice';
import { SubscriptionPlan, getPlanDisplayName, getStatusDisplayName, formatDate } from '../../api/subscriptionService';

const SubscriptionManagement: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const subscription = useSelector(selectSubscription);
  const isPremium = useSelector(selectIsPremium);
  const checkoutUrl = useSelector(selectCheckoutUrl);
  const isLoading = useSelector(selectSubscriptionLoading);
  const error = useSelector(selectSubscriptionError);
  
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [immediateCancel, setImmediateCancel] = useState(false);
  
  // Fetch subscription data on component mount
  useEffect(() => {
    dispatch(fetchUserSubscription());
  }, [dispatch]);
  
  // Redirect to Stripe Checkout if URL is available
  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      dispatch(resetCheckoutUrl());
    }
  }, [checkoutUrl, dispatch]);
  
  const handlePlanSelect = (plan: SubscriptionPlan) => {
    const successUrl = `${window.location.origin}/subscription/success`;
    const cancelUrl = `${window.location.origin}/subscription/management`;
    
    dispatch(createStripeCheckoutSession({
      plan,
      successUrl,
      cancelUrl,
    }));
  };
  
  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
    setImmediateCancel(false);
  };
  
  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };
  
  const handleCancelSubscription = () => {
    dispatch(cancelUserSubscription({ immediateCancel }));
    setOpenCancelDialog(false);
  };
  
  // Render subscription details if user has an active subscription
  const renderSubscriptionDetails = () => {
    if (!subscription) return null;
    
    return (
      <Card 
        sx={{ 
          mb: 4, 
          border: `1px solid ${theme.palette.primary.main}`,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            {subscription.status === 'active' || subscription.status === 'trialing' ? (
              <CheckCircleIcon color="success" />
            ) : (
              <WarningIcon color="warning" />
            )}
            <Typography variant="h5">Your Subscription</Typography>
          </Stack>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Plan
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {getPlanDisplayName(subscription.plan)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {getStatusDisplayName(subscription.status)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Current Period Start
              </Typography>
              <Typography variant="body1">
                {formatDate(subscription.currentPeriodStart)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Current Period End
              </Typography>
              <Typography variant="body1">
                {formatDate(subscription.currentPeriodEnd)}
              </Typography>
            </Grid>
            
            {subscription.cancelAtPeriodEnd && (
              <Grid item xs={12}>
                <Box sx={{ 
                  backgroundColor: theme.palette.warning.light, 
                  p: 2, 
                  borderRadius: 1,
                  mt: 2
                }}>
                  <Typography variant="body2" color="warning.dark">
                    Your subscription will end on {formatDate(subscription.currentPeriodEnd)}.
                    You will lose access to premium features after this date.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
          
          <Box mt={3}>
            {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={handleOpenCancelDialog}
              >
                Cancel Subscription
              </Button>
            )}
            
            {subscription.cancelAtPeriodEnd && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/contact')}
              >
                Contact Support to Reactivate
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  // Render subscription plans for users to select
  const renderSubscriptionPlans = () => {
    return (
      <>
        <Typography variant="h5" gutterBottom mb={3}>
          {isPremium ? 'Upgrade Your Plan' : 'Choose a Subscription Plan'}
        </Typography>
        
        <Grid container spacing={3}>
          {/* Monthly Plan */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={4}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                border: subscription?.plan === 'MONTHLY' 
                  ? `2px solid ${theme.palette.primary.main}` 
                  : 'none',
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Monthly Plan
              </Typography>
              <Typography variant="h4" component="p" color="primary.main" fontWeight="bold">
                $9.99
                <Typography variant="body1" component="span" color="text.secondary" ml={1}>
                  / month
                </Typography>
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Stack spacing={2} mb={3}>
                <Typography variant="body1" display="flex" alignItems="center">
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                  Access to all premium lessons
                </Typography>
                <Typography variant="body1" display="flex" alignItems="center">
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                  Advanced statistics and progress tracking
                </Typography>
                <Typography variant="body1" display="flex" alignItems="center">
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                  Custom practice sessions
                </Typography>
              </Stack>
              
              <Box mt="auto">
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => handlePlanSelect(SubscriptionPlan.MONTHLY)}
                  disabled={isLoading || (subscription?.plan === 'MONTHLY' && !subscription.cancelAtPeriodEnd)}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Select Monthly Plan'}
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Annual Plan */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={4}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: '0.3s',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                border: subscription?.plan === 'ANNUAL' 
                  ? `2px solid ${theme.palette.primary.main}` 
                  : 'none',
                backgroundColor: theme.palette.mode === 'light' 
                  ? 'rgba(25, 118, 210, 0.05)' 
                  : 'rgba(25, 118, 210, 0.15)',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: -30,
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  padding: '4px 16px',
                  transform: 'rotate(45deg)',
                  boxShadow: 1,
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  BEST VALUE
                </Typography>
              </Box>
              
              <Typography variant="h5" component="h2" gutterBottom>
                Annual Plan
              </Typography>
              <Typography variant="h4" component="p" color="primary.main" fontWeight="bold">
                $89.99
                <Typography variant="body1" component="span" color="text.secondary" ml={1}>
                  / year
                </Typography>
              </Typography>
              <Typography variant="body2" color="success.main" fontWeight="medium" mb={1}>
                Save 25% compared to monthly billing
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Stack spacing={2} mb={3}>
                <Typography variant="body1" display="flex" alignItems="center">
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                  Access to all premium lessons
                </Typography>
                <Typography variant="body1" display="flex" alignItems="center">
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                  Advanced statistics and progress tracking
                </Typography>
                <Typography variant="body1" display="flex" alignItems="center">
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                  Custom practice sessions
                </Typography>
                <Typography variant="body1" display="flex" alignItems="center">
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                  Priority support
                </Typography>
              </Stack>
              
              <Box mt="auto">
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  color="secondary"
                  onClick={() => handlePlanSelect(SubscriptionPlan.ANNUAL)}
                  disabled={isLoading || (subscription?.plan === 'ANNUAL' && !subscription.cancelAtPeriodEnd)}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Select Annual Plan'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };
  
  const renderCancelDialog = () => {
    return (
      <Dialog
        open={openCancelDialog}
        onClose={handleCloseCancelDialog}
      >
        <DialogTitle>Cancel Your Subscription?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your subscription? You have two options:
          </DialogContentText>
          <Box sx={{ mt: 2, pl: 2 }}>
            <Typography variant="body1" gutterBottom>
              1. Cancel at the end of your billing period: You'll maintain access to premium features until {formatDate(subscription?.currentPeriodEnd || 0)}.
            </Typography>
            <Typography variant="body1">
              2. Cancel immediately: Your subscription will end now, and you'll lose access to premium features immediately.
            </Typography>
          </Box>
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            backgroundColor: theme.palette.warning.light,
            borderRadius: 1
          }}>
            <Typography variant="body2" color="warning.dark">
              Note: We don't provide partial refunds for unused subscription time.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} color="primary">
            Keep Subscription
          </Button>
          <Button 
            onClick={() => {
              setImmediateCancel(false);
              handleCancelSubscription();
            }} 
            color="warning"
          >
            Cancel at Period End
          </Button>
          <Button 
            onClick={() => {
              setImmediateCancel(true);
              handleCancelSubscription();
            }} 
            color="error"
          >
            Cancel Immediately
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Subscription Management
      </Typography>
      
      {error && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      
      {isLoading && !checkoutUrl ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {renderSubscriptionDetails()}
          {renderSubscriptionPlans()}
        </>
      )}
      
      {renderCancelDialog()}
    </Container>
  );
};

export default SubscriptionManagement; 