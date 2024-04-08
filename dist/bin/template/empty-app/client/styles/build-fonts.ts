// Generated font imports do not mess with the generated tag comments in anyway.
/* <generated-import> */
/* </generated-import> */

import { addFont, destroyAllFonts } from "../../../util/add-font.js";

/**
 * Adds all the fonts to the application. This uses fonts that are bundled into
 * the package as base64 encoded strings.
 *
 * This method returns a disposer to clean out the fonts when they are no longer
 * needed.
 */
export function buildFonts() {
  // Example embed importted font. addFont is from the same module as
  // destroyAllFonts
  //
  // addFont("geniant__fonts", "Inter var", Inter, "woff2", "100 900");

  // Generated font embeddings. Do not mess with the comment tag in anyway.
  /* <generated-addFont> */
  /* </generated-addFont> */

  return () => {
    destroyAllFonts("geniant__fonts");
  };
}
