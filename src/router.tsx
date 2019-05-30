import React, { FunctionComponentElement } from 'react';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { createHashHistory } from 'history';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import Authorized from './utils/Authorized';
import { getQueryPath } from './utils/utils';
import { getRouterData } from './router/router';
import { setInterceptorsWithHistory } from './utils/request';

const { AuthorizedRoute } = Authorized;

function RouterConfig(): FunctionComponentElement<React.ComponentClass> {
  const routerData = getRouterData();
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  setInterceptorsWithHistory(createHashHistory());
  return (
    <LocaleProvider locale={zhCN}>
      <Router>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            authority={['admin', 'user']}
            redirectPath={getQueryPath('/user/login', {
              redirect: window.location.href,
            })}
          />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
