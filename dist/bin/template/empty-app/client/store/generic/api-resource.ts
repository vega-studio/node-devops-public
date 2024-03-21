import { computed, flow, makeObservable, observable } from "mobx";
import { flowApi, FlowType } from "../types.js";
import { IErrorResponse } from "../../api/validation/error.zod.js";
import { IJsonType } from "../../../../util/types.js";
import type { IApplicationStore } from "../application.store.js";

/**
 * Represents a store resource that must be loaded from the server.
 */
export interface IAPIResource<T, U = object> {
  /**
   * Optional loading context to help discard post load operations that are
   * considered stale.
   */
  loadCtx?: number;
  /** This provides contextual data associated with this resource if necessary */
  ctx?: U;
  /** Indicates the resource is loading */
  isLoading: boolean;
  /** The data associated with the resource */
  data: T;
  /** Optional error information related to loading resources */
  error?: IErrorResponse;
}

type APIResult<TResponse> = {
  result: TResponse | null;
  error?: IErrorResponse;
};

type APICall<TRequest, TResponse> = (
  app: IApplicationStore,
  options: TRequest
) => Promise<APIResult<TResponse>>;

type Validate<TGuardType> = (data: any) => data is TGuardType;

/**
 * Examines a result data object for any type of feedback it possibly produced.
 */
export function toErrorMessage(result: any): IErrorResponse {
  return {
    message:
      result?.message ||
      result?.info ||
      (typeof result === "object"
        ? JSON.stringify(result)
        : typeof result === "string"
        ? result
        : "Unknown error"),
  };
}

export enum APILoadStrategy {
  /** Only allow one load at a time, discard any additional calls that come in */
  FirstOnly = "first-only",
  /** Only allow the most recent call to load to be processed */
  Latest = "latest",
}

/**
 * Makes a resource that can be loaded by calling it's load method. This does
 * simple guard check via a validation object and makes the request via a
 * provided api.
 */
export class SimpleAPIResource<TRequest, TResponse>
  implements IAPIResource<TResponse | null>
{
  @observable loadCtx?: number | undefined = void 0;
  @observable ctx?: object | undefined = void 0;
  @observable isLoading = false;
  @observable data: TResponse | null = null;
  @observable error?: IErrorResponse = void 0;

  /**
   * Used to aid in loading strategy in identifying load calls that are allowed
   * to pass
   */
  private loadId = 0;

  constructor(
    private app: IApplicationStore,
    private api: APICall<TRequest, TResponse>,
    private afterLoad?: (
      response: TResponse | null,
      request: TRequest,
      resource: SimpleAPIResource<TRequest, TResponse>
    ) => Promise<void>,
    private preLoad?: (request: TRequest) => Promise<TRequest>
  ) {
    makeObservable(this);
  }

  @flow
  private *loadFirst(request: TRequest) {
    if (this.isLoading) return;

    this.error = void 0;
    this.isLoading = true;

    const finalRequest = this.preLoad
      ? yield* flowApi(this.preLoad)(request)
      : request;
    if (!finalRequest) return;

    const response = (yield* flowApi(this.api)(
      this.app,
      finalRequest
    )) as APIResult<TResponse>;
    this.data = response.result;
    this.error = response.error;

    if (this.afterLoad) {
      yield* flowApi(this.afterLoad)(this.data, request, this);
    }

    this.isLoading = false;

    return response;
  }

  @flow
  private *loadLatest(request: TRequest) {
    this.error = void 0;
    this.isLoading = true;
    const loadIdCtx = ++this.loadId;

    const finalRequest = this.preLoad
      ? yield* flowApi(this.preLoad)(request)
      : request;
    if (loadIdCtx !== this.loadId) return;

    const response = (yield* flowApi(this.api)(
      this.app,
      finalRequest
    )) as APIResult<TResponse>;
    if (loadIdCtx !== this.loadId) return;

    this.data = response.result;
    this.error = response.error;

    if (this.afterLoad) {
      yield* flowApi(this.afterLoad)(this.data, request, this);
    }

    this.isLoading = false;

    return response;
  }

  /**
   * Triggers this resource to load according to the specified loading stratgey
   */
  @observable
  load: (request: TRequest) => ReturnType<typeof this.loadFirst> =
    this.loadFirst;

  /**
   * Applies a loading strategy to handle multiple overlapping load calls.
   */
  withLoadStrategy(strategy: APILoadStrategy) {
    switch (strategy) {
      case APILoadStrategy.FirstOnly:
        this.load = this.loadFirst;
        break;
      case APILoadStrategy.Latest:
        this.load = this.loadLatest;
        break;
    }

    return this;
  }
}

type PageableResource<TPageElement> = {
  next_page?: string | null;
  total_items?: number | null;
  items?: TPageElement[] | null;
  results?: {
    next_page?: string | null;
    total_items?: number | null;
    items?: TPageElement[] | null;
  } | null;
};

type PaginationCall = (
  app: IApplicationStore,
  page: string
) => Promise<IJsonType | null>;

/**
 * Makes a resource that understands how to load it's next page of data. These
 * are common paged data elements in the platform that usually have objects that contain:
 * {
 *   next_page: <url> | null,
 *   total_items: number,
 *   items: TPageElement[] or results: TPageElement[]
 * }
 */
export class SimplePaginatedResource<
  TPageElement,
  TResponse extends PageableResource<TPageElement>,
  TRequest,
> implements IAPIResource<TPageElement[] | null>
{
  @observable loadCtx?: number | undefined;
  @observable ctx?: object | undefined;
  @observable isLoading = false;
  @observable data: TPageElement[] | null = null;
  @observable error?: IErrorResponse;

  /** Holds the full response to keep track of the paging information */
  private _page: TResponse | null = null;
  get page() {
    return this._page;
  }

  constructor(
    private app: IApplicationStore,
    private pagination: PaginationCall,
    private validator: Validate<TResponse>,
    private api?: APICall<TRequest, TResponse>,
    private afterLoad?: (
      data: TPageElement[] | null,
      page: TResponse | null,
      hasMore: boolean,
      paginatedResource: SimplePaginatedResource<
        TPageElement,
        TResponse,
        TRequest
      >
    ) => Promise<void>
  ) {
    makeObservable(this);
  }

  /**
   * Manually apply a page of information to the resource to begin paginated
   * loading. Useful as some resources provide several initial page objects of
   * data.
   *
   * This should generally be the first page of data.
   */
  setPage(page: any) {
    if (
      page.next_page ||
      page?.results?.next_page ||
      page.items ||
      page?.results?.items
    ) {
      this._page = page;
      this.data = page.items || page.results?.items || [];
    }
  }

  /**
   * Is true when the current page object indicates more rows of data can be
   * loaded for the resource.
   */
  @computed
  get hasMore() {
    return Boolean(this._page?.next_page || this._page?.results?.next_page);
  }

  /**
   * Triggers the resource to load in the next page of information.
   */
  @flow
  *loadMore(): FlowType {
    if (!this._page) return;
    const nextPage = this._page.next_page || this._page.results?.next_page;

    if (!nextPage) {
      // Don't load anymore if nothing is available.
      return;
    }

    this.isLoading = true;
    const result = yield this.pagination(this.app, nextPage);

    if (this.validator(result)) {
      this.data?.push(...(result.items || result.results?.items || []));
      this._page = result;
    } else {
      this.data = null;
      this._page = null;
      this.error = toErrorMessage(result);
    }

    yield this.afterLoad?.(this.data, this._page, this.hasMore, this);
    this.isLoading = false;
  }

  /**
   * Triggers initial load of the resource if possible (api must be provided to
   * make it happen). Api is not required as the page can be manually set.
   */
  @flow
  *load(request: TRequest): FlowType {
    if (!this.api) return;

    this.isLoading = true;
    const result = yield this.api(this.app, request);

    if (this.validator(result)) {
      this.data = result.items || result.results?.items || [];
      this._page = result;
    } else {
      this.data = null;
      this._page = null;
      this.error = toErrorMessage(result);
    }

    yield this.afterLoad?.(this.data, this._page, this.hasMore, this);
    this.isLoading = false;
  }
}
