import type { Response } from 'express';
import type { ResponseData } from '@helper/types.helper.js';
import { ApiResponse } from '@utils/api.response.js';
import { BaseResponseClass } from '@utils/base.response.class.js';
import { ApiError } from '@utils/api.error.js';

/**
 * @class OkResponseStrategy
 * @description Handles the creation of a successful "OK" response, typically used for successful requests that return data.
 * @typeparam TObj - The type of data to be returned in the response.
 */
export class OkResponseStrategy<TObj extends ResponseData> extends BaseResponseClass<
  TObj,
  ApiResponse<TObj>
> {
  constructor() {
    super(ApiResponse);
  }

  /**
   * @description Handles the response by setting the status, message, and data.
   * @param res - The HTTP response object used to send back the response.
   * @param data - The data to be included in the response.
   * @returns - Sets the response with status 200 and the provided data.
   */
  public override handleResponse(
    res: Response,
    data?: TObj
  ): void | ApiError<TObj> {
    this.builderInstance
      .setStatus(200)
      .setMessage('OK Response')
      .setData(data as TObj)
      .build(res);
  }
}
