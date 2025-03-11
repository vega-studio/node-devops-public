import THEME from "./theme.mts";
import { addons } from "@storybook/manager-api";

addons.setConfig({
  theme: THEME,
});
