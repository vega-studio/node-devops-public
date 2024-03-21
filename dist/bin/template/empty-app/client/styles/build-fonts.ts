// Example
// import NotoSansBlack from "../../asset/fonts/NotoSans-Black.ttf?inline";

import { /** addFont, */ destroyAllFonts } from "../../../util/add-font.js";

/**
 * Adds all the fonts to the application. This uses fonts that are bundled into
 * the package as base64 encoded strings.
 *
 * This method returns a disposer to clean out the fonts when they are no longer
 * needed.
 */
export function buildFonts() {
  // Example embed importted font.
  // addFont(
  //   "geniant__fonts",
  //   "NotoSans",
  //   NotoSansBlack,
  //   "truetype",
  //   900,
  //   "normal"
  // );

  return () => {
    destroyAllFonts("geniant__fonts");
  };
}
