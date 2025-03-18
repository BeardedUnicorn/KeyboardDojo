import {
  Button as MuiButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import React from 'react';

import { TRANSITIONS } from '@/theme';

import { SuccessIcon, ErrorIcon } from '../feedback/FeedbackAnimation';

import type {
  BaseComponentProps,
  DisableableProps,
  LoadableProps,
  ClickableProps,
  ThemeableProps,
} from './types';
import type {
  ButtonProps as MuiButtonProps } from '@mui/material';
import type { ReactNode ,FC } from 'react';

/**
 * Props for the enhanced Button component
 * @extends {BaseComponentProps} Base component properties
 * @extends {DisableableProps} Properties for disabled state
 * @extends {LoadableProps} Properties for loading state
 * @extends {ThemeableProps} Properties for theming
 */
export interface ButtonProps
  extends BaseComponentProps,
    DisableableProps,
    LoadableProps,
    Omit<ClickableProps, 'onClick'>,
    ThemeableProps,
    Omit<MuiButtonProps, 'color' | 'variant' | 'size'> {
  /** Text content of the button */
  children: ReactNode;
  /** Whether the button is in a success state */
  success?: boolean;
  /** Whether the button is in an error state */
  error?: boolean;
  /** Icon to show before the text */
  startIcon?: ReactNode;
  /** Icon to show after the text */
  endIcon?: ReactNode;
  /** Whether to show a loading spinner when loading */
  showSpinner?: boolean;
  /** Whether to maintain the button's width during loading */
  maintainWidth?: boolean;
}

/**
 * Enhanced Button component with loading, success, and error states
 *
 * @component
 * @example
 * ```tsx
 * <Button
 *   loading={isLoading}
 *   disabled={!isValid}
 *   color="primary"
 *   variant="contained"
 *   onClick={handleSubmit}
 * >
 *   Submit
 * </Button>
 * ```
 */
export const Button: FC<ButtonProps> = ({
  children,
  className,
  style,
  disabled,
  disabledTooltip,
  loading,
  loadingText,
  onClick,
  color = 'primary',
  variant = 'contained',
  size = 'medium',
  success,
  error,
  startIcon,
  endIcon,
  showSpinner = true,
  maintainWidth = true,
  ...props
}) => {
  // Calculate the effective disabled state
  const isDisabled = disabled || loading;

  // Handle click events
  const handleClick = (event: MouseEvent) => {
    if (!isDisabled && onClick) {
      onClick(event);
    }
  };

  // Determine the content to display
  const buttonContent = loading ? (
    <>
      {showSpinner && (
        <CircularProgress
          size={size === 'small' ? 16 : 20}
          color="inherit"
          sx={{ mr: loadingText ? 1 : 0 }}
        />
      )}
      {loadingText || children}
    </>
  ) : (
    <>
      {success && <SuccessIcon size={size === 'small' ? 16 : 20} />}
      {error && <ErrorIcon size={size === 'small' ? 16 : 20} />}
      {!success && !error && startIcon}
      {children}
      {!success && !error && endIcon}
    </>
  );

  // Create the button element
  const buttonElement = (
    <MuiButton
      className={className}
      style={style}
      disabled={isDisabled}
      onClick={handleClick}
      color={color}
      variant={variant}
      size={size}
      sx={{
        position: 'relative',
        transition: TRANSITIONS.medium,
        ...(maintainWidth && {
          minWidth: loading ? '120px' : 'auto',
        }),
        ...(success && {
          backgroundColor: 'success.main',
          '&:hover': {
            backgroundColor: 'success.dark',
          },
        }),
        ...(error && {
          backgroundColor: 'error.main',
          '&:hover': {
            backgroundColor: 'error.dark',
          },
        }),
      }}
      {...props}
    >
      {buttonContent}
    </MuiButton>
  );

  // Wrap with tooltip if disabled and tooltip text provided
  return disabledTooltip && disabled ? (
    <Tooltip title={disabledTooltip}>{buttonElement}</Tooltip>
  ) : (
    buttonElement
  );
};

export default Button;
