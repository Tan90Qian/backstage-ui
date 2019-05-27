import React from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import DocumentTitle from 'react-document-title';

import { IRouteComponentProps } from 'src/declares/RouteComponent';

import { getRoutes, getPageQuery, getQueryPath, IRouteItem } from 'src/utils/utils';
import styles from './UserLayout.less';

function getLoginPathWithRedirectPath(): string {
  const params = getPageQuery();
  const { redirect } = params;
  return getQueryPath('/user/login', {
    redirect,
  });
}

export default function UerLayout({
  routerData,
  location,
  match,
}: IRouteComponentProps): JSX.Element {
  function getPageTitle(): string {
    const { pathname } = location;
    let title = '管理后台';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 管理后台`;
    }
    return title;
  }

  return (
    <DocumentTitle title={getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <span className={styles.title}>管理后台</span>
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
      </div>
    </DocumentTitle>
  );
}
