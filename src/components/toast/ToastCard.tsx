import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { Icon } from "semantic-ui-react";
import { useCloseToast } from "../../hooks/contexts/ToastContext";
import { Toast } from "../../types/toast";

type Props = {
  toast: Toast;
};

export const ToastCard = (props: Props) => {
  const {
    toast: { message, id, type, icon },
  } = props;
  const closeToast = useCloseToast();

  const onClick = useCallback(() => {
    closeToast(id);
  }, [closeToast, id]);

  const typeClass = useMemo(() => type ?? "neutral", [type]);

  return (
    <div
      className={"floating toast-box compact transition visible"}
      onClick={onClick}
    >
      <div className={clsx("ui toast compact visible", typeClass)}>
        {icon && <Icon className={clsx(icon, "centered")} />}
        <div className="content">
          <div className="message">{message}</div>
        </div>
      </div>
    </div>
  );
};
