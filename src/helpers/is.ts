export const isString = (arg: unknown): arg is string =>
  typeof arg === "string";

export const isBoolean = (arg: unknown): arg is boolean =>
  typeof arg === "boolean";

export const isNumber = (arg: unknown): arg is number =>
  typeof arg === "number";

export const isNumberString = (arg: unknown): boolean =>
  isString(arg) && /^\s*-?(\d+\.?|\d*\.\d+)\s*$/.test(arg);
