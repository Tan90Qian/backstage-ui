import React from 'react';
import { RouteProps } from 'react-router';
import { Route, Redirect } from 'react-router-dom';
import Authorized from './Authorized';

import { authorityType } from './utils';

export interface AuthorizedRouteProps extends RouteProps {
  authority: authorityType;
  redirectPath: string;
}
export type AuthorizedRoute = React.SFC<AuthorizedRouteProps>;

const AuthorizedRoute: AuthorizedRoute = (props: AuthorizedRouteProps) => {
  const { component: Component, render, authority, redirectPath, ...rest } = props;
  return (
    <Authorized
      authority={authority}
      noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />}
    >
      <Route
        {...rest}
        render={childProps => (Component ? <Component {...childProps} /> : render(childProps))}
      />
    </Authorized>
  );
};

export default AuthorizedRoute;
