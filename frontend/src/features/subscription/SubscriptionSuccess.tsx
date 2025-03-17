import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Paper,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { RootState } from '../../store';
import { fetchUserSubscription } from './subscriptionSlice';
import { SubscriptionPlan } from '../../api/subscriptionService';

const SubscriptionSuccess: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscription, loading, error } = useSelector(
    (state: RootState) => state.subscription
  );

  useEffect(() => {
    // Fetch the updated subscription data
    dispatch(fetchUserSubscription());
  }, [dispatch]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Finalizing your subscription...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#fff8f8' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Subscription Error
          </Typography>
          <Typography variant="body1" paragraph>
            There was an issue confirming your subscription: {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/subscription')}
          >
            Return to Subscription Page
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          
          <Typography variant="h4" component="h1" gutterBottom>
            Thank You for Your Subscription!
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}>
            Your subscription has been successfully processed. You now have full 
            access to all premium content and features on Keyboard Dojo.
          </Typography>
          
          {subscription && (
            <Paper sx={{ p: 3, maxWidth: '500px', mx: 'auto', mb: 4, bgcolor: '#f9f9f9' }}>
              <Typography variant="h6" gutterBottom>
                Subscription Details
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Plan:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {subscription.plan === SubscriptionPlan.MONTHLY ? 'Monthly Plan' : 'Annual Plan'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Next Billing Date:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}
                </Typography>
              </Box>
            </Paper>
          )}
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/lessons')}
            >
              Explore Premium Lessons
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
            >
              Go to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SubscriptionSuccess; 