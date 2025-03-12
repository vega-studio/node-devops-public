import { makeObservable, observable } from "mobx";

import { ITest } from "../../../components/index.js";

class Store implements ITest {
  @observable className?: string = void 0;

  constructor() {
    makeObservable(this);
  }
}

export const TestProps = () => new Store();
