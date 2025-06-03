import { AppError } from './AppError';

export class DatabaseError extends AppError {
    readonly statusCode = 500;
    readonly errorCode = 'DATABASE_ERROR';

    constructor(operation: string, originalError?: Error, context?: Record<string, any>) {
        super(`Database operation failed: ${operation}`, {
            ...context,
            originalError: originalError?.message
        });
    }
}