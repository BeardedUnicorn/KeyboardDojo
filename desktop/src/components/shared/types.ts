import type { CSSProperties } from 'react';

/**
 * Base props interface that most components will extend
 */
export interface BaseComponentProps {
  /** Optional CSS class name */
  className?: string;
  /** Optional inline style object */
  style?: CSSProperties;
  /** Optional ID attribute */
  id?: string;
  /** Optional aria-label for accessibility */
  'aria-label'?: string;
}

/**
 * Props for components that can be disabled
 */
export interface DisableableProps {
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Optional tooltip text to show when disabled */
  disabledTooltip?: string;
}

/**
 * Props for components that can show a loading state
 */
export interface LoadableProps {
  /** Whether the component is in a loading state */
  loading?: boolean;
  /** Optional text to show during loading */
  loadingText?: string;
}

/**
 * Props for components that can handle clicks
 */
export interface ClickableProps {
  /** Click handler function */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Whether the component is clickable */
  clickable?: boolean;
}

/**
 * Props for components that can show an error state
 */
export interface ErrorStateProps {
  /** Whether the component is in an error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Optional retry handler */
  onRetry?: () => void;
}

/**
 * Props for components that can be animated
 */
export interface AnimatableProps {
  /** Whether to animate the component */
  animate?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** CSS animation name */
  animationType?: string;
}

/**
 * Props for components that support keyboard interactions
 */
export interface KeyboardInteractiveProps {
  /** Keyboard shortcut */
  shortcut?: string;
  /** Keyboard event handler */
  onKeyPress?: (event: KeyboardEvent<HTMLElement>) => void;
  /** Whether the component can be focused */
  focusable?: boolean;
}

/**
 * Props for components that can show a success state
 */
export interface SuccessStateProps {
  /** Whether the component is in a success state */
  success?: boolean;
  /** Success message to display */
  successMessage?: string;
}

/**
 * Props for components that support theming
 */
export interface ThemeableProps {
  /** Optional color from theme palette */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  /** Optional variant */
  variant?: 'text' | 'outlined' | 'contained';
  /** Optional size */
  size?: 'small' | 'medium' | 'large';
}
