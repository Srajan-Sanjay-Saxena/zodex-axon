import type { ResponseData } from "@helper/types.helper.js";
import { ApiBuilder } from "@utils/api.builder.js";
import { ApiError } from "@utils/api.error.js";
import { ApiResponse } from "@utils/api.response.js";
import type { Response } from "express";

interface Agreement<T extends ResponseData> {
  handleResponse: (res: Response, Data?: T) => void | Error;
}

export abstract class BaseResponseClass<
  TData extends ResponseData,
  TClass extends ApiResponse<TData> | ApiError<TData>,
> implements Agreement<TData> {
  protected builderInstance!: ApiBuilder<TClass, TData>;

  constructor(private ResponseClass: new (...args: Array<any>) => TClass) {
    this.builderInstance = new ApiBuilder<TClass, TData>(ResponseClass);
  }

  abstract handleResponse(res: Response, Data?: TData): void | ApiError<TData>;
}
