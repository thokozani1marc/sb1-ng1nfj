import { AuthApiError } from '@supabase/supabase-js';

export class AuthError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'AuthError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    if (error.originalError instanceof AuthApiError) {
      switch (error.originalError.status) {
        case 400:
          return 'Invalid email or password';
        case 422:
          if (error.originalError.message.includes('already exists')) {
            return 'An account with this email already exists. Please sign in instead.';
          }
          return 'Invalid information provided';
        case 429:
          return 'Too many attempts. Please try again later';
        default:
          return error.message;
      }
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export function isUserExistsError(error: unknown): boolean {
  return (
    error instanceof AuthError &&
    error.originalError instanceof AuthApiError &&
    error.originalError.status === 422 &&
    error.originalError.message.includes('already exists')
  );
}