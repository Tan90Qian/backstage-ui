import React, { useContext, Fragment } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import { Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { observer } from 'mobx-react-lite';

import StoreContext from 'src/stores';
import GlobalFooter from 'src/components/GlobalFooter';
import { RouteComponentProps } from 'src/declares/Component';

import { getRoutes, getPageQuery, getQueryPath, IRouteItem } from 'src/utils/utils';
import styles from './UserLayout.less';

function getLoginPathWithRedirectPath(): string {
  const params = getPageQuery();
  const { redirect } = params;
  return getQueryPath('/user/login', {
    redirect,
  });
}

export default observer(function UserLayout({
  routerData,
  location,
  match,
}: RouteComponentProps): React.FunctionComponentElement<DocumentTitle> {
  const { global } = useContext(StoreContext);

  function getPageTitle(): string {
    const { pathname } = location;
    let title = global.globalTitle;
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - ${global.globalTitle}`;
    }
    return title;
  }

  const copyright = (
    <Fragment>
      Copyright <Icon type="copyright" /> {global.globalCopyright}
    </Fragment>
  );

  return (
    <DocumentTitle title={getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <span className={styles.title}>{global.globalTitle}</span>
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
});
