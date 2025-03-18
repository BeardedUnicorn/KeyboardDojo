import type { IAppError } from '@/types/IAppError';
import type { IAppNotification } from '@store/slices';

export interface IAppState {
  isInitialized: boolean;
  isLoading: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  updateVersion: string | null;
  errors: IAppError[];
  notifications: IAppNotification[];
  currentModal: string | null;
  modalData: Record<string, unknown> | null;
}
