import React, { useState, useEffect } from 'react';
import pathToRegexp from 'path-to-regexp';
import { PageHeader } from 'antd';
import { PageHeaderProps } from 'antd/lib/page-header';
import { Location } from 'history';

import { IRouterData } from 'src/router/router';
import { breadcrumbContext } from 'src/context/basicContext';

import { urlToList } from '../_utils/pathTools';

interface MyPageHeaderProps extends PageHeaderProps {
  breadcrumbNameMap: IRouterData;
  location: Location;
}

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

const MyPageHeader = (props: MyPageHeaderProps) => {
  const { location, breadcrumbNameMap, breadcrumb, ...restProps } = props;
  const [routes, setRoutes] = useState([]);
  useEffect(() => {
    setRoutes(getRoutesFromLocation(location, breadcrumbNameMap));
  }, [location, breadcrumbNameMap]);
  if (breadcrumb) {
    return <PageHeader breadcrumb={breadcrumb} {...restProps} />;
  }
  return <PageHeader breadcrumb={{ routes }} {...restProps} />;
};

const PageHeaderWithContext = (props: PageHeaderProps) => {
  return (
    <breadcrumbContext.Consumer>
      {breadcrumb => (
        <div style={{ margin: '-24px -24px 0' }}>
          <MyPageHeader {...breadcrumb} {...props} />
        </div>
      )}
    </breadcrumbContext.Consumer>
  );
};

export default PageHeaderWithContext;
