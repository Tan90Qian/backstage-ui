import React, { createElement, ComponentType } from 'react';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';

import { getMenuData, IMenuItem } from './menu';

interface IComponent {
  (): Promise<any>;
}

interface IMenuData {
  [propName: string]: IMenuItem;
}

export interface IRouterItem {
  name?: string;
  hideInBreadcrumb?: boolean;
  component: ComponentType<any>;
}

export interface IRouterData {
  [propName: string]: IRouterItem;
}

let routerDataCache: object;

const dynamicWrapper = (component: IComponent): ComponentType<any> => {
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData();
      }
      return component().then((raw: any) => {
        const Component = raw.default || raw;
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

function getRouterData() {
  const routerConfig: IRouterData = {
    '/': {
      component: dynamicWrapper(() => import('../layouts/BasicLayout')),
    },
    '/user': {
      component: dynamicWrapper(() => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(() => import('../routes/User/Login')),
    },
  };
  const menuData: IMenuData = getFlatMenuData(getMenuData());
  const routerData: any = {};
  Object.keys(routerConfig).forEach(path => {
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem: any = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router: IRouterItem = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
}

export { getRouterData };
