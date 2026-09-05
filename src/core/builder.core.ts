import type { ValidDataBrand } from "@helper/brand.helper.js";
import type { Request } from "express";

interface VerifiedRequestConfig {
  readonly body?: Record<string, any>;
  readonly params?: Record<string, any>;
  readonly query?: Record<string, any>;
}

type RequireAtLeastOne<TSchema extends VerifiedRequestConfig> =
  TSchema["body"] extends Record<string, any>
    ? TSchema & { body: TSchema["body"] }
    : TSchema["params"] extends Record<string, any>
      ? TSchema & { params: TSchema["params"] }
      : TSchema["query"] extends Record<string, any>
        ? TSchema & { query: TSchema["query"] }
        : never;

type StrippedKeys<TConfig extends VerifiedRequestConfig> =
  | (TConfig["body"] extends Record<string, any> ? "body" : never)
  | (TConfig["params"] extends Record<string, any> ? "params" : never)
  | (TConfig["query"] extends Record<string, any> ? "query" : never);

type VerifiedRequest<
  TConfig extends VerifiedRequestConfig,
  U extends Request = Request,
> =
  RequireAtLeastOne<TConfig> extends never
    ? never
    : Omit<U, StrippedKeys<TConfig>> &
        (TConfig["body"] extends Record<string, any>
          ? { validatedData: ValidDataBrand<TConfig["body"]> }
          : {}) &
        (TConfig["params"] extends Record<string, any>
          ? { validatedParams: ValidDataBrand<TConfig["params"]> }
          : {}) &
        (TConfig["query"] extends Record<string, any>
          ? { validatedQuery: ValidDataBrand<TConfig["query"]> }
          : {});

export type { VerifiedRequest, VerifiedRequestConfig };
