import * as React from 'react';
import { RouteProps } from 'react-router';

type authorityFN = (currentAuthority?: string) => boolean;

type authority = string | string[] | authorityFN | Promise<any>;

export type IReactComponent<P = any> =
  | React.StatelessComponent<P>
  | React.ComponentClass<P>
  | React.ClassicComponentClass<P>;

interface Secured {
  (authority: authority, error?: React.ReactNode): <T extends IReactComponent>(target: T) => T;
}

export interface AuthorizedRouteProps extends RouteProps {
  authority: authority;
}
export type AuthorizedRoute = React.SFC<AuthorizedRouteProps>;

interface Check {
  <T extends IReactComponent, S extends IReactComponent>(
    authority: authority,
    target: T,
    Exception: S
  ): T | S;
}

interface AuthorizedProps {
  authority: authority;
  noMatch?: React.ReactNode;
}

export class Authorized extends React.Component<AuthorizedProps, any> {
  public static Secured: Secured;

  public static AuthorizedRoute: AuthorizedRoute;

  public static check: Check;
}

declare function renderAuthorize(currentAuthority: string): typeof Authorized;

export default renderAuthorize;
