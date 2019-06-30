import React, { useContext } from 'react';
import pathToRegexp from 'path-to-regexp';
import { PageHeader } from 'antd';
import { PageHeaderProps } from 'antd/lib/page-header';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import { Location } from 'history';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import StoreContext from 'src/stores';
import { IRouterData } from 'src/router/router';

import { urlToList } from '../_utils/pathTools';

function getBreadcrumb(breadcrumbNameMap: IRouterData, url: string) {
  let breadcrumb = breadcrumbNameMap[url];
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach(item => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item];
      }
    });
  }
  return breadcrumb || {};
}

function getRoutesFromLocation(routerLocation: Location, breadcrumbNameMap: IRouterData) {
  const pathSnippets = urlToList(routerLocation.pathname);
  const routes = pathSnippets
    // .map((url, index) => {
    .map((url /* , index */) => {
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
      // const isLinkable = index !== pathSnippets.length - 1 && currentBreadcrumb.component;
      return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb
        ? {
            // path: isLinkable ? url : undefined,
            path: url,
            breadcrumbName: currentBreadcrumb.name,
          }
        : null;
    })
    .filter(item => item);
  routes.unshift({
    path: '/',
    breadcrumbName: '首页',
  });
  return routes;
}

function itemRender(route: Route, _: any, routes: Route[]) {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link to={route.path}>{route.breadcrumbName}</Link>
  );
}

const MyPageHeader = (props: PageHeaderProps) => {
  const { breadcrumb, ...restProps } = props;
  const { global } = useContext(StoreContext);
  let pageHeader = (
    <PageHeader
      breadcrumb={{
        routes: getRoutesFromLocation(global.location, global.breadcrumbNameMap),
        itemRender,
      }}
      {...restProps}
    />
  );
  if (breadcrumb) {
    pageHeader = <PageHeader breadcrumb={breadcrumb} {...restProps} />;
  }
  return <div style={{ margin: '-24px -24px 24px' }}>{pageHeader}</div>;
};

export default observer(MyPageHeader);
