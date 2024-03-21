// We disable the file extension linting here because the "exports" for the
// react-dom package explicitly requires the syntax without the extension. We
// also keep this import separate from the other imports to prevent auto sorting
// messing up this rule.
// eslint-disable-next-line node/file-extension-in-import
import { createRoot } from "react-dom/client";

import React from "react";
import { Application } from "./store/index.js";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { buildFonts } from "./styles/build-fonts.js";
import {
  CSSVars,
  setGlobalProperty,
  setGlobalPropertyRoot,
} from "./styles/css-vars.js";
import { ENV } from "config/env/env.js";
import { flowResult } from "mobx";
import { HomePage } from "./pages/home/home.page.js";
import { observer } from "mobx-react";
import { useLifecycle } from "../../util/hooks/use-life-cycle.js";
import "./app.scss";

interface IApp {
  // Insert Application configuration props here
}

/**
 * Special component that updates the Session Store with current page metrics.
 */
const SessionPageUpdate = (props: { authenticating?: boolean }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Update the query params every page navigation
    Application.session.updateQueryParams();
    // Make the navigate function available to the application
    Application.session.setNavigate(navigate);
    // Update the application navigation history
    Application.session.pushHistory();
  }, []);

  if (props.authenticating) {
    return <div>Authenticating...</div>;
  }

  return <></>;
};

let sessionKey = 0;

/**
 * Wrapper to esnure Session Page Update is freshly mounted every navigation
 * change. We make sure the SessionPageUpdate Mounts so that it can update the
 * Store without triggering MobX errors.
 */
const AlwaysUpdateSession = () => {
  useNavigate();
  return <SessionPageUpdate key={++sessionKey} />;
};

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
        // Immediately begin loading the current session before the Application starts,
        // thus allowing the application to react to the correct state when it begins.
        flowResult(Application.session.loadSession());
        // Ensure our query params are immediately defined on app load.
        Application.session.updateQueryParams();

        return true;
      },

      didMount: () => {
        // Font instantiating
        const destroyFonts = buildFonts();

        // Apply any app level css variables
        const updateAppCSSVariables = (safePadding: {
          top: number;
          left: number;
          right: number;
          bottom: number;
        }) => {
          if (!container.current) return;
          setGlobalPropertyRoot(container.current);
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

        return () => {
          // Ensure all fonts associated with this context are removed so we don't
          // clutter the DOM.
          destroyFonts();
          // Clean up if needed
          ENV.application.platform?.removeListener?.(updateAppCSSVariables);
        };
      },
    });

    // This handles the application initialization that is looking to see if the
    // user is logged in or not on Application load.
    // if (
    //   !Application.session.isLoggedIn &&
    //   Application.domain.auth.heartbeat.isLoading
    // ) {
    //   return (
    //     <div ref={container} className="App">
    //       <BrowserRouter>
    //         <Routes>
    //           <Route
    //             path={"*"}
    //             element={<SessionPageUpdate authenticating={true} />}
    //           />
    //         </Routes>
    //       </BrowserRouter>
    //     </div>
    //   );
    // }

    return (
      <div ref={container} className="App">
        <BrowserRouter>
          <Routes>
            <Route path={"*"} element={<AlwaysUpdateSession />} />
          </Routes>
          <Routes>
            <Route path={ENV.routes.home} element={<HomePage />} />
            <Route path={"*"} element={<Navigate to={ENV.routes.home} />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  })
);

/**
 * Entry method of the app. AEstablished pre-render operations and wires up the
 * top level rendered node.
 */
async function main() {
  await ENV.appWillLoad();
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
}

main();
