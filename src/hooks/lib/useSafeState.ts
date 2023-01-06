import { SetStateAction, useCallback, useState } from "react";
import { useUnmountRef } from "./useUnmountRef";

export const useSafeState = <T>(
  defaultValue: T
): [T, (v: SetStateAction<T>) => void] => {
  const unmountRef = useUnmountRef();
  const [state, setState] = useState<T>(defaultValue);
  const wrappedSetState = useCallback(
    (v: SetStateAction<T>) => {
      if (!unmountRef.current) {
        setState(v);
      }
    },
    [setState, unmountRef]
  );

  return [state, wrappedSetState];
};
