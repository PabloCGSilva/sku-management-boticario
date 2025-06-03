import { AppError } from './AppError';

export class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly errorCode = 'VALIDATION_ERROR'; // Make sure this matches the abstract property

  constructor(
    message: string,
    public readonly field?: string,
    context?: Record<string, any>
  ) {
    super(message, context);
  }

  static fromZodError(error: any, field?: string): ValidationError {
    const details = error.errors?.map((err: any) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    })) || [];

    return new ValidationError(
      `Validation failed: ${error.errors?.[0]?.message || 'Invalid input'}`,
      field,
      { details, totalErrors: details.length }
    );
  }
}