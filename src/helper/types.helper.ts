import type { ValidationError } from "zod-validation-error";
import type { ValidDataBrand } from "./brand.helper.js";
import { z } from "zod";

export type TypeSafeObject<TSchema> =
  | {
      success: true;
      data: ValidDataBrand<z.infer<TSchema>>;
      error: null;
    }
  | {
      success: false;
      data: null;
      error: ValidationError;
    };

export type ResponseData = {
  info: any;
  [key: string]: any;
};
