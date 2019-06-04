import React, { useState, useEffect, useContext } from 'react';
import pathToRegexp from 'path-to-regexp';
import { PageHeader } from 'antd';
import { PageHeaderProps } from 'antd/lib/page-header';
import { Location } from 'history';

import { IRouterData } from 'src/router/router';
import { breadcrumbContext } from 'src/context/basicContext';

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
    .map((url, index) => {
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
      const isLinkable = index !== pathSnippets.length - 1 && currentBreadcrumb.component;
      return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb
        ? {
            path: isLinkable ? url : undefined,
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

const MyPageHeader = (props: PageHeaderProps) => {
  const { breadcrumb, ...restProps } = props;
  const { breadcrumbNameMap, location } = useContext(breadcrumbContext);
  const [routes, setRoutes] = useState([]);
  useEffect(() => {
    setRoutes(getRoutesFromLocation(location, breadcrumbNameMap));
  }, [location, breadcrumbNameMap]);
  let pageHeader = <PageHeader breadcrumb={{ routes }} {...restProps} />;
  if (breadcrumb) {
    pageHeader = <PageHeader breadcrumb={breadcrumb} {...restProps} />;
  }
  return <div style={{ margin: '-24px -24px 0' }}>{pageHeader}</div>;
};

export default MyPageHeader;
