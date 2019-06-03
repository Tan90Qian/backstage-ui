import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import DocumentTitle from 'react-document-title';

import { RouteComponentProps } from 'src/declares/Component';

import { getRoutes, getPageQuery, getQueryPath, IRouteItem } from 'src/utils/utils';

function getLoginPathWithRedirectPath(): string {
  const params = getPageQuery();
  const { redirect } = params;
  return getQueryPath('/demo/spike1', {
    redirect,
  });
}

export default function DemoLayout({
  routerData,
  location,
  match,
}: RouteComponentProps): React.FunctionComponentElement<DocumentTitle> {
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
      <Switch>
        {getRoutes(match.path, routerData).map((item: IRouteItem) => (
          <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
        ))}
        <Redirect from="/demo" to={getLoginPathWithRedirectPath()} />
      </Switch>
    </DocumentTitle>
  );
}
