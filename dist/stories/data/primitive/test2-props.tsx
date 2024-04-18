import { ITest2 } from "../../../components/index.js";
import { makeObservable, observable } from "mobx";

class Store implements ITest2 {
  @observable className?: string = void 0;

  constructor() {
    makeObservable(this);
  }
}

export const Test2Props = () => new Store();
