import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
} from '@mui/material';
import React from 'react';

import { TRANSITIONS, ELEVATION } from '@/theme';

// Use mock LoadingIcon in test environment if available
let LoadingIcon;
if (typeof window !== 'undefined' && window.MOCK_LOADING_ICON) {
  LoadingIcon = window.MOCK_LOADING_ICON;
} else {
  // Import the real component
  const { LoadingIcon: RealLoadingIcon } = require('../feedback/FeedbackAnimation');
  LoadingIcon = RealLoadingIcon;
}

import type {
  BaseComponentProps,
  DisableableProps,
  LoadableProps,
  ClickableProps,
  ThemeableProps,
} from './types';
import type { ReactNode ,FC } from 'react';

// Extend the Window interface for our mock
declare global {
  interface Window {
    MOCK_LOADING_ICON?: any;
  }
}

type CardThemeableProps = Omit<ThemeableProps, 'variant'>;

/**
 * Props for the enhanced Card component
 * @extends {BaseComponentProps} Base component properties
 * @extends {DisableableProps} Properties for disabled state
 * @extends {LoadableProps} Properties for loading state
 * @extends {ClickableProps} Properties for click handling
 * @extends {CardThemeableProps} Properties for theming (without variant)
 */
export interface CardProps
  extends BaseComponentProps,
    DisableableProps,
    LoadableProps,
    Omit<ClickableProps, 'onClick'>,
    CardThemeableProps {
  /** Card title */
  title?: ReactNode;
  /** Card subtitle */
  subtitle?: ReactNode;
  /** Card content */
  children: ReactNode;
  /** Actions to display at the bottom of the card */
  actions?: ReactNode;
  /** Icon to display in the header */
  icon?: ReactNode;
  /** Whether to show hover effects */
  hoverable?: boolean;
  /** Whether to use elevated style */
  elevated?: boolean;
  /** Whether to show a border */
  bordered?: boolean;
  /** Custom header content */
  headerContent?: ReactNode;
  /** Custom header actions */
  headerActions?: ReactNode;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Enhanced Card component with loading state and hover effects
 *
 * @component
 * @example
 * ```tsx
 * <Card
 *   title="Feature Card"
 *   subtitle="Supporting text"
 *   icon={<StarIcon />}
 *   hoverable
 *   elevated
 * >
 *   Card content goes here
 * </Card>
 * ```
 */
export const Card: FC<CardProps> = ({
  title,
  subtitle,
  children,
  actions,
  icon,
  className,
  style,
  disabled,
  loading,
  loadingText,
  onClick,
  clickable,
  color,
  hoverable = false,
  elevated = false,
  bordered = false,
  headerContent,
  headerActions,
  ...props
}) => {
  // Handle click events
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  return (
    <MuiCard
      className={className}
      style={style}
      onClick={clickable ? handleClick : undefined}
      variant={bordered ? 'outlined' : 'elevation'}
      elevation={elevated ? 3 : 1}
      sx={{
        position: 'relative',
        cursor: clickable && !disabled ? 'pointer' : 'default',
        opacity: disabled ? 0.6 : 1,
        transition: TRANSITIONS.medium,
        boxShadow: elevated ? ELEVATION.medium : ELEVATION.low,
        ...(hoverable && !disabled && {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: ELEVATION.high,
          },
        }),
        ...(color && {
          borderColor: `${color}.main`,
        }),
      }}
      {...props}
    >
      {(title || subtitle || icon || headerContent || headerActions) && (
        <CardHeader
          avatar={icon}
          title={
            headerContent || (
              <Typography variant="h6" color={color ? `${color}.main` : 'inherit'}>
                {title}
              </Typography>
            )
          }
          subheader={subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
          action={headerActions}
          sx={{ pb: 1 }}
        />
      )}

      <CardContent
        sx={{
          position: 'relative',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 100,
            }}
          >
            <LoadingIcon size={32} />
            {loadingText && (
              <Typography variant="body2" sx={{ ml: 1 }}>
                {loadingText}
              </Typography>
            )}
          </Box>
        ) : (
          children
        )}
      </CardContent>

      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
};

export default Card;
