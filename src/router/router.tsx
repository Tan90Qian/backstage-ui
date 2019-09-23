import React, { createElement, ComponentType } from 'react';
import { RouteProps } from 'react-router';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';

import { authorityType } from 'src/components/Authorized/utils';
import { IFactory, IService, IStore } from 'src/declares/Component';

import { getMenuData, IMenuItem } from './menu';

type Pick<T, K extends keyof T> = { [P in K]?: T[P] };

interface IMenuData {
  [propName: string]: IMenuItem;
}

export interface IRouterItem extends RouteProps {
  name?: string;
  hideInBreadcrumb?: boolean;
  authority?: authorityType;
}

export interface IRouterData {
  [propName: string]: IRouterItem;
}

type IMenuItemPicked = Pick<IMenuItem, keyof IMenuItem>;

let routerDataCache: IRouterData;

interface IComponent {
  // TODO 从Promise<IFactory>切到any吧
  // (): Promise<IFactory>;
  (): any;
}

const dynamicWrapper = (
  component: IComponent,
  service?: IService,
  store?: IStore
): ComponentType<any> => {
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(service, store);
      }
      return component().then((raw: any) => {
        const factory: IFactory = raw.default || raw;
        const Component = factory({ service, store });
        return (props: any) =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

function getFlatMenuData(menus: IMenuItem[]) {
  let keys: IMenuData = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

function getRouterData(service: IService, store: IStore) {
  const routerConfig: IRouterData = {
    '/': {
      component: dynamicWrapper(
        () => import(/* webpackChunkName: "basic" */ 'src/layouts/BasicLayout'),
        service,
        store
      ),
    },
    '/welcome': {
      component: dynamicWrapper(
        () => import(/* webpackChunkName: "basic" */ 'src/pages/Welcome'),
        service,
        store
      ),
    },
    '/exception/404': {
      component: dynamicWrapper(() =>
        import(/* webpackChunkName: "exception" */ 'src/pages/Exception/404')
      ),
    },
    '/exception/403': {
      component: dynamicWrapper(() =>
        import(/* webpackChunkName: "exception" */ 'src/pages/Exception/403')
      ),
    },
    '/exception/500': {
      component: dynamicWrapper(() =>
        import(/* webpackChunkName: "exception" */ 'src/pages/Exception/500')
      ),
    },
    '/user': {
      component: dynamicWrapper(
        () => import(/* webpackChunkName: "user" */ 'src/layouts/UserLayout'),
        service,
        store
      ),
    },
    '/user/login': {
      component: dynamicWrapper(
        () => import(/* webpackChunkName: "user" */ 'src/pages/User/Login'),
        service,
        store
      ),
    },
  };
  const menuData: IMenuData = getFlatMenuData(getMenuData());
  const routerData: IRouterData = {};
  Object.keys(routerConfig).forEach(path => {
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem: IMenuItemPicked = {};
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router: IRouterItem = routerConfig[path];
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
}

export { getRouterData };
