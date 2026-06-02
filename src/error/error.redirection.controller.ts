import type { Response } from "express";
import { ApiError } from "@utils/api.error.js";
import { BaseResponseClass } from "@utils/base.response.class.js";
import type { ResponseData } from "@helper/types.helper.js";

/**
 * Handles Redirection responses (HTTP 302).
 * This class builds a Redirection response and sends it to the client.
 */
export class RedirectionResponse<
  TObj extends ResponseData,
> extends BaseResponseClass<TObj, ApiError<TObj>> {
  constructor() {
    super(ApiError);
  }

  /**
   * Builds and handles the Redirection response.
   *
   * @param {Response} res - The Express response object.
   * @param {TObj} data - Optional additional data to include in the response.
   * @returns {ApiError<TObj>} The created redirection response.
   */
  public override handleResponse(res: Response, data?: TObj) {
    return this.builderInstance
      .setStatus(302)
      .setMessage("Redirection")
      .setData(data as TObj)
      .build(res) as ApiError<TObj>;
  }
}
