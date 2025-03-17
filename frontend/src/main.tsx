import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import AppTheme from './shared/theme/AppTheme'
import { store } from './store/store'
import { initSentry } from './utils/sentry'

// Initialize Sentry as early as possible
initSentry();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <ThemeProvider theme={AppTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </HelmetProvider>
    </Provider>
  </StrictMode>,
)
