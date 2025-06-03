import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { z } from 'zod';

export interface TypedRequest<
  TBody extends z.ZodTypeAny = z.ZodObject<any>,
  TParams extends ParamsDictionary = ParamsDictionary,
  TQuery extends z.ZodTypeAny = z.ZodObject<any>
> extends Omit<Request, 'body' | 'params' | 'query'> {
  body: z.infer<TBody>;
  params: TParams & ParamsDictionary;
  query: z.infer<TQuery>;
}
