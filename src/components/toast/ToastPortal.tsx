import { Portal } from "semantic-ui-react";
import { useToastValue } from "../../hooks/contexts/ToastContext";
import { ToastCard } from "./ToastCard";

export const ToastPortal = () => {
  const toasts = useToastValue();

  return (
    <Portal open={toasts.length > 0}>
      <div className={"ui toast-container bottom center"}>
        {toasts &&
          toasts.map((toast) => <ToastCard key={toast.id} toast={toast} />)}
      </div>
    </Portal>
  );
};
