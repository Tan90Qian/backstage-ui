import { History } from 'history';
import { stringify } from 'qs';

import { setAuthority, getAuthority, AuthorityType } from 'src/utils/authority';
import { reloadAuthorized } from 'src/utils/Authorized';

export function doLogout(history: History<any>) {
  const currentAuthority = getAuthority();
  if (currentAuthority !== AuthorityType.guest) {
    setAuthority(AuthorityType.guest);
    reloadAuthorized();
    history.push({
      pathname: '/user/login',
      search: stringify({
        redirect: window.location.href,
      }),
    });
  }
}
