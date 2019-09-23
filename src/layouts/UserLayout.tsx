import React, { Fragment, useEffect } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import { Location } from 'history';
import { Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { observer } from 'mobx-react-lite';

import { GlobalPresenter } from 'src/stores/GlobalStore';

import { IRouterData } from 'src/router/router';

import GlobalFooter from 'src/components/GlobalFooter';
import { IFactory, RouteComponentProps } from 'src/declares/Component';

import { getRoutes, getPageQuery, getQueryPath, IRouteItem } from 'src/utils/utils';
import styles from './UserLayout.less';

function getLoginPathWithRedirectPath(): string {
  const params = getPageQuery();
  const { redirect } = params;
  return getQueryPath('/user/login', {
    redirect,
  });
}

interface UserLayoutProps extends RouteComponentProps {
  pageTitle: string;
  globalTitle: string;
  globalCopyright: string;
  updateLocation: (location: Location) => void;
  updateRouterData: (routerData: IRouterData) => void;
}

function UserLayout({
  match,
  routerData,
  location,
  globalCopyright,
  pageTitle = '',
  globalTitle,
  updateLocation,
  updateRouterData,
}: UserLayoutProps) {
  useEffect(() => {
    updateLocation(location);
  }, [updateLocation, location]);

  useEffect(() => {
    updateRouterData(routerData);
  }, [updateRouterData, routerData]);

  const copyright = (
    <Fragment>
      Copyright <Icon type="copyright" /> {globalCopyright}
    </Fragment>
  );

  return (
    <DocumentTitle title={pageTitle}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <span className={styles.title}>{globalTitle}</span>
              </Link>
            </div>
          </div>
          <Switch>
            {getRoutes(match.path, routerData).map((item: IRouteItem) => (
              <Route
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
              />
            ))}
            <Redirect from="/user" to={getLoginPathWithRedirectPath()} />
          </Switch>
        </div>
        <GlobalFooter copyright={copyright} />
      </div>
    </DocumentTitle>
  );
}

const createUserLayout: IFactory = ({ store }) => {
  const { global: globalStore } = store;

  const updateLocation = (location: Location) => {
    GlobalPresenter.setLocation(globalStore, location);
  };

  const updateRouterData = (routerData: IRouterData) => {
    GlobalPresenter.setRouterData(globalStore, routerData);
  };

  return observer((props: RouteComponentProps) => (
    <UserLayout
      {...props}
      pageTitle={globalStore.pageTitle}
      globalCopyright={globalStore.globalCopyright}
      globalTitle={globalStore.globalTitle}
      updateLocation={updateLocation}
      updateRouterData={updateRouterData}
    />
  ));
};

export default createUserLayout;
