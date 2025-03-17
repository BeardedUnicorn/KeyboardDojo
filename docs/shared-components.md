# Shared Components Documentation

This document provides guidance on using the shared components from the `@keyboard-dojo/shared` package in the frontend application.

## Overview

The `@keyboard-dojo/shared` package contains reusable components, hooks, utilities, and types that are shared between the web frontend and desktop applications. Using these shared components ensures consistency across platforms and reduces code duplication.

## Installation

The shared package is already included as a dependency in both the frontend and desktop packages. You can access it through the workspace setup:

```json
// package.json
{
  "dependencies": {
    "@keyboard-dojo/shared": "1.0.0"
  }
}
```

## Usage

### Importing Components

Import shared components directly from the package:

```tsx
import { Button, TextField, Card } from '@keyboard-dojo/shared/components';
```

### Importing Hooks

Import shared hooks:

```tsx
import { useKeyboardShortcuts, useLocalStorage } from '@keyboard-dojo/shared/hooks';
```

### Importing Utilities

Import shared utilities:

```tsx
import { isDesktop, runInEnvironment } from '@keyboard-dojo/shared/utils';
```

### Importing Types

Import shared types:

```tsx
import { UserProfile, PracticeSession } from '@keyboard-dojo/shared/types';
```

## Available Components

### UI Components

- `Button`: Standard button component with various styles
- `TextField`: Text input component
- `Card`: Container component with elevation
- `Typography`: Text component with various styles
- `Dialog`: Modal dialog component
- `Snackbar`: Toast notification component
- `Progress`: Progress indicator components (linear and circular)

### Layout Components

- `Container`: Responsive container component
- `Grid`: Grid layout component
- `Box`: Flexible box component for layout
- `Stack`: Vertical or horizontal stack component

### Form Components

- `Form`: Form container component
- `FormField`: Form field component with label and validation
- `Select`: Dropdown select component
- `Checkbox`: Checkbox component
- `RadioGroup`: Radio button group component
- `Switch`: Toggle switch component

## Available Hooks

- `useKeyboardShortcuts`: Hook for registering keyboard shortcuts
- `useLocalStorage`: Hook for using localStorage with automatic serialization
- `useMediaQuery`: Hook for responsive design
- `useTheme`: Hook for accessing the current theme
- `useAuth`: Hook for authentication state and methods
- `useOfflineStatus`: Hook for detecting online/offline status

## Available Utilities

- `environment.ts`: Utilities for detecting the current environment (web or desktop)
- `api.ts`: API client for making requests to the backend
- `storage.ts`: Storage utilities for persisting data
- `secureStorage.ts`: Secure storage utilities for sensitive data
- `keyboardUtils.ts`: Utilities for working with keyboard events
- `dataMigration.ts`: Utilities for migrating data between versions
- `syncService.ts`: Service for synchronizing data between local and remote

## Environment-Aware Code

Use the environment utilities to write code that behaves differently in web and desktop environments:

```tsx
import { isDesktop, runInEnvironment } from '@keyboard-dojo/shared/utils';

// Check the current environment
if (isDesktop()) {
  // Desktop-specific code
} else {
  // Web-specific code
}

// Run different code based on environment
const result = runInEnvironment({
  desktop: () => {
    // Desktop-specific code
    return desktopResult;
  },
  web: () => {
    // Web-specific code
    return webResult;
  },
});
```

## Best Practices

1. **Always use shared components** when available instead of creating new ones
2. **Keep platform-specific code minimal** by using the environment utilities
3. **Contribute improvements back** to the shared package when fixing bugs or adding features
4. **Document any platform-specific behavior** in component props or comments
5. **Test components in both environments** to ensure consistent behavior

## Contributing to Shared Components

When adding or modifying shared components:

1. Update the component in the `shared` package
2. Build the shared package: `yarn workspace @keyboard-dojo/shared build`
3. Test the changes in both frontend and desktop applications
4. Update this documentation if necessary

## Troubleshooting

### Common Issues

- **Component not found**: Ensure you're importing from the correct path
- **Different behavior between platforms**: Check for environment-specific code
- **Build errors**: Ensure the shared package is built before using it

### Getting Help

If you encounter issues with shared components, contact the core development team or create an issue in the repository. 