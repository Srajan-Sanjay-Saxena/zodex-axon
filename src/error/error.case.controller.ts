import type { Response } from "express";
import { ApiError } from "@utils/api.error.js";
import { BaseResponseClass } from "@utils/base.response.class.js";
import type { ResponseData } from "@helper/types.helper.js";

/**
 * Handles generic case errors (HTTP 500).
 * This class builds a CaseError response and sends it to the client.
 */
export class CaseError<TObj extends ResponseData> extends BaseResponseClass<
  TObj,
  ApiError<TObj>
> {
  constructor() {
    super(ApiError);
  }

  /**
   * Builds and handles the CaseError response.
   *
   * @param {Response} res - The Express response object.
   * @param {TObj} data - Optional additional data to include in the response.
   * @returns {ApiError<TObj>} The created case error response.
   */
  public override handleResponse(res: Response, data?: TObj) {
    return this.builderInstance
      .setStatus(500)
      .setMessage("Sorry some internal error occurred , failed to fetch !")
      .setData(data as TObj)
      .build(res) as ApiError<TObj>;
  }
}
