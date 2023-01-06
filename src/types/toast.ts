import { IconName } from "./icon";

export type ToastType = "neutral" | "info" | "warning" | "error" | "success";

export type Toast = {
  icon?: IconName;
  id: string;
  message: string;
  type?: ToastType;
};
