import { ComponentProps, ElementType, useCallback } from "react";
import { useController, UseControllerProps } from "react-hook-form";
import { SemanticShorthandItem, LabelProps, Select } from "semantic-ui-react";
import { Override, Rename } from "../../../types/util";

export type SemanticInputWithControllerProps<T, K extends ElementType> = {
  inputAs: K;
} & Override<
  ComponentProps<K>,
  { error?: SemanticShorthandItem<LabelProps> | boolean }
> &
  Rename<UseControllerProps<T>, "control", "formControl">;

export const SemanticInputWithController = <T, K extends ElementType>(
  props: SemanticInputWithControllerProps<T, K>
) => {
  const {
    name,
    inputAs: Tag = Select,
    formControl: control,
    rules,
    error,
    ...others
  } = props;

  const {
    field: { value, onChange, onBlur },
  } = useController({
    control,
    name,
    rules,
  });

  const onChangeForSemanticUI = useCallback(
    (_, data) => onChange({ target: data }),
    [onChange]
  );

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Tag
      name={name}
      value={value ?? ""}
      onBlur={onBlur}
      onChange={onChangeForSemanticUI}
      error={error === undefined ? undefined : !!error}
      {...others}
    />
  );
};
