import React, { FunctionComponentElement } from 'react';

import { Route, Switch } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import Authorized from './utils/Authorized';
import { Router } from './utils/history';
import { getQueryPath } from './utils/utils';
import { getRouterData } from './router/router';

const { AuthorizedRoute } = Authorized;

function RouterConfig(): FunctionComponentElement<React.ComponentClass> {
  const routerData = getRouterData();
  const UserLayout = routerData['/user'].component;
  const DemoLayout = routerData['/demo'].component;
  const BasicLayout = routerData['/'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <Router>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <Route path="/demo" component={DemoLayout} />
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
