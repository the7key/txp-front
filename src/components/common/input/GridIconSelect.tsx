import clsx from "clsx";
import { useMemo } from "react";
import {
  Icon,
  Select,
  SemanticSIZES,
  StrictDropdownProps,
} from "semantic-ui-react";
import { IconSizeProp } from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import { IconName } from "../../../types/icon";
import styles from "./GridIconSelect.module.scss";

type IconOptions = {
  color?: string;
  icon: IconName;
  iconSize?: SemanticSIZES;
  key?: string;
  value: string | number;
}[];

export type GridIconSelectProps = Omit<StrictDropdownProps, "options"> & {
  iconOptions: IconOptions;
  iconSize?: IconSizeProp;
};

export const GridIconSelect = (props: GridIconSelectProps) => {
  const { className, iconOptions, onChange, iconSize, ...others } = props;

  const options = useMemo(
    () =>
      iconOptions.map(({ key, icon, color, value }) => ({
        key: key ?? value,
        text: (
          <Icon className={icon} style={{ color: color }} size={iconSize} />
        ),
        value,
      })),
    [iconOptions, iconSize]
  );

  return (
    <Select
      className={clsx(styles.root, className)}
      selection
      options={options}
      onChange={onChange}
      {...others}
    />
  );
};
