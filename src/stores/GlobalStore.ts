import { observable, action, computed } from 'mobx';
import { Location } from 'history';
import pathToRegexp from 'path-to-regexp';

import { getMenuData, IMenuItem } from 'src/router/menu';
import { IRouterData, IRouterItem } from 'src/router/router';

const getBreadcrumbNameMap = (menuData: IMenuItem[], routerData: IRouterData): IRouterData => {
  const result: IRouterData = {};
  const childResult: IRouterData = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

export class GlobalPresenter {
  @action
  static setIsMobile(store: GlobalStore, isMobile: boolean) {
    store.isMobile = isMobile;
  }

  @action
  static setRouterData(store: GlobalStore, routerData: IRouterData) {
    store.routerData = routerData;
  }

  @action
  static setLocation(store: GlobalStore, location: Location<any>) {
    store.location = location;
  }
}

export class GlobalStore {
  static instance: GlobalStore;

  @observable globalTitle = 'Backsatge-ui';

  @observable globalCopyright = 'Backsatge-ui 2019';

  @observable isMobile = false;

  @observable routerData: IRouterData = {};

  @observable location: Location<any> = null;

  @computed
  get pageTitle() {
    let currRouterData: IRouterItem;
    // match params path
    if (this.location && this.routerData) {
      Object.keys(this.routerData).forEach(key => {
        if (pathToRegexp(key).test(this.location.pathname)) {
          currRouterData = this.routerData[key];
        }
      });
      if (currRouterData && currRouterData.name) {
        return `${currRouterData.name} - ${this.globalTitle}`;
      }
    }
    return this.globalTitle;
  }

  @computed
  get breadcrumbNameMap() {
    return getBreadcrumbNameMap(getMenuData(), this.routerData);
  }
}

GlobalStore.instance = new GlobalStore();
