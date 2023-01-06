import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";
import { HecEyeIcons } from "../constants/HecEyeIcons";

// 必要に応じて追加してください
// https://fomantic-ui.com/elements/icon.html#icon-set
type FomanticICONS = "route" | "layer group" | "map marked alternate";

type HecEyeICONS = typeof HecEyeIcons[keyof typeof HecEyeIcons];

export type IconName = SemanticICONS | FomanticICONS | HecEyeICONS;
