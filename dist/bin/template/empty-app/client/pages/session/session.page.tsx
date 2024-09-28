/**
 * This file contains componentry that is special to handling browser and user
 * session side effects. These components are dealt with at the application
 * level and should be used sparingly.
 */

import React from "react";
import { Application } from "../../store";
import { observer } from "mobx-react";
import { useLifecycle } from "../../../../util/hooks/use-life-cycle.js";
import { useNavigate } from "react-router-dom";

/**
 * Special component that updates the Session Store with current page metrics.
 */
export const SessionPageUpdate = (props: { authenticating?: boolean }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Update the query params every page navigation
    Application.session.updateQueryParams();
    // Make the navigate function available to the application
    Application.session.setNavigate(navigate);
    // Update the application navigation history
    Application.session.pushHistory();
    // Ensure our current/previous location is up to date. This helps resolve
    // issues when the user uses the browser's navigation interface instead of
    // the application.
    Application.session.ensureLocation();
  }, []);

  if (props.authenticating) {
    return <div>Authenticating...</div>;
  }

  return <></>;
};

let sessionKey = 0;

/**
 * Wrapper to ensure Session Page Update is freshly mounted every navigation
 * change. We make sure the SessionPageUpdate Mounts so that it can update the
 * Store without triggering MobX errors.
 */
export const AlwaysUpdateSession = () => {
  useNavigate();
  return <SessionPageUpdate key={++sessionKey} />;
};

/**
 * Handles side effects to changes in the session.
 */
export const SessionPage = observer(() => {
  // Register
  const userSession = Application.session.userSession;
  userSession.data;
  userSession.isLoading;

  /**
   * Performs initial application loading AFTER a user session is established.
   */
  const loadUserApplication = async () => {
    // We do not load unless the user session is established.
    if (
      !Application.session.userSession.data ||
      Application.session.userSession.isLoading
    ) {
      return;
    }

    // TODO: Place any user session related loading here
  };

  /**
   * Checks the user session and triggers a login if a session is not
   * established
   */
  const monitorSession = () => {
    // No need to monitor the session if the session isn't established yet.
    if (
      !Application.session.userSession.data ||
      Application.session.userSession.isLoading
    ) {
      return;
    }

    // TODO: Perform heartbeat logic here to ensure user session
  };

  useLifecycle({
    didMount: () => {
      // Indicate a potential update to the user session.
      loadUserApplication();
      // Monitor the user session every 5 seconds.
      const monitorSessionId = window.setInterval(monitorSession, 5000);

      return () => {
        window.clearInterval(monitorSessionId);
      };
    },
    willUpdate: () => {
      loadUserApplication();
    },
  });

  return <></>;
});
