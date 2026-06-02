import type { ResponseData } from "@helper/types.helper.js";

export class ApiError<TData extends ResponseData> extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public data?: TData;

  public constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    data?: TData,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.data = data;
  }
}
