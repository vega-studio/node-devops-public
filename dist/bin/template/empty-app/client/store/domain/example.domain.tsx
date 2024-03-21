import { API } from "../../api/index.js";
import { ApplicationStore } from "../application.store.js";
import { makeObservable, observable } from "mobx";
import { SimpleAPIResource } from "../generic/api-resource.js";
import { Store } from "../store.js";
import type {
  IExampleGetRequest,
  IExampleGetResponse,
} from "../../../server/api/v1/example/example.get.js";

/**
 * Domain state for authentication.
 */
export class ExampleDomain extends Store {
  /**
   * Login resource which will give the user a session token.
   */
  @observable example = new SimpleAPIResource<
    IExampleGetRequest,
    IExampleGetResponse
  >(this.application, API.ExampleAPI.example);

  constructor(app: ApplicationStore) {
    super(app);
    makeObservable(this);
  }
}
