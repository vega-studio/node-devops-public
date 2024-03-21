import type { ApplicationStore } from "../application.store.js";
import { ExampleDomain } from "./example.domain.js";
import { makeObservable, observable } from "mobx";
import { Store } from "../store.js";

export class DomainStore extends Store {
  @observable example = new ExampleDomain(this.application);

  constructor(app: ApplicationStore) {
    super(app);
    makeObservable(this);
  }
}
