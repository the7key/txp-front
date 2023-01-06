import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { v4 as uuid } from "uuid";
import { Toast } from "../../types/toast";
import { PartiallyPartial } from "../../types/util";

type PushToastParam = PartiallyPartial<Toast, "id"> & {
  duration?: number;
};

type ToastState = Toast[];

type ToastDispatch = Dispatch<SetStateAction<ToastState>>;

const ToastStateContext = createContext<ToastState | null>(null);
const ToastDispatchContext = createContext<ToastDispatch | null>(null);

/**
 * トーストの機能を提供するProvider
 */
const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastState>([]);

  return (
    <ToastStateContext.Provider value={toasts}>
      <ToastDispatchContext.Provider value={setToasts}>
        {children}
      </ToastDispatchContext.Provider>
    </ToastStateContext.Provider>
  );
};

/**
 * 現在のトーストの配列と書き換え用の関数を返す
 */
const useToast = (): [ToastState, ToastDispatch] => {
  const toasts = useContext(ToastStateContext);
  const setToasts = useContext(ToastDispatchContext);
  if (toasts === null || setToasts === null) {
    throw new Error(
      "No context provided: useToast() can only be used within a ToastProvider"
    );
  }
  return [toasts, setToasts];
};

/**
 * 表示中のトーストの配列を返す
 */
const useToastValue = (): ToastState => {
  const toasts = useContext(ToastStateContext);
  if (toasts === null) {
    throw new Error(
      "No context provided: useToastValue() can only be used within a ToastProvider"
    );
  }
  return toasts;
};

type PushToast = (toast: PushToastParam) => Toast;

/**
 * トーストを追加する関数を返す
 */
const usePushToast = (): PushToast => {
  const setToasts = useContext(ToastDispatchContext);
  if (setToasts === null) {
    throw new Error(
      "No context provided: usePushToast() can only be used within a ToastProvider"
    );
  }

  const pushToast: PushToast = useCallback(
    (toast) => {
      const id = toast.id || uuid();
      const { icon, message, type, duration = 5000 } = toast;

      const newToast = { icon, id, message, type };

      setToasts((prev) => [...prev, newToast]);

      if (duration && duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, duration);
      }

      return newToast;
    },
    [setToasts]
  );

  return pushToast;
};

type CloseToast = (id: Toast["id"]) => void;

/**
 * idを指定してトーストを削除する関数を返す
 */
const useCloseToast = (): CloseToast => {
  const setToasts = useContext(ToastDispatchContext);
  if (setToasts === null) {
    throw new Error(
      "No context provided: useCloseToast() can only be used within a ToastProvider"
    );
  }

  const closeToast: CloseToast = useCallback(
    (id) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    },
    [setToasts]
  );

  return closeToast;
};

export { ToastProvider, useToast, useToastValue, usePushToast, useCloseToast };
