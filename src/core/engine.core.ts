import type { ValidDataBrand } from "@helper/brand.helper.js";
import type { TypeSafeObject } from "@helper/types.helper.js";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import { catchAsync, type BaseRequestHandler } from "./catch.error.js";
import type { Request, Response, NextFunction } from "express";
import { BadRequest } from "@error/error.badRequest.controller.js";
import type { VerifiedRequestConfig, VerifiedRequest } from "./builder.core.js";

export interface SchemaConfig<TConfig extends VerifiedRequestConfig> {
  body?: z.ZodType<TConfig["body"]>;
  params?: z.ZodType<TConfig["params"]>;
  query?: z.ZodType<TConfig["query"]>;
}

export function MakeObjectTypeSafeEngine<TSchema>(
  schema: z.ZodType<TSchema>,
  obj: unknown,
): TypeSafeObject<TSchema> {
  const result = schema.safeParse(obj);
  if (!result.success) {
    return {
      success: false,
      data: null,
      error: fromError(result.error),
    };
  }
  return {
    success: true,
    data: result.data as ValidDataBrand<z.infer<TSchema>>,
    error: null,
  };
}

export const RequestGuardMiddleware = <TConfig extends VerifiedRequestConfig>(
  schemas: SchemaConfig<TConfig>,
): BaseRequestHandler =>
  catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (schemas.body) {
        const result = MakeObjectTypeSafeEngine(schemas.body, req.body ?? {});
        if (!result.success) {
          return next(
            new BadRequest().handleResponse(res, {
              info: result.error?.message,
            }),
          );
        }
        (req as any).validatedData = result.data;
      }

      if (schemas.params) {
        const result = MakeObjectTypeSafeEngine(
          schemas.params,
          req.params ?? {},
        );
        if (!result.success) {
          return next(
            new BadRequest().handleResponse(res, {
              info: result.error?.message,
            }),
          );
        }
        (req as any).validatedParams = result.data;
      }

      if (schemas.query) {
        const result = MakeObjectTypeSafeEngine(schemas.query, req.query ?? {});
        if (!result.success) {
          return next(
            new BadRequest().handleResponse(res, {
              info: result.error?.message,
            }),
          );
        }
        (req as any).validatedQuery = result.data;
      }
      next();
    },
  );
