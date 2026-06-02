declare const brand: unique symbol;

type Brand<TBase, TBrand> = TBase & {
  [brand]: TBrand;
};

export type ValidDataBrand<TData> = Brand<TData, "ValidData">;

