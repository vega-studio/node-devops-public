// We disable the file extension linting here because the "exports" for the
// react-dom package explicitly requires the syntax without the extension. We
// also keep this import separate from the other imports to prevent auto sorting
// messing up this rule.
// eslint-disable-next-line node/file-extension-in-import
import { createRoot } from "react-dom/client";

import React from "react";
import { Application } from "./store/index.js";
import { buildFonts } from "./styles/build-fonts.js";
import {
  CSSVars,
  setGlobalProperty,
  setGlobalPropertyRoot,
} from "./styles/css-vars.js";
import { ENV } from "config/env/env.js";
import { flowResult } from "mobx";
import { observer } from "mobx-react";
import { PageManager } from "./page-manager.js";
import { useLifecycle } from "../../util/hooks/use-life-cycle.js";
import "./app.scss";

interface IApp {
  // Insert Application configuration props here
}

/**
 * The entry Application component that mounts our React View and starts up our
 * Store and Router.
 */
const App = observer(
  React.forwardRef<HTMLDivElement, IApp>(() => {
    const container = React.useRef<HTMLDivElement>(null);

    // Clearly delineate app life cycle
    useLifecycle({
      willMount: () => {
        // Ensure our query params are immediately defined on app load.
        Application.session.updateQueryParams();
        // Immediately begin loading the current session before the Application
        // starts, thus allowing the application to react to the correct state
        // when it begins.
        flowResult(
          Application.session.loadSession({
            pathname: window.location.pathname,
          })
        );

        return true;
      },

      didMount: () => {
        // Font instantiating
        const destroyFonts = buildFonts();
        if (container.current) setGlobalPropertyRoot(container.current);

        // Apply any app level css variables
        const updateAppCSSVariables = (safePadding: {
          top: number;
          left: number;
          right: number;
          bottom: number;
        }) => {
          if (!container.current) return;
          setGlobalProperty(CSSVars.SAFE_PADDING_TOP, `${safePadding.top}px`);
          setGlobalProperty(CSSVars.SAFE_PADDING_LEFT, `${safePadding.left}px`);
          setGlobalProperty(
            CSSVars.SAFE_PADDING_RIGHT,
            `${safePadding.right}px`
          );
          setGlobalProperty(
            CSSVars.SAFE_PADDING_BOTTOM,
            `${safePadding.bottom}px`
          );
        };

        // Copy safe padding changes to the CSS scope when it changes
        ENV.application.platform?.listenSafePaddingUpdate?.(
          updateAppCSSVariables
        );

        // Apply the CSS scope once on mount
        updateAppCSSVariables(
          ENV.application.platform?.safePadding ?? {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }
        );

        // Execute environment is ready
        ENV.appDidLoad();

        return () => {
          // Ensure all fonts associated with this context are removed so we
          // don't clutter the DOM.
          destroyFonts();
          // Clean up if needed
          ENV.application.platform?.removeListener?.(updateAppCSSVariables);
        };
      },
    });

    return (
      <div ref={container} className="App" key="application">
        <PageManager key="page-manager" />
      </div>
    );
  })
);

/**
 * Entry method of the app. Established pre-render operations and wires up the
 * top level rendered node.
 */
async function main() {
  await ENV.appWillLoad();
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
}

main();
