// Define types
export interface IAppError {
  id: string;
  message: string;
  code?: string;
  timestamp: number;
  context?: Record<string, unknown>;
}
