import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { loggerService } from '@services/loggerService';

import type { RootState } from '@/store';
import type { IAppError } from '@/types/IAppError';
import type { IAppNotification } from '@/types/IAppNotification';
import type { IAppState } from '@/types/IAppState';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define initial state
const initialState: IAppState = {
  isInitialized: false,
  isLoading: false,
  isOnline: true,
  isUpdateAvailable: false,
  updateVersion: null,
  errors: [],
  notifications: [],
  currentModal: null,
  modalData: null,
};

// Create async thunks
export const initializeApp = createAsyncThunk(
  'app/initializeApp',
  async (_, { rejectWithValue }) => {
    let success = false;
    let result = null;
    let partialInitialization = false;
    let serviceError = null;
    
    try {
      // Import the initializeAllServices function dynamically to avoid circular imports
      const { initializeAllServices } = await import('@services/initializeServices');
      
      try {
        // Initialize all services
        await initializeAllServices();
        
        result = { success: true };
        success = true;
      } catch (serviceInitError) {
        // Log the service initialization error but still allow the app to continue
        loggerService.error('Error initializing services', serviceInitError, {
          component: 'AppSlice',
          action: 'initializeApp',
          recoverable: true,
        });
        
        // We'll still consider the app initialized since services may not be available in some environments
        partialInitialization = true;
        serviceError = serviceInitError instanceof Error ? serviceInitError.message : String(serviceInitError);
        
        result = { 
          success: true, 
          partialInitialization,
          serviceError,
        };
        success = true;
      }
    } catch (error) {
      loggerService.error('Critical error initializing app', error, {
        component: 'AppSlice',
        action: 'initializeApp',
        recoverable: false,
      });
      return rejectWithValue('Failed to initialize app: ' + (error instanceof Error ? error.message : String(error)));
    }
    
    if (success) {
      if (partialInitialization) {
        // Add a notification for users about partial initialization
        setTimeout(() => {
          loggerService.warn('Adding notification about partial initialization', {
            component: 'AppSlice',
            action: 'initializeApp',
            serviceError,
          });
        }, 1000);
      }
      return result;
    } else {
      return rejectWithValue('Failed to initialize app');
    }
  },
);

export const checkForUpdates = createAsyncThunk(
  'app/checkForUpdates',
  async (_, { rejectWithValue }) => {
    let success = false;
    let result = null;
    
    try {
      // This would typically call an update service to check for updates
      // For now, we'll simulate by returning a mock response
      result = {
        isUpdateAvailable: false,
        updateVersion: null,
      };
      success = true;
    } catch (error) {
      loggerService.error('Error checking for updates', error);
    }
    
    if (success) {
      return result;
    } else {
      return rejectWithValue('Failed to check for updates');
    }
  },
);

// Create the slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    addError: (state, action: PayloadAction<Omit<IAppError, 'id' | 'timestamp'>>) => {
      const newError: IAppError = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        ...action.payload,
      };
      state.errors.push(newError);
    },
    clearErrors: (state) => {
      state.errors = [];
    },
    addNotification: (state, action: PayloadAction<Omit<IAppNotification, 'id' | 'timestamp' | 'isRead'>>) => {
      const newNotification: IAppNotification = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        isRead: false,
        ...action.payload,
      };
      state.notifications.push(newNotification);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<{ modalId: string; data?: Record<string, unknown> }>) => {
      state.currentModal = action.payload.modalId;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.currentModal = null;
      state.modalData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize app
      .addCase(initializeApp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeApp.fulfilled, (state) => {
        state.isInitialized = true;
        state.isLoading = false;
      })
      .addCase(initializeApp.rejected, (state, action) => {
        state.isInitialized = false;
        state.isLoading = false;
        state.errors.push({
          id: Date.now().toString(),
          message: action.payload as string || 'Failed to initialize app',
          timestamp: Date.now(),
        });
      })

      // Check for updates
      .addCase(checkForUpdates.fulfilled, (state, action) => {
        state.isUpdateAvailable = action.payload.isUpdateAvailable;
        state.updateVersion = action.payload.updateVersion;
      });
  },
});

// Export actions
export const {
  setLoading,
  setOnlineStatus,
  addError,
  clearErrors,
  addNotification,
  markNotificationAsRead,
  clearNotifications,
  openModal,
  closeModal,
} = appSlice.actions;

// Export selectors
export const selectApp = (state: RootState) => state.app;
export const selectIsInitialized = (state: RootState) => state.app.isInitialized;
export const selectIsLoading = (state: RootState) => state.app.isLoading;
export const selectIsOnline = (state: RootState) => state.app.isOnline;
export const selectIsUpdateAvailable = (state: RootState) => state.app.isUpdateAvailable;
export const selectUpdateVersion = (state: RootState) => state.app.updateVersion;
export const selectErrors = (state: RootState) => state.app.errors;
export const selectNotifications = (state: RootState) => state.app.notifications;
export const selectUnreadNotifications = (state: RootState) =>
  state.app.notifications.filter((notification) => !notification.isRead);
export const selectCurrentModal = (state: RootState) => state.app.currentModal;
export const selectModalData = (state: RootState) => state.app.modalData;

// Export reducer
export default appSlice.reducer;
