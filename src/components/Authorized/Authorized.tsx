import React from 'react';
import CheckPermissions, { Check } from './CheckPermissions';

import { authorityType } from './utils';
import { Secured } from './Secured';
import { AuthorizedRoute } from './AuthorizedRoute';

interface AuthorizedProps {
  authority: authorityType;
  noMatch?: any;
  children?: any;
}

class Authorized extends React.Component<AuthorizedProps, any> {
  static Secured: Secured;

  static AuthorizedRoute: AuthorizedRoute;

  static check: Check;

  render() {
    const { children, authority, noMatch = null } = this.props;
    return CheckPermissions(authority, children, noMatch);
  }
}

export default Authorized;
