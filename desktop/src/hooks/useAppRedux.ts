import { useEffect, useCallback } from 'react';
import { shallowEqual } from 'react-redux';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  initializeApp,
  checkForUpdates,
  setLoading,
  setOnlineStatus,
  addError,
  clearErrors,
  addNotification,
  markNotificationAsRead,
  clearNotifications,
  openModal,
  closeModal,
  selectApp,
  selectIsInitialized,
  selectIsLoading,
  selectIsOnline,
  selectIsUpdateAvailable,
  selectUpdateVersion,
  selectErrors,
  selectNotifications,
  selectUnreadNotifications,
  selectCurrentModal,
  selectModalData,

} from '@slices/appSlice';

import type { IAppError } from '@/types/IAppError';
import type { IAppNotification } from '@/types/IAppNotification';

/**
 * Custom hook for managing app state and actions
 */
export const useAppRedux = () => {
  const dispatch = useAppDispatch();

  // Select app state with shallowEqual comparison to prevent unnecessary re-renders
  const app = useAppSelector(selectApp, shallowEqual);
  const isInitialized = useAppSelector(selectIsInitialized);
  const isLoading = useAppSelector(selectIsLoading);
  const isOnline = useAppSelector(selectIsOnline);
  const isUpdateAvailable = useAppSelector(selectIsUpdateAvailable);
  const updateVersion = useAppSelector(selectUpdateVersion);
  const errors = useAppSelector(selectErrors, shallowEqual);
  const notifications = useAppSelector(selectNotifications, shallowEqual);
  const unreadNotifications = useAppSelector(selectUnreadNotifications, shallowEqual);
  const currentModal = useAppSelector(selectCurrentModal);
  const modalData = useAppSelector(selectModalData, shallowEqual);

  // Initialize app on component mount - only if not already initialized
  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeApp());
    }
  }, [dispatch, isInitialized]);

  // Set up online/offline detection with proper cleanup
  useEffect(() => {
    const handleOnline = () => dispatch(setOnlineStatus(true));
    const handleOffline = () => dispatch(setOnlineStatus(false));

    // Set initial online status
    dispatch(setOnlineStatus(navigator.onLine));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  // App actions
  const initialize = useCallback(() => {
    if (!isInitialized) {
      dispatch(initializeApp());
    }
  }, [dispatch, isInitialized]);

  const checkUpdate = useCallback(() => {
    dispatch(checkForUpdates());
  }, [dispatch]);

  const setAppLoading = useCallback((loading: boolean) => {
    dispatch(setLoading(loading));
  }, [dispatch]);

  const reportError = useCallback((error: Omit<IAppError, 'id' | 'timestamp'>) => {
    dispatch(addError(error));
  }, [dispatch]);

  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const showNotification = useCallback((notification: Omit<IAppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    dispatch(addNotification(notification));
  }, [dispatch]);

  const markAsRead = useCallback((notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId));
  }, [dispatch]);

  const clearAllNotifications = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  const showModal = useCallback((modalId: string, data?: Record<string, unknown>) => {
    dispatch(openModal({ modalId, data }));
  }, [dispatch]);

  const hideModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  // Return state and actions
  return {
    // State
    app,
    isInitialized,
    isLoading,
    isOnline,
    isUpdateAvailable,
    updateVersion,
    errors,
    notifications,
    unreadNotifications,
    currentModal,
    modalData,

    // Actions
    initialize,
    checkUpdate,
    setAppLoading,
    reportError,
    clearAllErrors,
    showNotification,
    markAsRead,
    clearAllNotifications,
    showModal,
    hideModal,
  };
};

export default useAppRedux;
