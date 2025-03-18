/**
 * Error Boundary Component
 *
 * A React error boundary that catches errors in its child component tree
 * and logs them using the logger service.
 */

import { ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import React, { Component } from 'react';

import { loggerService, audioService } from '../services';

import type { FallbackRender } from '@sentry/react';
import type { ErrorInfo, ReactNode, ReactElement } from 'react';

interface Props {
  /**
   * The component's children
   */
  children: ReactNode;

  /**
   * Component name for logging
   */
  componentName?: string;

  /**
   * Whether to show the error UI
   * @default true
   */
  showErrorUI?: boolean;

  /**
   * Custom fallback component
   */
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);

  /**
   * Callback when an error is caught
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  _errorInfo: ErrorInfo | null;
}

interface FallbackProps {
  error: Error;
  resetError: () => void;
}

/**
 * Default fallback UI for the error boundary
 */
const DefaultFallback = ({ error, resetError }: FallbackProps): ReactElement => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      m: 2,
      borderRadius: 2,
      border: '1px solid #f44336',
      backgroundColor: 'rgba(244, 67, 54, 0.08)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <ErrorIcon color="error" sx={{ mr: 1, fontSize: 30 }} />
      <Typography variant="h6" color="error">
        Something went wrong
      </Typography>
    </Box>

    <Typography variant="body2" sx={{ mb: 2, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
      {error.message}
    </Typography>

    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => window.location.reload()}
      >
        Reload Page
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={resetError}
      >
        Try Again
      </Button>
    </Box>
  </Paper>
);

/**
 * Error boundary component that catches errors in its children
 * and logs them using the logger service
 */
class ErrorBoundaryComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      _errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      _errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { componentName, onError } = this.props;

    // Log the error
    loggerService.error(
      `Error caught by ErrorBoundary${componentName ? ` in ${componentName}` : ''}`,
      error,
      {
        component: componentName || 'ErrorBoundary',
        errorInfo: {
          componentStack: errorInfo.componentStack,
        },
      },
    );

    // Call the onError callback if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Play error sound
    audioService.playSound('error');

    this.setState({
      error,
      _errorInfo: errorInfo,
    });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      _errorInfo: null,
    });
  };

  render(): ReactNode {
    const { children, showErrorUI = true, fallback } = this.props;
    const { hasError, error, _errorInfo } = this.state;

    if (hasError && error && showErrorUI) {
      // Use custom fallback if provided
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error, this.resetError);
        }
        return fallback;
      }

      // Use default fallback
      return <DefaultFallback error={error} resetError={this.resetError} />;
    }

    return children;
  }
}

/**
 * Error boundary that integrates with Sentry and the logger service
 */
export const ErrorBoundary = (props: Props): ReactElement => {
  // Wrap our error boundary with Sentry's error boundary
  const sentryFallback: FallbackRender = ({ error, resetError }) => {
    if (props.showErrorUI === false) {
      return <>{props.children}</>;
    }

    if (props.fallback) {
      if (typeof props.fallback === 'function') {
        return <>{props.fallback(error as Error, resetError)}</>;
      }
      return <>{props.fallback}</>;
    }

    return <DefaultFallback error={error as Error} resetError={resetError} />;
  };

  return (
    <SentryErrorBoundary fallback={sentryFallback}>
      <ErrorBoundaryComponent {...props} />
    </SentryErrorBoundary>
  );
};

export default ErrorBoundary;
