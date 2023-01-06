// eslint-disable-next-line @typescript-eslint/ban-types
type ObjectType = object;

/**
 * T のプロパティ K の名前を N に変更する
 */
export type Rename<
  T extends ObjectType,
  K extends keyof T,
  N extends PropertyKey
> = Omit<T, K> & {
  [P in N]: T[K];
};

/**
 * T のプロパティ K を optional にする
 */
export type PartiallyPartial<T extends ObjectType, K extends keyof T> = Omit<
  T,
  K
> &
  Partial<Pick<T, K>>;

/**
 * T のプロパティ を U のプロパティで上書きする
 */
export type Override<T extends ObjectType, U extends ObjectType> = Omit<
  T,
  keyof U
> &
  U;

/**
 * 再帰的にPartialを適用する
 */
export type NestedPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer R>
    ? Array<NestedPartial<R>>
    : NestedPartial<T[K]>;
};
