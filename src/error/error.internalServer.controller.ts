import type { Response } from "express";
import { ApiError } from "@utils/api.error.js";
import { BaseResponseClass } from "@utils/base.response.class.js";
import type { ResponseData } from "@helper/types.helper.js";

/**
 * Handles Internal Server errors (HTTP 500).
 * This class builds an Internal Server error response and sends it to the client.
 */
export class InternalServerError<
  TObj extends ResponseData,
> extends BaseResponseClass<TObj, ApiError<TObj>> {
  constructor() {
    super(ApiError);
  }

  /**
   * Builds and handles the Internal Server error response.
   *
   * @param {Response} res - The Express response object.
   * @param {TObj} data - Optional additional data to include in the response.
   * @returns {ApiError<TObj>} The created error response.
   */
  public override handleResponse(res: Response, data?: TObj) {
    return this.builderInstance
      .setStatus(500)
      .setMessage("Some server error occurred.")
      .setData(data as TObj)
      .build(res) as ApiError<TObj>;
  }
}
