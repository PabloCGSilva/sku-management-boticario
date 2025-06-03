import { AppError } from './AppError';

export class NotFoundError extends AppError {
    readonly statusCode = 404;
    readonly errorCode = 'RESOURCE_NOT_FOUND';

    constructor(resource: string, identifier?: string, context?: Record<string, any>) {
        const message = identifier
            ? `${resource} with identifier '${identifier}' not found`
            : `${resource} not found`;
        super(message, context);
    }
}