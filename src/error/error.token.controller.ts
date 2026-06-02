import type { ResponseData } from "@helper/types.helper.js";
import { ApiError } from "@utils/api.error.js";
import { BaseResponseClass } from "@utils/base.response.class.js";
import type { Response } from "express";


export class JSONWebTokenError<
  TObj extends ResponseData,
> extends BaseResponseClass<TObj, ApiError<TObj>> {
  constructor() {
    super(ApiError);
  } /**
   * Builds and handles the JSONWebTokenError response.
   *
   * @param {Response} res - The Express response object.
   * @param {TObj} data - Optional additional data to include in the response.
   * @returns {ApiError<TObj>} The created JWT error response.
   */
  public override handleResponse(res: Response, data?: TObj): ApiError<TObj> {
    const error = this.builderInstance
      .setStatus(400)
      .setMessage(
        "Current token was signed with different signature , try signing in again",
      )
      .setData(data as TObj)
      .build(res);
    return error as ApiError<TObj>;
  }
}
