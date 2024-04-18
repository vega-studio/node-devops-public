import { IAnotherThing } from "../../../components/index.js";
import { makeObservable, observable } from "mobx";

class Store implements IAnotherThing {
  @observable className?: string = void 0;

  constructor() {
    makeObservable(this);
  }
}

export const AnotherThingProps = () => new Store();
