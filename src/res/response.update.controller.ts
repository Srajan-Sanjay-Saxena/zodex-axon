import type { Response } from 'express';
import type { ResponseData } from '@helper/types.helper.js';
import { ApiResponse } from '@utils/api.response.js';
import { BaseResponseClass } from '@utils/base.response.class.js';
import { ApiError } from '@utils/api.error.js';

/**
 * @class UpdateResponseStrategy
 * @description Handles the creation of a successful update response, typically used for successful update requests.
 * @typeparam TObj - The type of data to be returned in the response.
 */
export class UpdateResponseStrategy<
  TObj extends ResponseData,
> extends BaseResponseClass<TObj, ApiResponse<TObj>> {
  constructor() {
    super(ApiResponse);
  }

  /**
   * @description Handles the response by setting the status, message, and updated data.
   * @param res - The HTTP response object used to send back the response.
   * @param data - The updated data to be included in the response.
   * @returns - Sets the response with status 200 and the updated data.
   */
  public override handleResponse(
    res: Response,
    data: TObj
  ): void | ApiError<TObj> {
    this.builderInstance
      .setStatus(200)
      .setMessage('OK Response')
      .setData(data)
      .build(res);
  }
}
