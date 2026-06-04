import type { Response } from 'express';
import type { ResponseData } from '@helper/types.helper.js';
import { ApiResponse } from '@utils/api.response.js';
import { BaseResponseClass } from '@utils/base.response.class.js';
import { ApiError } from '@utils/api.error.js';

/**
 * @class CreateResponseStrategy
 * @description Handles the creation of a successful creation response, typically used when a resource is created successfully.
 * @typeparam TObj - The type of data to be returned in the response.
 */
export class CreateResponseStrategy<
  TObj extends ResponseData,
> extends BaseResponseClass<TObj, ApiResponse<TObj>> {
  constructor() {
    super(ApiResponse);
  }

  /**
   * @description Handles the response by setting the status, message, and data for a successful creation.
   * @param res - The HTTP response object used to send back the response.
   * @param data - The created data to be included in the response.
   * @returns - Sets the response with status 200 and the creation data.
   */
  public override handleResponse(
    res: Response,
    data: TObj
  ): void | ApiError<TObj> {
    this.builderInstance
      .setStatus(200)
      .setMessage('Request approved successfully')
      .setData(data)
      .build(res);
  }
}
