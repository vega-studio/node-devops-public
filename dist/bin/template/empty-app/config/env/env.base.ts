import {
  QueryParams,
  tokenizeQueryParams,
  toQueryParams,
} from "../../../util/to-query-params.js";
import { template } from "../../../util/template.js";
import { urlJoin } from "../../../util/url-join.js";

/**
 * Defines host configuration for targetting API resources for the UI.
 */
export interface IHostConfig {
  /**
   * This is used strictly for development. This makes the development server
   * create a proxy address for local to hit a remote service. Thus with this
   * set you can expect the following to happen:
   *
   * - The UI will make a request to "local.<your domain>" + "apiPath"
   *
   * - The request will hit the local development server for which the server
   *   will route the request to "proxyHost" to make the request. The response
   *   will then be routed to the UI.
   *
   * Why this? This is to avoid CORS issues as the remote servers and
   * configurations are vast and complex. This normalizes the requests through
   * the local proxy server so you do not encounter those issues. This will
   * properly handle HTTPS issues as well.
   *
   * NOTE: When this is set, "host" should be left as an empty string.
   */
  proxyHost: string;
  /**
   * This is ONLY used when proxyHost is set. This is the API path the requests
   * from the client will make to the remote server and this is what the proxy
   * server will recognize as the route to proxy; however, the server will call
   * out to the remote server with the "proxyHost" + "apiPath" to make the
   * correct call.
   *
   * We use this because there are many times that the proxy request will have
   * overlap with other similar routes so we need to introduce some artifical
   * variance to help the proxying not get confused.
   */
  proxyAliasPath?: string;
  /**
   * When in production, this will direct the UI to use this specified host for
   * it's API requests. If in development, this should be left as an empty
   * string.
   */
  host: string;
  /**
   * Prefix of the path for the API of this host. The system can inject some
   * limited metrics such as "version" using:
   *
   * - ${version}
   *
   * eg: "/api/v${version}/example"
   */
  apiPath: string;

  /** Optional headers for the REST API */
  headers?: {
    get?: HeadersInit;
    post?: HeadersInit;
    delete?: HeadersInit;
    put?: HeadersInit;
  };

  /** Optional values to pass to the fetch API */
  fetchOptions?: {
    get?: RequestInit;
    post?: RequestInit;
    delete?: RequestInit;
    put?: RequestInit;
  };
}

export type URLConfig = {
  path: string;
  headers?: HeadersInit;
  fetchOptions?: RequestInit;
};

export interface IURLRestConfig {
  get: URLConfig;
  post: URLConfig;
  delete: URLConfig;
  put: URLConfig;
}

/**
 * Type guard for host configs
 */
export function isHostConfig(val: any): val is IHostConfig {
  return (
    val &&
    val.host !== void 0 &&
    val.apiPath !== void 0 &&
    val.proxyHost !== void 0
  );
}

/**
 * Easy Host config intiialization for this base class. Not useful anywhere
 * else.
 */
function emptyHostConfig() {
  return {
    host: "TODO",
    apiPath: "TODO",
    proxyHost: "TODO",
  };
}

/**
 * Base configuration to share amongst all configurations. Each configuration
 * will merely edit this base to account for their specific use cases.
 */
export class EnvBase {
  /**
   * This contains all of the paths to resources this app will use. This
   * supports multiple domains and proxying expectations for dev and production
   * environments.
   */
  hostConfig: {
    api: IHostConfig;
  } = {
    api: emptyHostConfig(),
  };

  /**
   * This is configuration associated with third party services
   */
  thirdParty: {
    example: string;
  } = {
    example: "TODO",
  };

  /** The base of each route */
  baseRoute = "";
  /**
   * The expected route for public static resources.
   * An important use case for this is in the app.html file where the javascript
   * is loaded from this path.
   */
  basePublicRoute = `/base-example/statics`;
  /**
   * This specifies paths where the user must privde a jwt for the request to
   * pass. The JWT must then have the role specified in the
   * x-hasura-allowed-roles JWT claim to allow the resource to be accessed.
   *
   * {
   *   route: [allowed-roles]
   * }
   */
  roleProtectedRoutes: Record<string, string[]> = {
    "/protected": ["admin"],
  };

  /**
   * All routes used within this application.
   *
   * It is NOT recommended to place qualifiers in the URL path. Instead use
   * query params for qualifiers and use a dewcriptive generic path name. This
   * is to allow qualifiers to be easily examined for the application to react
   * to them. Qualifiers in the path requires specialized parsing that should
   * not be done by the application.
   *
   * ie - /api/v1/thing/${id}/${etc} is not supported instead use
   * /api/v1/thing?id=1324&etc=123 by providing query params to the route
   * method.
   */
  routes = {
    home: "/",
    login: "/login",
  };

  /**
   * These are application specific configurations to make sure the bundle
   * targets specific resources and present specific screens based on these
   * settings.
   */
  application: {
    /**
     * Proper heartbeat interval for the application.
     */
    heartbeatInterval?: number;

    /** Targets the appropriate way to apply a preference to local storage */
    preferences?: {
      get(key: string): Promise<string | null | void>;
      set(key: string, value: string): Promise<void>;
    };

    /** Will load in platform specific information */
    platform?: {
      /** Indicate platform being ran */
      type?: "android" | "ios" | "web";
      /**
       * Indicate screen edge paddings to account for native UI elements present
       */
      safePadding?: {
        top: number;
        left: number;
        right: number;
        bottom: number;
      };
      /** Executes when the safe padding has updated */
      listenSafePaddingUpdate?(
        listener: (safePadding: {
          top: number;
          left: number;
          right: number;
          bottom: number;
        }) => void
      ): void;
      /** Executes when the keyboard is shown */
      listenKeyBoardShow?(listener: (height: number) => void): void;
      /** Executes when keyboard is hidden */
      listenKeyBoardHide?(listener: (height: number) => void): void;
      /** Executes when device orientation changes */
      listenOrientationChange?(
        listener: (orientation: "portrait" | "landscape") => void
      ): void;
      /** Stop executing listener */
      removeListener?(listener: Function): void;
    };
  } = {};

  /**
   * Easy access to all routes available to the application.
   * [route name, route path]
   */
  allRoutes() {
    return Object.entries(this.routes);
  }

  /**
   * This gathers all of the information that can be passed to a url string with
   * tokens specified.
   */
  tokenize(
    value: string,
    version: number,
    query?: QueryParams,
    repeatQueryLists?: boolean,
    excludeQueryString?: boolean
  ) {
    // Convert our query params to a Record so they can be used as tokens for
    // the URL template.
    let queryTokens: Record<string, string | string[] | undefined> | undefined;

    if (query instanceof Map) {
      const q = (queryTokens = {} as Record<
        string,
        string | string[] | undefined
      >);

      query.forEach((val, key) => {
        q[key] = val || "";
      });
    } else if (query) {
      queryTokens = query;
    }

    // Swap out all token replacements with the relevant values to replace them.
    const tokens = {
      version: `${version}`,
      ...(queryTokens || {}),
    };

    const result = template({
      template: value,
      options: tokens,
    });

    value = result.template;

    // Append the query string to the end of the URL
    if (queryTokens !== void 0 && !excludeQueryString) {
      // Get the the tokens reference in this scope so TS can recognize it as
      // defined in the loop.
      const q = queryTokens;

      // Remove every token that was used in the URL so we only append unused
      // tokens as part of the query string at the end.
      result.resolvedTemplateOptions.forEach((_count, tokenName: string) => {
        delete q[tokenName];
      });

      value += toQueryParams(q, tokens, true, repeatQueryLists);
    }

    if (result.unresolvedTemplateOptions.size > 0) {
      console.warn(
        `Unresolved template options for API resource: ${value}\n${Array.from(
          result.unresolvedTemplateOptions.keys()
        ).join("\n")}`
      );
    }

    return value;
  }

  /**
   * This replaces tokens within query params
   */
  tokenizeParams(version: number, params: QueryParams) {
    const tokens = {
      version: `${version}`,
    };

    return tokenizeQueryParams(params, tokens);
  }

  /**
   * Tokenizes values found in a map of records.
   */
  tokenizeHeaders(
    value: HeadersInit | undefined,
    version: number,
    query?: QueryParams
  ) {
    if (!value) return value;

    // Tokenize the values in the map, but exclude query string so we only
    // tokenize existing tokens in the string.
    return Object.entries(value).reduce(
      (acc, [key, val]) => {
        acc[key] = this.tokenize(val, version, query, false, true);
        return acc;
      },
      {} as Record<string, string>
    );
  }

  /**
   * Generic API generator for any IHostConfig.
   *
   * Unless there are specific configurations special or redundant for a given
   * API that everyone can benefit from, this is the preferred method for using
   * an IHostConfig for
   */
  useApi(
    api: IHostConfig,
    version: number,
    path: string,
    query?: QueryParams,
    repeatQueryLists?: boolean,
    headerTokens?: QueryParams
  ): IURLRestConfig {
    let url = this.tokenize(
      urlJoin(
        api.host,
        api.proxyHost && api.proxyAliasPath
          ? urlJoin(api.proxyAliasPath, api.apiPath)
          : api.apiPath,
        path
      ),
      version,
      query,
      repeatQueryLists
    );

    // This corrects the URL for relative pathing
    if (!api.host) url = `/${url}`;

    return {
      get: {
        path: url,
        headers: this.tokenizeHeaders(api.headers?.get, version, headerTokens),
        fetchOptions: api.fetchOptions?.get,
      },
      post: {
        path: url,
        headers: this.tokenizeHeaders(api.headers?.post, version, headerTokens),
        fetchOptions: api.fetchOptions?.post,
      },
      put: {
        path: url,
        headers: this.tokenizeHeaders(api.headers?.put, version, headerTokens),
        fetchOptions: api.fetchOptions?.put,
      },
      delete: {
        path: url,
        headers: this.tokenizeHeaders(
          api.headers?.delete,
          version,
          headerTokens
        ),
        fetchOptions: api.fetchOptions?.delete,
      },
    };
  }

  /**
   * Generate a route URL with attached query params. It is NOT recommended to
   * place qualifiers in the URL path. Instead use query params for qualifiers
   * and use a dewcriptive generic path name. This is to allow qualifiers to be
   * easily examined for the application to react to them. Qualifiers in the
   * path requires specialized parsing that should not be done by the
   * application.
   *
   * Thus, this does not support replacing qualifiers in paths:
   * ie - /api/v1/thing/${id} is not supported instead use /api/v1/thing?id=132
   * by providing query params to this method.
   */
  route(route: string, params: QueryParams) {
    let url = urlJoin(route, toQueryParams(params));
    if (url[0] !== "/") url = `/${url}`;

    return url;
  }

  /**
   * Performs all initialization required to make the current configuration
   * valid across all properties.
   */
  init() {
    // Extend all of the routes with the base
    let k: keyof EnvBase["routes"];

    for (k in this.routes) {
      const v = this.routes[k];
      this.routes[k] = `${this.baseRoute}${v}`;
    }

    return this;
  }

  /**
   * This executes once before the application is established. This allows for
   * some quick asynchronous operations that establishes device needs before
   * anything is rendered.
   *
   * NOTE: Operations in this block should be EXTREMELY PERFORMANT AND FAST. DO
   * NOT cram long running ANYTHING in here.
   */
  async appWillLoad() {
    // NOOP
  }

  /**
   * This executes once after the application is established and completed it's
   * first render. This allows for some quick asynchronous operations that
   * allows environment dependent configuration to be applied to the application
   * in a fully running state.
   *
   * NOTE: Operations in this block should be EXTREMELY PERFORMANT AND FAST. DO
   * NOT cram long running ANYTHING in here.
   */
  async appDidLoad() {
    // NOOP
  }
}
