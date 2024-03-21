import { action, computed, flow, makeObservable, observable } from "mobx";
import { ENV } from "config/env/env.js";
import { NavigateFunction } from "react-router-dom";
import { FlowType } from "../types.js";
import {
  QueryParams,
  toQueryParams,
} from "../../../../util/to-query-params.js";
import { Store } from "../store.js";
import { urlJoin } from "../../../../util/url-join.js";
import type { ApplicationStore } from "../application.store.js";

/**
 * TODO: This is a temp type that should be replaced by the user session that
 * comes from the server application when it's ready.
 */
interface IUserSession {}

export class SessionStore extends Store {
  /**
   * This defines the user's logged in status. When this value is "cookie" it
   * means the jwt exists but is attached to the session cookie.
   */
  @observable userSession: IUserSession | null = null;
  /** This defines the user's role they are currently using  */
  @observable userRole = "";
  /**
   * This stores the waveform in a data format when the user is using the
   * microphone. This contains the latest discovered data from the user when the
   * listenToMicrophone() is called.
   */
  @observable microphoneAudioData: Uint8Array | null = null;
  /**
   * This stores the latest speech sent from the user. This uses the browsers
   * determination when the user's speech text is a completed statement.
   */
  @observable speechText: { current: string; isFinished: boolean } | null =
    null;

  /** Helps us reject overlapping media requests */
  @observable isRequestingMedia = false;

  private _history: string[] = [];
  private _navigateFn?: NavigateFunction;
  @observable private _queryParams?: URLSearchParams = void 0;
  private _currentParamHref?: string = void 0;
  private heartbeatTimer?: number = -1;

  constructor(app: ApplicationStore) {
    super(app);
    makeObservable(this);
  }

  /** Indicates the user has a valid logged in session still. */
  @computed
  get isLoggedIn() {
    return Boolean(this.userSession);
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
  get queryParamsObject() {
    return Object.fromEntries(this._queryParams?.entries() || []);
  }

  @computed
  get currentLocation() {
    return window.location.pathname;
  }

  /**
   * Applies the current session to the store
   */
  @action
  setSession(userSession?: IUserSession | null) {
    // If we didn't want to clear the session, then we just retain the session
    // set during login.
    if (userSession === void 0) userSession = this.userSession;

    // We are clearing the session because our heartbeat failed or we just want
    // to be considered logged out.
    if (this.userSession && userSession) {
      // Clear any sensitive data
      this.application.clear();

      this.navigate(ENV.routes.login);
    }

    this.userSession = userSession;
    window.clearInterval(this.heartbeatTimer);

    // If a session is applied, we can trigger heartbeat checks
    if (userSession) {
      this.heartbeatTimer = window.setInterval(
        () => {
          // TODO: Add back when auth is ready
          // this.application.domain.auth.heartbeat.load({});
        },
        ENV.application.heartbeatInterval || 1000 * 60 * 5
      );
    }

    // No session: go to login
    else {
      ENV.application.preferences?.set("session", "");
    }
  }

  @action
  signOut() {
    ENV.application.preferences?.set("session", "");
    this.application.session.setSession(null);
  }

  /**
   * If the user is not logged in this triggers a navigation to the login page
   */
  @action
  requireLogin() {
    if (!this.isLoggedIn) {
      this.navigate(ENV.routes.login);
      return false;
    }

    return true;
  }

  /**
   * Loads the user current session and validates it with the server.
   */
  @flow
  *loadSession(): FlowType {
    // Attempt a heartbeat. If the heartbeat fails, we are not logged in
    // anymore.
    // TODO: Add back when auth is ready
    // yield flowResult(this.application.domain.auth.login.load({}));
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
  navigate(path: string, queryParams?: QueryParams) {
    // Convert injected params to query params
    if (queryParams) {
      path = urlJoin(path, toQueryParams(queryParams, void 0, true, void 0));
    }

    // Update the location in the browser
    this._navigateFn?.(path);
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
