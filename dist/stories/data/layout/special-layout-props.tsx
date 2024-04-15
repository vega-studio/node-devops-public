import { ISpecialLayout } from "../../../components/index.js";
import { makeObservable, observable } from "mobx";

class Store implements ISpecialLayout {
  @observable className?: string = void 0;

  constructor() {
    makeObservable(this);
  }
}

export const SpecialLayoutProps = () => new Store();
