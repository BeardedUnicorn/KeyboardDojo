import { Snackbar, Alert, Slide } from '@mui/material';
import React, { createContext, useContext, useCallback, useState } from 'react';

import { TRANSITIONS } from '@/theme';

import type { AlertColor, SlideProps } from '@mui/material';
import type { FC, ReactNode } from 'react';

interface FeedbackContextType {
  showToast: (message: string, type?: AlertColor, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

interface FeedbackState {
  open: boolean;
  message: string;
  type: AlertColor;
  duration: number;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export const FeedbackProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FeedbackState>({
    open: false,
    message: '',
    type: 'info',
    duration: 4000,
  });

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const showToast = useCallback((
    message: string,
    type: AlertColor = 'info',
    duration: number = 4000,
  ) => {
    setState({
      open: true,
      message,
      type,
      duration,
    });
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={state.duration}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbar-root': {
            transition: TRANSITIONS.medium,
          },
        }}
      >
        <Alert
          onClose={handleClose}
          severity={state.type}
          variant="filled"
          elevation={6}
          sx={{
            minWidth: '280px',
            transition: TRANSITIONS.quick,
            '&:hover': {
              transform: 'translateY(-2px)',
            },
          }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
