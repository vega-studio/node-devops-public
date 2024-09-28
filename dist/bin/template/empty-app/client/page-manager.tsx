import React from "react";
import {
  AlwaysUpdateSession,
  SessionPage,
} from "./pages/session/session.page.js";
import { Application } from "./store/index.js";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  CSSVars,
  getGlobalProperty,
  setGlobalProperty,
} from "./styles/css-vars.js";
import { ENV } from "config/env/env.js";
import { HomePage } from "./pages/home/home.page.js";
import { observer } from "mobx-react";
import { PromiseResolver } from "../../util/promise-resolver.js";
import { toJS } from "mobx";
import { useLifecycle } from "../../util/hooks/use-life-cycle.js";
import { UserApplicationState } from "./store/session/session.store.js";
import { useSetState } from "../../util/hooks/use-set-state.js";
import "./app.scss";
import type { QueryParams } from "../../util/to-query-params.js";

export enum PageTransition {
  WILL_ENTER = "will-enter",
  DID_ENTER = "did-enter",
  AFTER_ENTER = "after-enter",
  WILL_LEAVE = "will-leave",
  DID_LEAVE = "did-leave",
}

/**
 * Provides page state information for the page being rendered.
 */
export interface IPageContext {
  /** The current transition state of the page */
  transition: PageTransition;

  /** Indicates the page that came before this page */
  previousLocation?: {
    pageKey: number;
    path: string;
    queryParams?: QueryParams;
    fullPath?: string;
  };

  /** Indicates the current page displayed for this page. */
  currentLocation: {
    pageKey: number;
    path: string;
    queryParams?: QueryParams;
    fullPath: string;
  };

  /** Indicates the page that is being loaded in */
  nextPage?: {
    pageKey: number;
    path: string;
    queryParams?: QueryParams;
    fullPath?: string;
  };
}

export const PageContext = React.createContext<IPageContext | undefined>(
  void 0
);

interface IRouteConfig {
  /**
   * This is the user's App state. This is passed in as a prop instead of
   * inferred from the Store to facilitate animating between pages.
   */
  userApplicationState: UserApplicationState;
  /** Current applied class for transistion state */
  transitionClass?: string;
  /**
   * The key for the page to properly keep a page's state alive as it
   * transitions away
   */
  pageKey?: number;
  /**
   * A custom path for the page to be displaying. Required when showing a page
   * that is animating away
   */
  location?: ReturnType<typeof useLocation>;
}

// Initialize globals
(async () => {
  await setGlobalProperty(CSSVars.PAGE_TRANSITION_DURATION, "300ms");
  await setGlobalProperty(CSSVars.PAGE_TRANSITION_DURATION_OUT, "150ms");
  await setGlobalProperty(CSSVars.PAGE_TRANSITION_DURATION_IN, "150ms");
})();

/**
 * Configures the rendering routes for the application. The page must follow the
 * React forwardRef pattern down to the chain to the top level div for this to
 * properly work in conjunction with the page animation system.
 */
const RouteConfig = React.forwardRef<HTMLDivElement, IRouteConfig>(
  (props, ref) => {
    const { transitionClass, pageKey, userApplicationState } = props;
    // We send all pages and only allow the Loading route when the application
    // is in a global loading state. This ensures the user only sees the correct
    // screens as the correct screens are dependent on the system being in a
    // defined state.
    if (userApplicationState === UserApplicationState.LOADING) {
      return (
        <Routes key={pageKey}>
          <Route path={"*"} element={<div>Loading</div>} />
        </Routes>
      );
    }

    return (
      <Routes key={pageKey}>
        <Route
          key={pageKey}
          path={ENV.routes.home}
          element={<HomePage ref={ref} className={transitionClass} />}
        />
        <Route path={"*"} element={<Navigate to={ENV.routes.home} />} />
      </Routes>
    );
  }
);

/**
 * This manages animating the pages between routes. This does some React voodoo
 * but is rather simple in that it simply copies the DOM node of the page about
 * to be destroyed by React before React gets opportunity to do so. It then puts
 * that DOM back into the DOM and applies some class names to it before a delay
 * eventually destroys it.
 */
const RouteAnimator = observer(() => {
  const pageRef = React.useRef<HTMLDivElement>(null);
  const sessionLocation = toJS(Application.session.location.current);
  const currentApplicationState = React.useRef(
    Application.session.userApplicationState
  );
  const currentLocation = React.useRef(sessionLocation);
  const animationTimer = React.useRef(-1);
  const [state, setState] = useSetState({
    previousTansitionState: null as PageTransition | null,
    currentTransitionState: null as PageTransition | null,
  });
  const renderRef = React.useRef(new PromiseResolver<void>());

  useNavigate();

  const getTransitionClass = (transition?: PageTransition | null) => {
    switch (transition) {
      case PageTransition.WILL_ENTER:
        return "Page--will-enter";
      case PageTransition.DID_ENTER:
        return "Page--will-enter Page--did-enter";
      case PageTransition.AFTER_ENTER:
        return "Page--will-enter Page--did-enter Page--after-enter";
      case PageTransition.WILL_LEAVE:
        return "Page--will-leave";
      case PageTransition.DID_LEAVE:
        return "Page--will-leave Page--did-leave";
      default:
        return "";
    }
  };

  // This is where most of the animation magic happens. It performs the
  // animation via a simple mechanism. Page changes -> Copy the DOM node of the
  // current page rendered (the page animating out) before React unmounts it
  // itself. -> Let react mount the new page -> Add the copied previous page
  // node back to the DOM in front of the new current page (the page animating
  // in)
  useLifecycle({
    willMount() {
      return true;
    },

    willUpdate() {
      let previousNode: HTMLElement | undefined | null;
      let previousParent: HTMLElement | undefined | null;

      const didPageChange =
        currentLocation.current.pageKey !==
        Application.session.location.current.pageKey;

      const didStateChange =
        currentApplicationState.current !==
        Application.session.userApplicationState;

      if (didPageChange || didStateChange) {
        // Store the state for next step and prevent infinite loops
        currentLocation.current = toJS(Application.session.location.current);
        currentApplicationState.current =
          Application.session.userApplicationState;
        // Capture the current node of the page for rendering as a transition
        // element. We perform a clone to completely detach the rendered DOM
        // from any application state and React management.
        previousNode = pageRef.current?.cloneNode(true) as HTMLElement;
        previousParent = pageRef.current?.parentElement;
      }

      // didUpdate
      return async () => {
        // Indicate a previous render has completed
        renderRef.current.resolve();

        try {
          const duration = Number.parseFloat(
            getGlobalProperty(CSSVars.PAGE_TRANSITION_DURATION) || "200"
          );

          // If we have stored our previous page, then we must transition it out
          // and transition in the new.
          if (previousNode && previousParent) {
            // Add back the previous page so we can smoothe transition it out.
            previousNode.classList.add(
              ...getTransitionClass(PageTransition.WILL_LEAVE).split(" ")
            );
            previousParent.appendChild(previousNode);

            // Initialization state for animations
            setState({
              previousTansitionState: PageTransition.WILL_LEAVE,
              currentTransitionState: PageTransition.WILL_ENTER,
            });

            // Wait for the render to take place
            await renderRef.current.promise;
            renderRef.current = new PromiseResolver<void>();
            // Try to trigger a reflow of the component
            pageRef.current?.offsetHeight;

            // Perform animations
            previousNode.classList.add(
              ...getTransitionClass(PageTransition.DID_LEAVE).split(" ")
            );
            setState({
              previousTansitionState: PageTransition.DID_LEAVE,
              currentTransitionState: PageTransition.DID_ENTER,
            });

            // Clear out animation states. We allow page transitions to last a
            // max of 200ms. The transition IN gets 400ms because it should have
            // the opportunity to cross animate with the transition out. If it
            // will not cross over, then the animation should have a delay of
            // 200ms to wait for the previous page to complete it's transition
            // out.
            animationTimer.current = window.setTimeout(() => {
              // Remove the transitioning out node
              previousNode.remove();
              setState({
                previousTansitionState: null,
              });

              // Set the animation timer again for clearing the current page
              // transition state. We perform this reset within the other timer
              // to chain the timings together and make it such that only a
              // single timer id is used to make it easy to cancel as needed.
              animationTimer.current = window.setTimeout(() => {
                setState({
                  currentTransitionState: null,
                });
              }, duration);
            }, duration);
          }
        } catch (error) {
          console.error(error);
        }
      };
    },

    async didMount() {
      return () => {
        // Make sure our animation timer has been cleared.
        window.clearTimeout(animationTimer.current);
      };
    },
  });

  // Render the current page transition state
  return (
    <RouteConfig
      key={sessionLocation.pageKey}
      ref={pageRef}
      userApplicationState={Application.session.userApplicationState}
      transitionClass={getTransitionClass(state.currentTransitionState)}
      pageKey={sessionLocation.pageKey}
    />
  );
});

/**
 * This manages our pages and provides high level transition information.
 */
export const PageManager = observer(() => {
  return (
    <BrowserRouter key="browser-router">
      <Routes>
        <Route path={"*"} element={<AlwaysUpdateSession />} />
      </Routes>
      <Routes>
        <Route path={"*"} element={<SessionPage />} />
      </Routes>
      <RouteAnimator key="route-animator" />
    </BrowserRouter>
  );
});
