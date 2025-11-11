import {
  AppErrorCodeMap,
  AppErrorMessages,
  ErrorMessages,
  HttpStatusCode,
} from '@/types/error.types.js';

// Erros de negócio da aplicação
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;

    // Mantém o stack trace correto
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createAppError = (
  messageKey: keyof typeof AppErrorMessages,
  customMessage?: string,
): AppError => {
  const statusCode = AppErrorCodeMap[messageKey];
  const message = customMessage || AppErrorMessages[messageKey];
  return new AppError(message, statusCode);
};

export const createHttpError = (
  statusCode: HttpStatusCode,
  customMessage?: string,
): AppError => {
  const message = customMessage || ErrorMessages[statusCode];
  return new AppError(message, statusCode);
};
