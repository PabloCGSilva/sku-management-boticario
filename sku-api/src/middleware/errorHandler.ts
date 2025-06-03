// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    path: string;
    method: string;
    requestId?: string;
  };
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = req.headers['x-request-id'] as string || 'unknown';

  // Handle Zod validation errors specifically
  if (error instanceof ZodError) {
    const validationError = ValidationError.fromZodError(error);
    handleAppError(validationError, req, res, requestId);
    return;
  }

  // Handle our custom application errors
  if (error instanceof AppError) {
    handleAppError(error, req, res, requestId);
    return;
  }

  // Handle unexpected errors
  handleUnexpectedError(error, req, res, requestId);
};

function handleAppError(error: AppError, req: Request, res: Response, requestId: string) {
  // Log operational errors as warnings, others as errors
  const logLevel = error.statusCode < 500 ? 'warn' : 'error';

  logger[logLevel]('Operational error occurred', {
    error: error.message,
    code: error.errorCode,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
    requestId,
    context: error.context,
    stack: error.statusCode >= 500 ? error.stack : undefined
  });

  const response: ErrorResponse = {
    success: false,
    error: {
      code: error.errorCode,
      message: error.message,
      details: error.context
    },
    meta: {
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      requestId
    }
  };

  res.status(error.statusCode).json(response);
}

function handleUnexpectedError(error: Error, req: Request, res: Response, requestId: string) {
  // Log unexpected errors with full context
  logger.error('Unexpected error occurred', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    requestId,
    body: req.body
  });

  const response: ErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    },
    meta: {
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      requestId
    }
  };

  res.status(500).json(response);
}