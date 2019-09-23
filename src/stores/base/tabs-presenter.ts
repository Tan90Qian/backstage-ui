import { action, observable, runInAction } from 'mobx';

export class TabsStore<T = string> {
  @observable activeKey: T;

  constructor(defaultActiveKey: T) {
    runInAction(() => {
      this.activeKey = defaultActiveKey;
    });
  }
}

export class TabsPresenter {
  @action
  public static setActiveKey(store: TabsStore, activeKey: string) {
    store.activeKey = activeKey;
  }
}
