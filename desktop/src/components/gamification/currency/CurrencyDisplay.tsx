import { Diamond as GemIcon } from '@mui/icons-material';
import { Box, Typography, Tooltip, Badge, useTheme, keyframes } from '@mui/material';
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';

import { useGamificationRedux } from '@/hooks';

import type { FC } from 'react';

interface CurrencyDisplayProps {
  showLabel?: boolean;
  variant?: 'default' | 'compact' | 'large';
  color?: string;
  amount?: number;
  size?: string;
}

// Size configurations
const VARIANTS = {
  compact: {
    iconSize: 'small',
    fontSize: '0.875rem',
  },
  default: {
    iconSize: 'medium',
    fontSize: '1rem',
  },
  large: {
    iconSize: 'large',
    fontSize: '1.5rem',
  },
} as const;

// Animation keyframes
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const fadeInAnimation = keyframes`
  0% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const CurrencyDisplay: FC<CurrencyDisplayProps> = memo(({
  showLabel = true,
  variant = 'default',
  color,
  amount,
  size,
}) => {
  const theme = useTheme();
  const { balance: serviceBalance } = useGamificationRedux();
  const [balance, setBalance] = useState(amount ?? serviceBalance);
  const [recentChange, setRecentChange] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  // Map size prop to variant for backward compatibility
  const effectiveVariant = useMemo(() =>
    size ? (size === 'small' ? 'compact' : size === 'large' ? 'large' : 'default') : variant,
    [size, variant],
  );

  // Memoize styles
  const styles = useMemo(() => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    },
    badge: {
      '& .MuiBadge-badge': {
        opacity: animating ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        fontWeight: 'bold',
      },
    },
    icon: {
      color: color || (theme.palette.mode === 'dark' ? '#64b5f6' : '#1976d2'),
      mr: 0.5,
      animation: animating ? `${pulseAnimation} 0.5s ease-in-out` : 'none',
    },
    value: {
      fontWeight: 'bold',
      fontSize: VARIANTS[effectiveVariant].fontSize,
      color: color || 'inherit',
      animation: animating ? `${fadeInAnimation} 0.5s ease-in-out` : 'none',
    },
    label: {
      ml: 0.5,
      color: color || 'text.secondary',
      fontSize: effectiveVariant === 'large' ? '1rem' : '0.75rem',
    },
  }), [theme.palette.mode, color, effectiveVariant, animating]);

  // Handle balance update
  const updateBalance = useCallback((newBalance: number, oldBalance: number) => {
    const change = newBalance - oldBalance;

    if (change > 0) {
      setRecentChange(change);
      setAnimating(true);

      const timer = setTimeout(() => {
        setAnimating(false);
        setRecentChange(null);
      }, 2000);

      return () => clearTimeout(timer);
    }

    setBalance(newBalance);
  }, []);

  // Update balance when amount prop or service balance changes
  useEffect(() => {
    const newBalance = amount ?? serviceBalance;
    updateBalance(newBalance, balance);
  }, [amount, serviceBalance, balance, updateBalance]);

  // Memoize icon size
  const iconSize = useMemo(() =>
    VARIANTS[effectiveVariant].iconSize,
    [effectiveVariant],
  );

  return (
    <Tooltip title="Your gem balance" arrow>
      <Box sx={styles.container}>
        <Badge
          badgeContent={recentChange ? `+${recentChange}` : 0}
          color="success"
          sx={styles.badge}
        >
          <GemIcon
            fontSize={iconSize}
            sx={styles.icon}
          />
        </Badge>
        <Typography
          variant={effectiveVariant === 'large' ? 'h6' : 'body1'}
          component="span"
          sx={styles.value}
        >
          {balance.toLocaleString()}
        </Typography>
        {showLabel && effectiveVariant !== 'compact' && (
          <Typography
            variant="body2"
            component="span"
            sx={styles.label}
          >
            gems
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
});

CurrencyDisplay.displayName = 'CurrencyDisplay';

export default CurrencyDisplay;
