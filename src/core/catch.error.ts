import type { NextFunction, Request, Response } from "express";
import type { VerifiedRequest, VerifiedRequestConfig } from "./builder.core.js";

export type BaseRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export function catchAsync<TConfig extends VerifiedRequestConfig>(
  fn: (
    req: VerifiedRequest<TConfig>,
    res: Response,
    next: NextFunction,
  ) => Promise<void>,
): BaseRequestHandler;

export function catchAsync(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): BaseRequestHandler;

export function catchAsync(fn: any) {
  return (req: any, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
}
