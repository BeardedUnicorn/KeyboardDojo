import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

import { RootState } from '../../store';

interface PremiumFeatureProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showLock?: boolean;
  hideContentOnLock?: boolean;
}

/**
 * A component that wraps premium content, showing either the content
 * for subscribed users or a purchase prompt for non-premium users.
 */
const PremiumFeature: React.FC<PremiumFeatureProps> = ({
  children,
  title = 'Premium Feature',
  description = 'This feature is only available to premium subscribers.',
  showLock = true,
  hideContentOnLock = true,
}) => {
  const { isPremium, loading } = useSelector((state: RootState) => state.subscription);

  // While loading, don't show anything
  if (loading) return null;

  // User has premium access, show the content
  if (isPremium) {
    return <>{children}</>;
  }

  // User doesn't have premium access
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        mb: 3,
      }}
    >
      {showLock && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LockIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h3" color="text.primary">
            {title}
          </Typography>
        </Box>
      )}

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>

      {!hideContentOnLock && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ opacity: 0.6, mb: 3, pointerEvents: 'none' }}>
            {children}
          </Box>
        </>
      )}

      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/subscription"
        sx={{ mt: hideContentOnLock ? 1 : 2 }}
      >
        Upgrade to Premium
      </Button>
    </Paper>
  );
};

export default PremiumFeature; 