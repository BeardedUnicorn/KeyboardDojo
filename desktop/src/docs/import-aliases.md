# Import Aliases

This document describes the import alias system used in the Keyboard Dojo desktop application.

## Overview

Import aliases provide a cleaner and more maintainable way to reference modules across the application. Instead of using relative paths (e.g., `../../components/Button`), we can use aliases (e.g., `@components/Button`).

## Available Aliases

The following import aliases are configured and available throughout the application:

| Alias | Path | Description |
|-------|------|-------------|
| `@` | `src/` | Root source directory |
| `@components` | `src/components/` | UI components |
| `@hooks` | `src/hooks/` | Custom React hooks |
| `@utils` | `src/utils/` | Utility functions |
| `@pages` | `src/pages/` | Page components |
| `@contexts` | `src/contexts/` | React context providers |
| `@services` | `src/services/` | Service modules |
| `@types` | `src/types/` | TypeScript type definitions |
| `@data` | `src/data/` | Data and constants |
| `@tests` | `src/tests/` | Test utilities and helpers |

## Usage Examples

```tsx
// Instead of this (relative import):
import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/dateUtils';

// Use this (aliased import):
import Button from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { formatDate } from '@utils/dateUtils';
```

## Benefits

- **Cleaner imports**: No more counting directory levels with `../../../`
- **Maintainability**: Moving files doesn't break imports as often
- **Readability**: Easier to understand where imports come from
- **Consistency**: Standardized import patterns across the codebase

## Configuration

The aliases are configured in the following files:

- `tsconfig.json`: TypeScript path mappings
- `vite.config`: Vite resolver aliases
- `vitest.config`: Test environment aliases

## Best Practices

1. Always use aliases for imports across different directories
2. Use relative imports only for files in the same directory
3. When creating new modules, consider which alias category they belong to
4. Keep imports organized and grouped by alias type 
