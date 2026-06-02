import type { VerifiedRequest } from "../src/core/builder.core.js";
import type { ValidDataBrand } from "../src/helper/brand.helper.js";
import type { TypeSafeObject } from "../src/helper/types.helper.js";

// ============================================================
// Helper: assert a type is `never`
// ============================================================
type IsNever<T> = [T] extends [never] ? true : false;
type Expect<T extends true> = T;

// ============================================================
// 1. Empty config must resolve to `never`
// ============================================================
type EmptyConfig = VerifiedRequest<{}>;
type _EmptyIsNever = Expect<IsNever<EmptyConfig>>;

// ============================================================
// 2. Body only — has `validatedData`, no `body`
// ============================================================
type BodyOnly = VerifiedRequest<{ body: { name: string } }>;

const _bodyOnly = {} as BodyOnly;
const _name: string = _bodyOnly.validatedData.name;

// @ts-expect-error — `body` is stripped
_bodyOnly.body;

// ============================================================
// 3. Params only — has `validatedParams`, no `params`
// ============================================================
type ParamsOnly = VerifiedRequest<{ params: { id: string } }>;

const _paramsOnly = {} as ParamsOnly;
const _id: string = _paramsOnly.validatedParams.id;

// @ts-expect-error — `params` is stripped
_paramsOnly.params;

// ============================================================
// 4. Query only — has `validatedQuery`, no `query`
// ============================================================
type QueryOnly = VerifiedRequest<{ query: { page: number } }>;

const _queryOnly = {} as QueryOnly;
const _page: number = _queryOnly.validatedQuery.page;

// @ts-expect-error — `query` is stripped
_queryOnly.query;

// ============================================================
// 5. Body + Params — both validated, both raw stripped
// ============================================================
type BodyAndParams = VerifiedRequest<{
  body: { email: string };
  params: { id: string };
}>;

const _bp = {} as BodyAndParams;
const _email: string = _bp.validatedData.email;
const _bpId: string = _bp.validatedParams.id;

// @ts-expect-error — body stripped
_bp.body;

// @ts-expect-error — params stripped
_bp.params;

// ============================================================
// 6. All three — body + params + query
// ============================================================
type AllThree = VerifiedRequest<{
  body: { name: string };
  params: { id: string };
  query: { page: number };
}>;

const _all = {} as AllThree;
const _allName: string = _all.validatedData.name;
const _allId: string = _all.validatedParams.id;
const _allPage: number = _all.validatedQuery.page;

// @ts-expect-error
_all.body;
// @ts-expect-error
_all.params;
// @ts-expect-error
_all.query;

// ============================================================
// 7. ValidDataBrand is not assignable from plain object
// ============================================================
type Branded = ValidDataBrand<{ name: string }>;

// @ts-expect-error — plain object can't be assigned to branded type
const _notBranded: Branded = { name: "test" };

// ============================================================
// 8. TypeSafeObject discriminated union
// ============================================================
import { z } from "zod";

type TestSchema = z.ZodObject<{ name: z.ZodString }>;
declare const result: TypeSafeObject<TestSchema>;

if (result.success) {
  const _data: string = result.data.name;
  // @ts-expect-error — error is null on success
  result.error.message;
} else {
  // @ts-expect-error — data is null on failure
  result.data.name;
  const _msg: string = result.error.message;
}

