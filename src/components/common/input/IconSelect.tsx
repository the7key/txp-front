import { useMemo } from "react";
import { StrictDropdownProps } from "semantic-ui-react";
import { IconName } from "../../../types/icon";
import { GridIconSelect } from "./GridIconSelect";

type Props = Omit<StrictDropdownProps, "options"> & {
  color?: string;
  icons: { icon: IconName; value: string }[];
};

export const IconSelect = (props: Props) => {
  const { color, icons, ...others } = props;

  const iconOptions = useMemo(
    () =>
      icons.map(({ value, icon }) => ({
        color,
        icon: icon,
        key: value,
        value,
      })),
    [color, icons]
  );

  return (
    <GridIconSelect iconOptions={iconOptions} iconSize="large" {...others} />
  );
};
