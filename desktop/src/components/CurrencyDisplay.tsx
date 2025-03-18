import { Diamond as GemIcon } from '@mui/icons-material';
import { Box, Typography, Tooltip, Badge, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { currencyService } from '../services';

import type { FC } from 'react';

interface CurrencyDisplayProps {
  showLabel?: boolean;
  variant?: 'default' | 'compact' | 'large';
  color?: string;
  amount?: number;
  size?: string;
}

const CurrencyDisplay: FC<CurrencyDisplayProps> = ({
  showLabel = true,
  variant = 'default',
  color,
  amount,
  size,
}) => {
  const theme = useTheme();
  const [balance, setBalance] = useState(amount !== undefined ? amount : 0);
  const [recentChange, setRecentChange] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  // Map size prop to variant for backward compatibility
  const effectiveVariant = size ? (size === 'small' ? 'compact' : size === 'large' ? 'large' : 'default') : variant;

  useEffect(() => {
    // If amount is provided, use it directly
    if (amount !== undefined) {
      setBalance(amount);
      return;
    }

    // Otherwise initialize with current balance from service
    setBalance(currencyService.getBalance());

    // Subscribe to currency changes
    const handleCurrencyChange = (data: any) => {
      const oldBalance = balance;
      const newBalance = data.balance;
      const change = newBalance - oldBalance;

      // Only show animation for positive changes
      if (change > 0) {
        setRecentChange(change);
        setAnimating(true);

        // Reset animation after delay
        setTimeout(() => {
          setAnimating(false);
          setRecentChange(null);
        }, 2000);
      }

      setBalance(newBalance);
    };

    currencyService.subscribe(handleCurrencyChange);

    return () => {
      currencyService.unsubscribe(handleCurrencyChange);
    };
  }, [amount, balance]);

  // Determine size based on variant
  const getIconSize = () => {
    switch (effectiveVariant) {
      case 'compact':
        return 'small';
      case 'large':
        return 'large';
      default:
        return 'medium';
    }
  };

  const getFontSize = () => {
    switch (effectiveVariant) {
      case 'compact':
        return '0.875rem';
      case 'large':
        return '1.5rem';
      default:
        return '1rem';
    }
  };

  const getIconColor = () => {
    if (color) return color;
    return theme.palette.mode === 'dark' ? '#64b5f6' : '#1976d2';
  };

  return (
    <Tooltip title="Your gem balance" arrow>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Badge
          badgeContent={recentChange ? `+${recentChange}` : 0}
          color="success"
          sx={{
            '& .MuiBadge-badge': {
              opacity: animating ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              fontWeight: 'bold',
            },
          }}
        >
          <GemIcon
            fontSize={getIconSize()}
            sx={{
              color: getIconColor(),
              mr: 0.5,
              animation: animating ? 'pulse 0.5s ease-in-out' : 'none',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.2)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
          />
        </Badge>
        <Typography
          variant={effectiveVariant === 'large' ? 'h6' : 'body1'}
          component="span"
          sx={{
            fontWeight: 'bold',
            fontSize: getFontSize(),
            color: color || 'inherit',
            animation: animating ? 'fadeIn 0.5s ease-in-out' : 'none',
            '@keyframes fadeIn': {
              '0%': { opacity: 0.5 },
              '100%': { opacity: 1 },
            },
          }}
        >
          {balance.toLocaleString()}
        </Typography>
        {showLabel && effectiveVariant !== 'compact' && (
          <Typography
            variant="body2"
            component="span"
            sx={{
              ml: 0.5,
              color: color || 'text.secondary',
              fontSize: effectiveVariant === 'large' ? '1rem' : '0.75rem',
            }}
          >
            gems
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default CurrencyDisplay;
