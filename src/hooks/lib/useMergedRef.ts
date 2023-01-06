import { Ref, RefObject, useCallback } from "react";

type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};

export const useMergedRef = <T>(...refs: (Ref<T> | undefined)[]) => {
  const mergedRef = useCallback(
    (value: T) => {
      for (const ref of refs) {
        if (ref === undefined) continue;

        if (typeof ref === "function") {
          ref(value);
        } else if (ref) {
          (ref as Mutable<RefObject<T>>).current = value;
        }
      }
    },
    [refs]
  );

  return mergedRef;
};
