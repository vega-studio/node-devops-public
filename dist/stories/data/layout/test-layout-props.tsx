import { ITestLayout } from "../../../components/index.js";
import { makeObservable, observable } from "mobx";

class Store implements ITestLayout {
  @observable className?: string = void 0;

  constructor() {
    makeObservable(this);
  }
}

export const TestLayoutProps = () => new Store();
