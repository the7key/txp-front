import { FieldValue, FieldValues } from "react-hook-form";
import { isNumber, isNumberString, isString } from "./is";

type Props = {
  max?: number | string;
  maxLength?: number | string;
  min?: number | string;
  minLength?: number | string;
  pattern?: RegExp;
  required?: boolean;
};

const isValidProp = <T>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null;
};

const isValidNumberProp = <T>(value: T | undefined | null): value is T => {
  return isValidProp(value) && (isNumber(value) || isNumberString(value));
};

const isEmpty = (value: unknown) => {
  return (
    value === undefined || value === null || (isString(value) && !value.length)
  );
};

const validate = <TFieldValues extends FieldValues = FieldValues>(
  value: TFieldValues,
  props: Props
) => {
  // min, max
  if (!isEmpty(value) && (isNumber(value) || isNumberString(value))) {
    const { max, min } = props;

    const errorMessage = (() => {
      if (isValidNumberProp(max) && isValidNumberProp(min))
        return `${min}以上${max}以下の値を入力してください`;
      if (isValidNumberProp(min)) return `${min}以上の値を入力してください`;
      if (isValidNumberProp(max)) return `${max}以下の値を入力してください`;
      return "";
    })();

    const isInvalidValue =
      (isValidNumberProp(min) && Number(value) < Number(min)) ||
      (isValidNumberProp(max) && Number(value) > Number(max));

    if (isInvalidValue) return errorMessage;
  }

  // minLength, maxLength
  if (!isEmpty(value) && isString(value)) {
    const { maxLength, minLength } = props;

    const errorMessage = (() => {
      if (isValidNumberProp(maxLength) && isValidNumberProp(minLength))
        return `${minLength}文字以上${maxLength}文字以内で入力してください`;
      if (isValidNumberProp(minLength))
        return `${minLength}文字以上で入力してください`;
      if (isValidNumberProp(maxLength))
        return `${maxLength}文字以内で入力してください`;
      return "";
    })();

    const isInvalidValue =
      (isValidNumberProp(minLength) && value.length < Number(minLength)) ||
      (isValidNumberProp(maxLength) && value.length > Number(maxLength));

    if (isInvalidValue) return errorMessage;
  }

  // pattern
  if (!isEmpty(value) && isString(value)) {
    const { pattern } = props;

    const errorMessage = "正しい値を入力してください";
    const isInvalidValue = pattern instanceof RegExp && !pattern.test(value);

    if (isInvalidValue) return errorMessage;
  }

  // required
  {
    const { required } = props;

    const errorMessage = "必須項目です";

    const isInvalidValue = required && isEmpty(value);

    if (isInvalidValue) return errorMessage;
  }

  return true;
};

export const validator = <TFieldValues extends FieldValues>(props: Props) => {
  return {
    custom: (value: FieldValue<TFieldValues>) => validate(value, props),
  };
};
