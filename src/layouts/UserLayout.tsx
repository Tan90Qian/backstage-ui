import React from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import DocumentTitle from 'react-document-title';

import { getPageQuery, getQueryPath } from '../utils/utils';
import Login from '../routes/User/Login';

import styles from './Userlayout.less';

function getLoginPathWithRedirectPath(): string {
  const params = getPageQuery();
  const { redirect } = params;
  return getQueryPath('/user/login', {
    redirect,
  });
}

function getPageTitle(): string {
  const title = '管理后台';
  return title;
}

export default function UerLayout(): JSX.Element {
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
            <Route path="/user/login" component={Login} />
            <Redirect from="/user" to={getLoginPathWithRedirectPath()} />
          </Switch>
        </div>
      </div>
    </DocumentTitle>
  );
}
