import { vi } from 'vitest';
import appReducer, {
  setLoading,
  setOnlineStatus,
  addError,
  clearErrors,
  addNotification,
  markNotificationAsRead,
  clearNotifications,
  openModal,
  closeModal,
  initializeApp,
  checkForUpdates,
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
} from '../appSlice';
import { RootState } from '../../index';

// Mock the loggerService
vi.mock('@services/loggerService', () => ({
  loggerService: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock the services initialization
vi.mock('@services/initializeServices', () => ({
  initializeAllServices: vi.fn().mockResolvedValue(undefined),
}));

// Define the initial state for tests
const initialState = {
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

describe('appSlice', () => {
  // State Tests
  describe('reducer', () => {
    test('should initialize with correct default state', () => {
      const state = appReducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });

    test('should set isLoading correctly', () => {
      const state = appReducer(initialState, setLoading(true));
      expect(state.isLoading).toBe(true);

      const updatedState = appReducer(state, setLoading(false));
      expect(updatedState.isLoading).toBe(false);
    });

    test('should set isOnline correctly', () => {
      const state = appReducer(initialState, setOnlineStatus(false));
      expect(state.isOnline).toBe(false);

      const updatedState = appReducer(state, setOnlineStatus(true));
      expect(updatedState.isOnline).toBe(true);
    });

    test('should handle error addition correctly', () => {
      const errorPayload = {
        message: 'Test error',
      };
      const state = appReducer(initialState, addError(errorPayload));
      
      expect(state.errors).toHaveLength(1);
      expect(state.errors[0].message).toBe('Test error');
      expect(state.errors[0].id).toBeDefined();
      expect(state.errors[0].timestamp).toBeDefined();
    });

    test('should handle error clearing correctly', () => {
      // First add an error
      const stateWithError = appReducer(
        initialState,
        addError({ message: 'Test error' })
      );
      expect(stateWithError.errors).toHaveLength(1);
      
      // Then clear errors
      const stateAfterClear = appReducer(stateWithError, clearErrors());
      expect(stateAfterClear.errors).toHaveLength(0);
    });

    test('should handle notification addition correctly', () => {
      const notificationPayload = {
        title: 'Test notification',
        message: 'This is a test notification',
        type: 'info' as const,
      };
      
      const state = appReducer(initialState, addNotification(notificationPayload));
      
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].title).toBe('Test notification');
      expect(state.notifications[0].message).toBe('This is a test notification');
      expect(state.notifications[0].type).toBe('info');
      expect(state.notifications[0].isRead).toBe(false);
      expect(state.notifications[0].id).toBeDefined();
      expect(state.notifications[0].timestamp).toBeDefined();
    });

    test('should mark a notification as read correctly', () => {
      // First add a notification
      const notificationPayload = {
        title: 'Test notification',
        message: 'This is a test notification',
        type: 'info' as const,
      };
      
      const stateWithNotification = appReducer(
        initialState,
        addNotification(notificationPayload)
      );
      
      const notificationId = stateWithNotification.notifications[0].id;
      
      // Then mark it as read
      const stateAfterRead = appReducer(
        stateWithNotification,
        markNotificationAsRead(notificationId)
      );
      
      expect(stateAfterRead.notifications[0].isRead).toBe(true);
    });

    test('should clear notifications correctly', () => {
      // First add a notification
      const stateWithNotification = appReducer(
        initialState,
        addNotification({
          title: 'Test notification',
          message: 'This is a test notification',
          type: 'info' as const,
        })
      );
      
      expect(stateWithNotification.notifications).toHaveLength(1);
      
      // Then clear notifications
      const stateAfterClear = appReducer(stateWithNotification, clearNotifications());
      expect(stateAfterClear.notifications).toHaveLength(0);
    });

    test('should handle modal open correctly', () => {
      const modalPayload = {
        modalId: 'test-modal',
        data: { testKey: 'testValue' },
      };
      
      const state = appReducer(initialState, openModal(modalPayload));
      
      expect(state.currentModal).toBe('test-modal');
      expect(state.modalData).toEqual({ testKey: 'testValue' });
    });

    test('should handle modal close correctly', () => {
      // First open a modal
      const stateWithModal = appReducer(
        initialState,
        openModal({ modalId: 'test-modal' })
      );
      
      expect(stateWithModal.currentModal).toBe('test-modal');
      
      // Then close it
      const stateAfterClose = appReducer(stateWithModal, closeModal());
      
      expect(stateAfterClose.currentModal).toBeNull();
      expect(stateAfterClose.modalData).toBeNull();
    });
  });

  // Thunk Tests
  describe('thunks', () => {
    test('initializeApp pending should set isLoading to true', () => {
      // Create a pending action
      const pendingAction = { type: `app/initializeApp/pending` };
      
      // Test the state after pending
      const pendingState = appReducer(initialState, pendingAction);
      expect(pendingState.isLoading).toBe(true);
    });

    test('initializeApp fulfilled should set isInitialized to true', () => {
      // Create a fulfilled action
      const fulfilledAction = { 
        type: `app/initializeApp/fulfilled`, 
        payload: { success: true } 
      };
      
      // Test the state after fulfilled
      const fulfilledState = appReducer(initialState, fulfilledAction);
      expect(fulfilledState.isInitialized).toBe(true);
      expect(fulfilledState.isLoading).toBe(false);
    });

    test('initializeApp rejected should add error', () => {
      // Create a rejected action
      const rejectedAction = { 
        type: `app/initializeApp/rejected`, 
        payload: 'Test error message' 
      };
      
      // Test the state after rejected
      const rejectedState = appReducer(initialState, rejectedAction);
      expect(rejectedState.isInitialized).toBe(false);
      expect(rejectedState.isLoading).toBe(false);
      expect(rejectedState.errors).toHaveLength(1);
      expect(rejectedState.errors[0].message).toBe('Test error message');
    });

    test('checkForUpdates should set update status correctly', () => {
      const updateData = {
        isUpdateAvailable: true,
        updateVersion: '1.1.0',
      };
      
      // Create a fulfilled action
      const fulfilledAction = { 
        type: `app/checkForUpdates/fulfilled`, 
        payload: updateData 
      };
      
      // Test the state after fulfilled
      const updatedState = appReducer(initialState, fulfilledAction);
      expect(updatedState.isUpdateAvailable).toBe(true);
      expect(updatedState.updateVersion).toBe('1.1.0');
    });
  });

  // Selector Tests
  describe('selectors', () => {
    const mockState = {
      app: {
        isInitialized: true,
        isLoading: false,
        isOnline: true,
        isUpdateAvailable: true,
        updateVersion: '1.1.0',
        errors: [{ id: '1', message: 'Test error', timestamp: Date.now() }],
        notifications: [
          { 
            id: '1', 
            title: 'Test notification', 
            message: 'Test message', 
            type: 'info', 
            isRead: false, 
            timestamp: Date.now() 
          }
        ],
        currentModal: 'test-modal',
        modalData: { testKey: 'testValue' },
      },
      // Add required slices with minimal mock data
      api: {} as any,
      userProgress: {} as any,
      theme: {} as any,
      achievements: {} as any,
      subscription: {} as any,
      settings: {} as any,
      curriculum: {} as any,
      gamification: {} as any,
      test: {} as any
    } as RootState;

    test('selectApp should return the app state', () => {
      expect(selectApp(mockState)).toBe(mockState.app);
    });

    test('selectIsInitialized should return initialization status', () => {
      expect(selectIsInitialized(mockState)).toBe(true);
    });

    test('selectIsLoading should return loading status', () => {
      expect(selectIsLoading(mockState)).toBe(false);
    });

    test('selectIsOnline should return online status', () => {
      expect(selectIsOnline(mockState)).toBe(true);
    });

    test('selectIsUpdateAvailable should return update availability', () => {
      expect(selectIsUpdateAvailable(mockState)).toBe(true);
    });

    test('selectUpdateVersion should return update version', () => {
      expect(selectUpdateVersion(mockState)).toBe('1.1.0');
    });

    test('selectErrors should return all errors', () => {
      expect(selectErrors(mockState)).toEqual(mockState.app.errors);
    });

    test('selectNotifications should return all notifications', () => {
      expect(selectNotifications(mockState)).toEqual(mockState.app.notifications);
    });

    test('selectUnreadNotifications should return only unread notifications', () => {
      const stateWithMixedNotifications = {
        ...mockState,
        app: {
          ...mockState.app,
          notifications: [
            { 
              id: '1', 
              title: 'Test 1', 
              message: 'Message 1', 
              type: 'info', 
              isRead: false, 
              timestamp: Date.now() 
            },
            { 
              id: '2', 
              title: 'Test 2', 
              message: 'Message 2', 
              type: 'info', 
              isRead: true, 
              timestamp: Date.now() 
            }
          ]
        }
      } as RootState;
      
      const unreadNotifications = selectUnreadNotifications(stateWithMixedNotifications);
      expect(unreadNotifications).toHaveLength(1);
      expect(unreadNotifications[0].id).toBe('1');
    });

    test('selectCurrentModal should return current modal ID', () => {
      expect(selectCurrentModal(mockState)).toBe('test-modal');
    });

    test('selectModalData should return modal data', () => {
      expect(selectModalData(mockState)).toEqual({ testKey: 'testValue' });
    });
  });
}); 