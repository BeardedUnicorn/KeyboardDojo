/**
 * Error Boundary Component
 *
 * A unified error boundary system that integrates with Sentry and the logger service.
 * This provides a standardized approach to error handling across the application.
 */

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import React, { Component, createContext, useContext } from 'react';

import { loggerService } from '../../services';

import type { FallbackRender } from '@sentry/react';
import type { ErrorInfo, ReactNode, ReactElement, ComponentType } from 'react';

// Error boundary context for application-wide configuration
interface ErrorBoundaryContextType {
  /**
   * Default fallback component
   */
  defaultFallback?: ComponentType<FallbackProps>;
  
  /**
   * Whether to show error UI by default
   */
  showErrorUI?: boolean;
  
  /**
   * Whether to log to Sentry
   */
  reportToSentry?: boolean;
  
  /**
   * Global error handler
   */
  globalErrorHandler?: (error: Error, errorInfo: ErrorInfo, componentName?: string) => void;
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextType>({
  showErrorUI: true,
  reportToSentry: true,
});

/**
 * Provider for application-wide error boundary configuration
 */
export const ErrorBoundaryProvider: React.FC<ErrorBoundaryContextType & { children: ReactNode }> = ({
  children,
  defaultFallback,
  showErrorUI = true,
  reportToSentry = true,
  globalErrorHandler,
}) => {
  return (
    <ErrorBoundaryContext.Provider 
      value={{
        defaultFallback,
        showErrorUI,
        reportToSentry,
        globalErrorHandler,
      }}
    >
      {children}
    </ErrorBoundaryContext.Provider>
  );
};

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
   * @default true (from context)
   */
  showErrorUI?: boolean;

  /**
   * Whether to report errors to Sentry
   * @default true (from context)
   */
  reportToSentry?: boolean;

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
}

export interface FallbackProps {
  error: Error;
  resetError: () => void;
  componentName?: string;
}

/**
 * Default fallback UI for the error boundary
 */
const DefaultFallback = ({ error, resetError, componentName }: FallbackProps): ReactElement => (
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
      <ErrorOutlineIcon color="error" sx={{ mr: 1, fontSize: 30 }} />
      <Typography variant="h6" color="error">
        Something went wrong{componentName ? ` in ${componentName}` : ''}
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
  static contextType = ErrorBoundaryContext;
  declare context: React.ContextType<typeof ErrorBoundaryContext>;
  
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { componentName, onError } = this.props;
    const { globalErrorHandler } = this.context;

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

    // Call the global error handler if provided
    if (globalErrorHandler) {
      globalErrorHandler(error, errorInfo, componentName);
    }

    // Call the component-specific onError callback if provided
    if (onError) {
      onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    const { children, showErrorUI: propsShowErrorUI, fallback, componentName } = this.props;
    const { defaultFallback: ContextFallback, showErrorUI: contextShowErrorUI } = this.context;
    const { hasError, error } = this.state;
    
    // Determine whether to show error UI (component prop takes precedence over context)
    const shouldShowErrorUI = propsShowErrorUI !== undefined ? propsShowErrorUI : contextShowErrorUI;

    if (hasError && error && shouldShowErrorUI) {
      // Use custom fallback if provided in props
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error, this.resetError);
        }
        return fallback;
      }
      
      // Use context fallback if provided
      if (ContextFallback) {
        return <ContextFallback error={error} resetError={this.resetError} componentName={componentName} />;
      }

      // Use default fallback
      return <DefaultFallback error={error} resetError={this.resetError} componentName={componentName} />;
    }

    return children;
  }
}

/**
 * Unified error boundary that integrates with Sentry and the logger service
 */
export const ErrorBoundary = (props: Props): ReactElement => {
  const context = useContext(ErrorBoundaryContext);
  
  // Determine whether to report to Sentry (component prop takes precedence over context)
  const reportToSentry = props.reportToSentry !== undefined ? props.reportToSentry : context.reportToSentry;

  // Wrap our error boundary with Sentry's error boundary if reporting to Sentry is enabled
  if (reportToSentry) {
    const sentryFallback: FallbackRender = ({ error, resetError }) => {
      return <ErrorBoundaryComponent {...props} />;
    };

    return (
      <SentryErrorBoundary fallback={sentryFallback}>
        <ErrorBoundaryComponent {...props} />
      </SentryErrorBoundary>
    );
  }
  
  // Otherwise, just use our error boundary
  return <ErrorBoundaryComponent {...props} />;
};

/**
 * Higher-order component that wraps a component with an error boundary
 * 
 * @example
 * const ProtectedComponent = withErrorBoundary(MyComponent, {
 *   componentName: 'MyComponent'
 * });
 */
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  errorBoundaryProps: Omit<Props, 'children'> = {},
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ErrorBoundary {...errorBoundaryProps} componentName={errorBoundaryProps.componentName || displayName}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  
  return WrappedComponent;
}

export default ErrorBoundary;
