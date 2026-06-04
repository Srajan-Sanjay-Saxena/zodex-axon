import type { Response } from 'express';
import type { ResponseData } from '@helper/types.helper.js';
import { ApiResponse } from '@utils/api.response.js';
import { BaseResponseClass } from '@utils/base.response.class.js';
import { ApiError } from '@utils/api.error.js';

/**
 * @class DeleteResponseStrategy
 * @description Handles the creation of a successful delete response, typically used when a resource is successfully deleted.
 * @typeparam TObj - The type of data, though not typically needed for deletion.
 */
export class DeleteResponseStrategy<
  TObj extends ResponseData,
> extends BaseResponseClass<TObj, ApiResponse<TObj>> {
  constructor() {
    super(ApiResponse);
  }

  /**
   * @description Handles the response by setting the status and message for a successful deletion.
   * @param res - The HTTP response object used to send back the response.
   * @param data - Data is not typically required for a delete response.
   * @returns - Sets the response with status 204 (No Content) and a deletion message.
   */
  public override handleResponse(
    res: Response,
    data?: TObj
  ): void | ApiError<TObj> {
    this.builderInstance
      .setStatus(204)
      .setMessage('Deleted Successfully')
      .build(res);
  }
}
