import * as Sentry from '@sentry/react';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import ErrorFallback from './components/ui/ErrorFallback';
import { store } from './store';
import './styles.css';
import { initSentryRedux } from './utils/sentryRedux';

// Initialize Sentry
Sentry.init({
  dsn: 'https://7c6b065ef29904c8b0bf1576cd4209a0@o1131065.ingest.us.sentry.io/4508991947800576',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions, lower in production
  // Session Replay
  replaysSessionSampleRate: 0.1, // Sample rate for session replays (10%)
  replaysOnErrorSampleRate: 1.0, // Sample rate for replays when errors occur (100%)
  environment: process.env.NODE_ENV || 'development',
});

// Initialize Sentry Redux integration
initSentryRedux(store);

// Add error boundary for root level errors
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary 
        componentName="AppRoot" 
        fallback={(error, resetError) => (
          <ErrorFallback 
            error={error} 
            resetErrorBoundary={resetError} 
          />
        )}
        reportToSentry
      >
        <App />
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
);
