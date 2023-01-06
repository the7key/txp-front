import { useMemo } from "react";
import { StrictDropdownProps } from "semantic-ui-react";
import { IconName } from "../../../types/icon";
import { GridIconSelect } from "./GridIconSelect";

type Props = Omit<StrictDropdownProps, "options"> & {
  colors: { color: string; value: string }[];
};

export const ColorSelect = (props: Props) => {
  const { colors, ...others } = props;
  const iconOptions = useMemo(
    () =>
      colors.map(({ value, color }) => ({
        color,
        icon: "square" as IconName,
        key: value,
        value,
      })),
    [colors]
  );

  return (
    <GridIconSelect iconOptions={iconOptions} iconSize="large" {...others} />
  );
};
