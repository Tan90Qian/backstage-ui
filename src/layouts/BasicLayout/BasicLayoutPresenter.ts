import { observable, action, runInAction } from 'mobx';

export class BasicLayoutStore {
  @observable collapsed: boolean;

  constructor(defaultCollapsed: boolean) {
    runInAction(() => {
      this.collapsed = defaultCollapsed;
    });
  }
}

export class BasicLayoutPresenter {
  @action
  static setCollapsed(store: BasicLayoutStore, collapsed: boolean) {
    store.collapsed = collapsed;
  }
}
