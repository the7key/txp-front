import clsx from "clsx";
import { ComponentProps, ElementType } from "react";
import { Modal, StrictModalProps } from "semantic-ui-react";
import styles from "./ModalDialog.module.scss";

export type ModalDialogProps<T extends ElementType> = Omit<
  StrictModalProps,
  "as" | "onClose"
> & {
  as?: T;
  onClose?: () => void;
} & Omit<ComponentProps<T>, keyof StrictModalProps | "as">;

export const ModalDialog = <T extends ElementType>(
  props: ModalDialogProps<T>
) => {
  const { centered, closeOnDimmerClick, className, ...others } = props;

  return (
    <Modal
      className={clsx(styles.root, className)}
      closeOnDimmerClick={closeOnDimmerClick ?? false}
      centered={centered ?? true}
      {...others}
    />
  );
};
