import { Request, Response, NextFunction } from 'express';
import { APP_MESSAGES, APP_STATUS_CODES } from '../../../constants';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || APP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || APP_MESSAGES.INTERNAL_SERVER_ERROR;

  console.error(`[ERROR] ${statusCode} - ${message}`, err);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(APP_STATUS_CODES.NOT_FOUND).json({
    success: false,
    error: {
      message: `${APP_MESSAGES.ROUTE_NOT_FOUND}: ${req.originalUrl}`
    }
  });
};

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
