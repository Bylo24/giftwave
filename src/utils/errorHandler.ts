
import { toast } from "sonner";

type ErrorType = 
  | 'AUTH'
  | 'UPLOAD'
  | 'NETWORK'
  | 'VALIDATION'
  | 'DATABASE'
  | 'UNKNOWN';

interface ErrorMetadata {
  code?: string;
  context?: Record<string, any>;
  retry?: () => Promise<any>;
}

export class AppError extends Error {
  type: ErrorType;
  metadata?: ErrorMetadata;

  constructor(message: string, type: ErrorType, metadata?: ErrorMetadata) {
    super(message);
    this.type = type;
    this.metadata = metadata;
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown, fallbackMessage: string = 'An error occurred') => {
  console.error('Error details:', error);

  if (error instanceof AppError) {
    switch (error.type) {
      case 'AUTH':
        toast.error(error.message, {
          description: 'Please try signing in again',
          action: {
            label: 'Sign In',
            onClick: () => window.location.href = '/login'
          }
        });
        break;

      case 'UPLOAD':
        toast.error(error.message, {
          description: error.metadata?.retry 
            ? 'Click to retry the upload'
            : 'Please try again with a smaller file',
          action: error.metadata?.retry ? {
            label: 'Retry',
            onClick: () => error.metadata?.retry?.()
          } : undefined
        });
        break;

      case 'NETWORK':
        toast.error('Network error', {
          description: 'Please check your internet connection',
          action: error.metadata?.retry ? {
            label: 'Retry',
            onClick: () => error.metadata?.retry?.()
          } : undefined
        });
        break;

      case 'VALIDATION':
        toast.error(error.message, {
          description: 'Please check your input and try again'
        });
        break;

      case 'DATABASE':
        toast.error('Database error', {
          description: 'Please try again later or contact support'
        });
        break;

      default:
        toast.error(error.message);
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error(fallbackMessage);
  }
};

export const createUploadError = (message: string, retryFn?: () => Promise<any>) => {
  return new AppError(message, 'UPLOAD', { retry: retryFn });
};

export const createAuthError = (message: string, code?: string) => {
  return new AppError(message, 'AUTH', { code });
};

export const createNetworkError = (message: string, retryFn?: () => Promise<any>) => {
  return new AppError(message, 'NETWORK', { retry: retryFn });
};

export const createValidationError = (message: string, context?: Record<string, any>) => {
  return new AppError(message, 'VALIDATION', { context });
};

export const createDatabaseError = (message: string, context?: Record<string, any>) => {
  return new AppError(message, 'DATABASE', { context });
};
