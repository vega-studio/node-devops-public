import { ITest3 } from "../../../components/index.js";
import { makeObservable, observable } from "mobx";

class Store implements ITest3 {
  @observable className?: string = void 0;

  constructor() {
    makeObservable(this);
  }
}

export const Test3Props = () => new Store();
