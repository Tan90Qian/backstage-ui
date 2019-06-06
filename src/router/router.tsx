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
      component: dynamicWrapper(
        /* webpackChunkName: "basic" */ () => import('src/layouts/BasicLayout')
      ),
    },
    '/exception/404': {
      component: dynamicWrapper(
        /* webpackChunkName: "exception" */ () => import('src/pages/Exception/404')
      ),
    },
    '/exception/403': {
      component: dynamicWrapper(
        /* webpackChunkName: "exception" */ () => import('src/pages/Exception/403')
      ),
    },
    '/exception/500': {
      component: dynamicWrapper(
        /* webpackChunkName: "exception" */ () => import('src/pages/Exception/500')
      ),
    },
    '/user': {
      component: dynamicWrapper(
        /* webpackChunkName: "user" */ () => import('src/layouts/UserLayout')
      ),
    },
    '/user/login': {
      component: dynamicWrapper(
        /* webpackChunkName: "user" */ () => import('src/pages/User/Login')
      ),
    },
    '/demo': {
      component: dynamicWrapper(
        /* webpackChunkName: "demo" */ () => import('src/layouts/DemoLayout')
      ),
    },
    '/demo/spike1': {
      component: dynamicWrapper(
        /* webpackChunkName: "demo" */ () => import('src/pages/Demo/Spike1')
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
