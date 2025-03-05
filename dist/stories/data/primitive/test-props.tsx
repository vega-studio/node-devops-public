import { ITest } from "../../../components/index.js";
import { makeObservable, observable } from "mobx";

class Store implements ITest {
  @observable className?: string = void 0;

  constructor() {
    makeObservable(this);
  }
}

export const TestProps = () => new Store();
