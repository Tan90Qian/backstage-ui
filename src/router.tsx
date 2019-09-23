import React, { FunctionComponentElement } from 'react';

import { Router, Route, Switch } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import Authorized from './utils/Authorized';
import { history } from './utils/history';
import { getQueryPath } from './utils/utils';
import { getRouterData } from './router/router';
import { IService, IStore } from './declares/Component';

const { AuthorizedRoute } = Authorized;

function RouterConfig(
  service: IService,
  store: IStore
): FunctionComponentElement<React.ComponentClass> {
  const routerData = getRouterData(service, store);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
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
