import { forwardRef, HTMLProps, Ref } from "react";
import { useMergedRef } from "../../../hooks/lib/useMergedRef";

type Props = HTMLProps<HTMLInputElement> & {
  inputRef?: Ref<HTMLInputElement>;
};

export const FileInputForUseForm = forwardRef<HTMLInputElement, Props>(
  function FileInputForUseForm(props, ref) {
    const { inputRef, ...others } = props;

    const mergedRef = useMergedRef(inputRef, ref);

    return <input ref={mergedRef} {...others} />;
  }
);
