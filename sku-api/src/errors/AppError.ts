export abstract class AppError extends Error {
    abstract readonly statusCode: number;
    abstract readonly errorCode: string;
    readonly isOperational = true;

    constructor(
        message: string,
        public readonly context?: Record<string, any>
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}