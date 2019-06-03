import React from 'react';
import { Location } from 'history';
import { IRouterData } from 'src/router/router';

const isMobileContext = React.createContext(false);

interface Breadcrumb {
  breadcrumbNameMap: IRouterData;
  location: Location<any>;
}

const defaultBreadcrumb: Breadcrumb = {
  breadcrumbNameMap: {},
  location: null,
};

const breadcrumbContext = React.createContext(defaultBreadcrumb);

export { isMobileContext, breadcrumbContext };
