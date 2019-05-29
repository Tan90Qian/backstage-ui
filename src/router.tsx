import React, { FunctionComponentElement } from 'react';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { createHashHistory } from 'history';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import { getRouterData } from './common/router';
import { setInterceptorsWithHistory } from './utils/request';

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
          <Route path="/" component={BasicLayout} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
