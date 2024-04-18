import { IAnotherThingAgain } from "../../../components/index.js";
import { makeObservable, observable } from "mobx";

class Store implements IAnotherThingAgain {
  @observable className?: string = void 0;

  constructor() {
    makeObservable(this);
  }
}

export const AnotherThingAgainProps = () => new Store();
