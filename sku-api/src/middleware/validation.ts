import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest = (schema: {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
}) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schema.body) {
                req.body = schema.body.parse(req.body);
            }

            if (schema.params) {
                req.params = schema.params.parse(req.params);
            }

            if (schema.query) {
                req.query = schema.query.parse(req.query);
            }

            next();
        } catch (error) {
            next(error); // Let error handler deal with ZodError
        }
    };
};