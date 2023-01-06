import { IconName } from "./icon";

declare module "semantic-ui-react" {
  interface ListIconProps {
    name?: IconName;
  }

  interface IconProps {
    name?: IconName;
  }
}
