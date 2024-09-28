import { PromiseResolver } from "../../../util/promise-resolver.js";

/**
 * The documented and available CSS Variables for the application. Each property
 * can be enabled or disabled
 */
export const CSSVars = {
  /**
   * Safe paddings dictate the space available for the application and allows
   * for physical features of a device to be accounted for when in different
   * phsycial media.
   */
  SAFE_PADDING_TOP: "--safe-padding-top",
  /**
   * Safe paddings dictate the space available for the application and allows
   * for physical features of a device to be accounted for when in different
   * phsycial media.
   */
  SAFE_PADDING_LEFT: "--safe-padding-left",
  /**
   * Safe paddings dictate the space available for the application and allows
   * for physical features of a device to be accounted for when in different
   * phsycial media.
   */
  SAFE_PADDING_RIGHT: "--safe-padding-right",
  /**
   * Safe paddings dictate the space available for the application and allows
   * for physical features of a device to be accounted for when in different
   * phsycial media.
   */
  SAFE_PADDING_BOTTOM: "--safe-padding-bottom",
  /**
   * This is the duration of the page transition animation
   */
  PAGE_TRANSITION_DURATION: "--page-transition-duration",
  /**
   * Duration of transitioning out a page. This + in should be
   * PAGE_TRANSITION_DURATION in length.
   */
  PAGE_TRANSITION_DURATION_OUT: "--page-transition-duration-out",
  /**
   * Duration of transitioning in a page. This + out should be
   * PAGE_TRANSITION_DURATION in length.
   */
  PAGE_TRANSITION_DURATION_IN: "--page-transition-duration-in",
} as const;

// Get all of the values from the config object
const allValues = Object.values(CSSVars).reduce((p, n) => {
  if (p.has(n)) {
    console.error(
      "Duplicate CSSVar value detected. All CSSVars must be unique in key and value."
    );
  }
  p.add(n);
  return p;
}, new Set<(typeof CSSVars)[keyof typeof CSSVars]>());

/**
 * The set context for the root of the application.
 */
let root: HTMLElement | undefined = void 0;
const rootResolver = new PromiseResolver<undefined>();

/**
 * Returns the root of the application (the application container).
 */
export function setGlobalPropertyRoot(rootElement: HTMLElement) {
  root = rootElement;
  rootResolver.resolve(void 0);
}

/**
 * Applied a global CSS variable available from the root of the application (the
 * application container). This sets the value ONLY if the value is present in
 * this file.
 *
 * This prevents the use of CSS variables that are not available in the
 * application and enforces documentation for those variables to be present.
 *
 * Properties not included and documented in this file will trigger errors in
 * the console.
 */
export async function setGlobalProperty(
  property: (typeof CSSVars)[keyof typeof CSSVars],
  value: string | null,
  priority?: string
) {
  await rootResolver.promise;

  if (!root) {
    console.error(
      "The application root has not been set. Please use setRoot()."
    );
    return;
  }

  if (allValues.has(property)) {
    root.style.setProperty(property, value, priority);
  } else {
    console.error(
      `CSS variable ${property} is not available in the application. Please use an existing property or modify css-vars.`
    );
  }
}

/**
 * Reads a global CSS variable available from the root of the application (the
 * application container). This reads the value ONLY if the value is present in
 * this file.
 *
 * This prevents the use of CSS variables that are not available in the
 * application and enforces documentation for those variables to be present.
 *
 * Properties not included and documented in this file will trigger errors in
 * the console.
 */
export function getGlobalProperty(
  property: (typeof CSSVars)[keyof typeof CSSVars]
) {
  if (!root) {
    console.error(
      "The application root has not been set. Please use setRoot()."
    );
    return;
  }

  if (property) {
    return getComputedStyle(root).getPropertyValue(property);
  } else {
    console.error(
      `CSS variable ${property} is not available in the application. Please use an existing property or modify css-vars.`
    );
  }
}
