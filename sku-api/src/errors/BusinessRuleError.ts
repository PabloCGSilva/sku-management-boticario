import { AppError } from './AppError';

export class BusinessRuleError extends AppError {
    readonly statusCode = 422;
    readonly errorCode = 'BUSINESS_RULE_VIOLATION';

    constructor(
        message: string,
        public readonly rule: string,
        context?: Record<string, any>
    ) {
        super(message, context);
    }
}