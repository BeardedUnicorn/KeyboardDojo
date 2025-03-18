export interface IAppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  title?: string;
  timestamp: number;
  autoHideDuration?: number;
  isRead: boolean;
}
