import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { AppDispatch } from '../../store/store';
import { fetchUserSubscription, selectSubscription, selectSubscriptionLoading } from './subscriptionSlice';

const SubscriptionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const subscription = useSelector(selectSubscription);
  const isLoading = useSelector(selectSubscriptionLoading);
  
  // Fetch subscription data on component mount
  useEffect(() => {
    dispatch(fetchUserSubscription());
  }, [dispatch]);
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{
          p: 5,
          textAlign: 'center',
          borderRadius: 2,
          maxWidth: 700,
          mx: 'auto',
        }}
      >
        <CheckCircleIcon
          color="success"
          sx={{ fontSize: 72, mb: 2 }}
        />
        
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Subscription Activated!
        </Typography>
        
        <Typography variant="h6" color="text.secondary" paragraph>
          Thank you for subscribing to Keyboard Dojo Premium
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ textAlign: 'left', mb: 4 }}>
          <Typography variant="body1" paragraph>
            Your premium subscription is now active, which gives you:
          </Typography>
          
          <Stack spacing={2} sx={{ ml: 2 }}>
            <Typography variant="body1" display="flex" alignItems="center">
              <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
              Access to all premium lessons and shortcuts
            </Typography>
            <Typography variant="body1" display="flex" alignItems="center">
              <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
              Advanced progress tracking and analytics
            </Typography>
            <Typography variant="body1" display="flex" alignItems="center">
              <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
              Custom practice sessions for your specific needs
            </Typography>
            <Typography variant="body1" display="flex" alignItems="center">
              <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
              Priority support from our team
            </Typography>
          </Stack>
        </Box>
        
        <Box>
          <Typography variant="body1" paragraph>
            You can manage your subscription at any time in your account settings.
          </Typography>
        </Box>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/lessons')}
          >
            Explore Premium Lessons
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/subscription/management')}
          >
            Manage Subscription
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SubscriptionSuccess; 