import { action, observable, runInAction } from 'mobx';
import { CardTabListType } from 'antd/lib/card';

export class TabsStore {
  @observable activeKey: string;

  @observable tabList: CardTabListType;

  constructor(tabList?: CardTabListType, defaultActiveKey?: string) {
    runInAction(() => {
      this.tabList = tabList;
      this.activeKey = defaultActiveKey;
    });
  }
}

export class TabsPresenter {
  @action
  public static setActiveKey(store: TabsStore, activeKey: string) {
    store.activeKey = activeKey;
  }

  @action
  public static setTabList(store: TabsStore, tabList: CardTabListType) {
    store.tabList = tabList;
  }
}
