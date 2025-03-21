# Standardized Error Handling in Keyboard Dojo

This document outlines the standardized approach to error handling in the Keyboard Dojo application, with a focus on using the enhanced `ErrorBoundary` component.

## Overview

The application implements a unified error boundary system that:

1. Integrates with Sentry for error tracking
2. Provides consistent error UI across the application
3. Supports customization at both global and component levels
4. Includes proper logging to both the console and logging service

## Error Boundary Components

### ErrorBoundary Component

The primary component for catching and handling errors in React components.

```tsx
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

// Basic usage
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>

// With component name for better error reporting
<ErrorBoundary componentName="UserDashboard">
  <MyComponent />
</ErrorBoundary>

// With custom error handler
<ErrorBoundary 
  componentName="PaymentForm"
  onError={(error, errorInfo) => {
    // Custom error handling logic
    analytics.trackError('payment_form_error', { error: error.message });
  }}
>
  <PaymentForm />
</ErrorBoundary>
```

### withErrorBoundary HOC

A higher-order component for wrapping components with error boundaries.

```tsx
import { withErrorBoundary } from '../components/ui/ErrorBoundary';

// Wrap a component with an error boundary
const ProtectedUserProfile = withErrorBoundary(UserProfile, {
  componentName: 'UserProfile',
  onError: (error, errorInfo) => {
    // Custom error handling
  }
});

// Use the protected component
<ProtectedUserProfile userId={123} />
```

### ErrorBoundaryProvider

For application-wide error boundary configuration.

```tsx
import { ErrorBoundaryProvider, ErrorBoundary } from '../components/ui/ErrorBoundary';
import CustomErrorFallback from './CustomErrorFallback';

// In your app's root component
<ErrorBoundaryProvider 
  defaultFallback={CustomErrorFallback}
  showErrorUI={true}
  reportToSentry={process.env.NODE_ENV === 'production'}
  globalErrorHandler={(error, errorInfo, componentName) => {
    // Global error handling logic
    console.error(`Error in ${componentName}:`, error);
    analytics.trackError('react_error', { 
      component: componentName,
      error: error.message,
    });
  }}
>
  <App />
</ErrorBoundaryProvider>
```

## Best Practices

### When to Use Error Boundaries

1. **Component Boundaries**: Place error boundaries at logical component boundaries to isolate failures.
2. **Critical Flows**: Always wrap critical user flows (like payment processing) with error boundaries.
3. **Complex Components**: Components with complex state management or side effects should be wrapped.
4. **Third-Party Components**: Always wrap third-party components that might throw errors.

### Configuration Guidelines

1. Always provide a `componentName` for better error reporting.
2. Use the HOC pattern (`withErrorBoundary`) for components that are used in multiple places.
3. Customize the error UI only when necessary - the default fallback is designed to be user-friendly.
4. Use the context provider at the app root to set application-wide defaults.

## Error Handling Hierarchy

The application uses a hierarchical approach to error handling:

1. **Global Error Boundary**: At the application root, catches all unhandled errors.
2. **Feature-Level Error Boundaries**: Around major features or pages.
3. **Component-Level Error Boundaries**: Around complex components or third-party integrations.

## Sentry Integration

The error boundary system automatically integrates with Sentry when enabled. To disable Sentry for specific components:

```tsx
<ErrorBoundary reportToSentry={false}>
  <MyComponent />
</ErrorBoundary>
```

## Custom Error UI

To customize the error UI for a specific component:

```tsx
<ErrorBoundary
  fallback={(error, resetError) => (
    <div>
      <h3>Something went wrong in this part of the app</h3>
      <p>{error.message}</p>
      <button onClick={resetError}>Try Again</button>
    </div>
  )}
>
  <MyComponent />
</ErrorBoundary>
```

## Migration Guide

When migrating from direct Sentry ErrorBoundary usage to the standardized approach:

### Before:

```tsx
import { ErrorBoundary } from '@sentry/react';

<ErrorBoundary fallback={({ error }) => <ErrorFallback error={error} />}>
  <MyComponent />
</ErrorBoundary>
```

### After:

```tsx
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

<ErrorBoundary componentName="MyComponent">
  <MyComponent />
</ErrorBoundary>
```

## Testing Components with Error Boundaries

When writing tests for components wrapped with error boundaries:

```tsx
// In your test file
import { render, screen } from '@testing-library/react';
import { ErrorBoundaryProvider } from '../components/ui/ErrorBoundary';

// Wrap the component with a test error boundary provider
test('renders component', () => {
  render(
    <ErrorBoundaryProvider showErrorUI={false}>
      <MyComponent />
    </ErrorBoundaryProvider>
  );
  
  // Your test assertions
});
```

## Handling Nested Error Boundaries

When nesting error boundaries, only the closest error boundary will catch the error:

```tsx
<ErrorBoundary componentName="OuterComponent">
  <div>
    <ErrorBoundary componentName="InnerComponent">
      <ComponentThatMightError />
    </ErrorBoundary>
  </div>
</ErrorBoundary>
```

In this example, if `ComponentThatMightError` throws an error, only the "InnerComponent" error boundary will catch it. 