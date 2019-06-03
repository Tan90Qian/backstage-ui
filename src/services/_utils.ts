import { History } from 'history';
import { stringify } from 'qs';

import { setAuthority } from 'src/utils/authority';
import { reloadAuthorized } from 'src/utils/Authorized';

export function doLogout(history: History<any>) {
  localStorage.removeItem('Atoken');
  setAuthority('guest');
  reloadAuthorized();
  history.push({
    pathname: '/user/login',
    search: stringify({
      redirect: window.location.href,
    }),
  });
}
