import React, { createElement, ComponentType } from 'react';
import { RouteProps } from 'react-router';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';

import { authorityType } from 'src/components/Authorized/utils';

import { getMenuData, IMenuItem } from './menu';

type Pick<T, K extends keyof T> = { [P in K]?: T[P] };

interface IComponent {
  (): Promise<any>;
}

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
      component: dynamicWrapper(() => import('src/layouts/BasicLayout')),
    },
    '/exception/404': {
      component: dynamicWrapper(() => import('src/pages/Exception/404')),
    },
    '/exception/403': {
      component: dynamicWrapper(() => import('src/pages/Exception/403')),
    },
    '/exception/500': {
      component: dynamicWrapper(() => import('src/pages/Exception/500')),
    },
    '/user': {
      component: dynamicWrapper(() => import('src/layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(() => import('src/pages/User/Login')),
    },
  };
  const menuData: IMenuData = getFlatMenuData(getMenuData());
  const routerData: IRouterData = {};
  Object.keys(routerConfig).forEach(path => {
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem: IMenuItemPicked = {};
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
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
}

export { getRouterData };
