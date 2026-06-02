import type { ResponseData } from "@helper/types.helper.js";
import type { Response } from "express";


export class ApiResponse<TData extends ResponseData> {
  public message: string;
  public statusCode: number;
  public data?: TData;
  public constructor(message: string, statusCode: number, data?: TData) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }

  public ResponseSender(res: Response) {
    return res.status(this.statusCode).json({
      statusCode: this.statusCode,
      message: this.message,
      ...this.data,
    });
  }
}
