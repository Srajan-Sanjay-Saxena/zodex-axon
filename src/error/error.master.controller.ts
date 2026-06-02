import type { Response, Request, NextFunction } from "express";
import { DuplicateError } from "@error/error.duplicate.controller.js";
import { ValidationError } from "@error/error.validation.controller.js";
import { JSONWebTokenError } from "@error/error.token.controller.js";
import { ApiError } from "@utils/api.error.js";
import type { ResponseData } from "@helper/types.helper.js";

export const sendDevError = <TObj extends ResponseData>(
  err: ApiError<TObj>,
  res: Response,
) => {
  if (res.headersSent) return;

  const statusCode = Number(err.statusCode) || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    status: statusCode,
    message,
    ...(err.data || {}),
    stack: err?.stack,
    cause: err?.cause,
  });
};

export const sendProdError = <TObj extends ResponseData>(
  err: ApiError<TObj>,
  res: Response,
) => {
  if (res.headersSent) return;

  const statusCode = Number(err.statusCode) || 500;
  const message = err.message || "Internal Server Error";

  if (err.isOperational) {
    return res.status(statusCode).json({
      status: statusCode,
      message,
      ...(err.data || {}),
    });
  }

  return res.status(500).json({
    status: 500,
    message: "Some internal error occurred",
    data: "",
  });
};

export const globalErrorHandler = <TObj extends ResponseData>(
  err: ApiError<TObj> | Error | any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.code === 11000) {
    err = new DuplicateError().handleResponse(res, {
      info: "Current data already exist , try creating different",
    }) as ApiError<TObj>;
  }
  if (err.name === "ValidationError") {
    err = new ValidationError().handleResponse(res, {
      info: "Provide some valid fields",
    }) as ApiError<TObj>;
  }
  if (err.name === "CastError") {
    err = new ValidationError().handleResponse(res, {
      info: "Unable to fetch the data",
    }) as ApiError<TObj>;
  }
  if (err.name === "JsonWebTokenError") {
    err = new JSONWebTokenError().handleResponse(res, {
      info: "Invalid token associated with user",
    }) as ApiError<TObj>;
  }
  if (process.env.NODE_ENV === "production") {
    return sendProdError<TObj>(err, res);
  }
  return sendDevError<TObj>(err, res);
};
