import { action, computed, flow, makeObservable, observable } from "mobx";
import { ENV } from "config/env/env.js";
import { NavigateFunction } from "react-router-dom";
import {
  QueryParams,
  toQueryParams,
} from "../../../../util/to-query-params.js";
import { Store } from "../store.js";
import { urlJoin } from "../../../../util/url-join.js";
import type { ApplicationStore } from "../application.store.js";
import type { FlowType } from "../../../../util/types.js";

export enum UserApplicationState {
  /**
   * Indicates the Application is loading a global property that is needed for
   * the application to display in the correct state
   */
  LOADING = "loading",
  NONE = "none",
}

export interface IUserSession {
  // Define the user's session here
}

/**
 * This contains a User's current session information and controls. This
 * monitors a client's logged in state as well as monitors things like window
 * configuration/location that is pertinent to the operation of the application.
 *
 * This can theoretically bridge between a user's input devices and the
 * application as well if those features are needed.
 */
export class SessionStore extends Store {
  /** This is populated when the user is authenticated. */
  @observable userSession: { isLoading: boolean; data?: IUserSession } = {
    isLoading: false,
  };

  /**
   * Stores which page the user is coming from when accessing the new page.
   * NOTE: This is NOT observable for a variety of important reasons to work
   * properly with the page transition system. You will need to use
   * observableLocation for an observable reactive version of this.
   */
  location: {
    previous?: {
      pageKey: number;
      path: string;
      queryParams?: QueryParams;
      fullPath: string;
    };
    current: {
      pageKey: number;
      path: string;
      queryParams?: QueryParams;
      fullPath: string;
    };
  } = {
    previous: {
      pageKey: 0,
      path: ENV.routes.home,
      fullPath: ENV.routes.home,
    },
    current: {
      pageKey: 1,
      path: window.location.pathname,
      fullPath: window.location.pathname,
    },
  };

  /**
   * Returns an observable version of the location property.
   */
  @computed
  get observableLocation() {
    // We register the page key here to make this update with the location
    // property changing.
    this.pageKey;
    return this.location;
  }

  /**
   * Used to uniquely key a page. This is used in page transitions as older
   * pages shuffle into other rendering systems for transitioning appropriately.
   */
  @observable private pageKey: number = 1;

  private _history: string[] = [];
  private _navigateFn?: NavigateFunction;
  @observable private _queryParams?: URLSearchParams = void 0;
  private _currentParamHref?: string = void 0;

  constructor(app: ApplicationStore) {
    super(app);
    makeObservable(this);
  }

  /** Indicates the user has a valid logged in session still. */
  @computed
  get isLoggedIn() {
    return Boolean(this.userSession.data);
  }

  /**
   * Computes high level user state based on what the user has accomplished with
   * their account. This is not really a role but reflects where in the
   * application the user should be.
   */
  @computed
  get userApplicationState() {
    // Set up the condition for global application state being loaded.
    // if (false) {
    //   return UserApplicationState.LOADING;
    // }

    // Check if the user is logged in
    if (this.isLoggedIn) {
      // Set up the application state to be the sign up flow possibly?
      // return UserApplicationState.SIGNUP;
    }

    // If there is no user session, then the user is just viewing the public
    // information flow.
    return UserApplicationState.NONE;
  }

  /**
   * The user has in app historical information to go back to. Differs from the
   * native history stack. IE refreshing the page makes this have zero history.
   */
  @computed
  get hasBack() {
    return this._history.length > 0;
  }

  /** Produces the browser query params map lookup */
  @computed
  get queryParams() {
    return this._queryParams;
  }

  /** Produces the current query params as a simple object */
  @computed
  get queryParamsObject(): {
    review?: "1";
    auditError?: "1";
    return?: "1";
  } & Record<string, string> {
    return Object.fromEntries(this._queryParams?.entries() || []);
  }

  /** Retrieve the current pathname on the window.location object */
  @computed
  get currentPathname() {
    return window.location.pathname;
  }

  /**
   * This is used to force check our Store's recording of the user's location
   * information against the actual window's location. If a mismatch is
   * detected, this updates the store with the latest location information.
   *
   * See PageManager for where this is typically called where we have navigation
   * hooks in place.
   */
  @action
  ensureLocation() {
    if (this.location.current.path !== this.currentPathname) {
      this.location = {
        previous: this.location.current,
        current: {
          pageKey: 1,
          path: window.location.pathname,
          fullPath: window.location.pathname,
        },
      };
    }
  }

  /**
   * Performs the steps necessary to cause the user's session to be invalidated.
   */
  @action
  logout() {
    this.userSession.isLoading = true;
    // Trigger the logout flow
    // this.application.domain.auth.logout.load({});
    this.userSession.isLoading = false;
  }

  /**
   * Indicates the user is retrieving their session information.
   */
  @computed
  get isLoggingIn() {
    // Check application state that will indicate the user is in process of
    // loggin in
    return this.userSession.isLoading;
  }

  /**
   * Runs the application login flow that establishes the user session.
   */
  @flow
  *login() {
    this.userSession = {
      isLoading: true,
    };

    // Trigger login resources here and establish the user session

    this.userSession.isLoading = false;
  }

  /**
   * Runs the application create account flow that establishes an account for
   * the user to utilize for the application.
   */
  @flow
  *createAccount() {
    this.userSession = {
      isLoading: true,
    };

    // Trigger account creation flows here...

    this.userSession.isLoading = false;
  }

  /**
   * Loads the user current session and validates it with the server.
   */
  @flow
  *loadSession(_location: { pathname: string }): FlowType {
    // Load the current session for the user if not established via the login procedure
  }

  /**
   * Trigger a check on the current location to update the params stored for
   * the session. Enables reactions to the query params.
   */
  @action
  updateQueryParams() {
    // Only trigger query param update if our location has changed since last
    // execution. We don't want deep app updates triggering if unnecessary
    if (this._currentParamHref !== window.location.href) {
      this._queryParams = new URL(document.location.href).searchParams;
      this._currentParamHref = window.location.href;
    }
  }

  /**
   * Perform a back based on the manually stored history of the user. This
   * enables smarter UI back button behavior.
   */
  @action
  goBack() {
    if (this._history.length > 0) {
      this._history.pop();
      const previousLocation = this._history[this._history.length - 1];
      this.navigate(previousLocation);
    }
  }

  /**
   * Triggers app navigation
   */
  @action
  navigate(path: string, queryParams?: QueryParams) {
    let fullPath = path;

    // Ensure leading slash to better match window.location standard
    if (!path.startsWith("/")) {
      path = `/${path}`;
    }

    // Convert injected params to query params
    if (queryParams) {
      fullPath = urlJoin(
        path,
        toQueryParams(queryParams, void 0, true, void 0)
      );
    }

    // Ensure leading slash to better match window.location standard
    if (!fullPath.startsWith("/")) {
      fullPath = `/${fullPath}`;
    }

    // See if we are navigating to the exact same page. Skip these changes
    if (this.location.current.fullPath === fullPath) return;

    this.location.previous = this.location.current;

    this.location.current = {
      pageKey: ++this.pageKey,
      path,
      queryParams,
      fullPath,
    };

    // Update the location in the browser
    this._navigateFn?.(fullPath);
    // Immediately update the query params to the new setup
    this.updateQueryParams();
  }

  /**
   * Adds the current window location to the history stack. Duplicate window
   * locations are not added to the history stack.
   */
  pushHistory() {
    // Get the current location + query params to dictate a unique deep link
    // location.
    const currentLocation = window.location.pathname + window.location.search;

    if (this._history[this._history.length - 1] !== currentLocation) {
      this._history.push(currentLocation);
    }
  }

  /**
   * Applies the navigate fn the app requires to navigate the application
   */
  setNavigate(navigate: NavigateFunction) {
    this._navigateFn = navigate;
  }
}
