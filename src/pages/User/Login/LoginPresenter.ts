import { observable, action } from 'mobx';
import { message } from 'antd';

import { UserService, LoginParams } from 'src/services/user';
import { BodyCode } from 'src/declares/Request';
import { setAuthority, AuthorityType } from 'src/utils/authority';
import { reloadAuthorized } from 'src/utils/Authorized';
import { history } from 'src/utils/history';
import { getPageQuery } from 'src/utils/utils';

export class LoginStore {
  @observable submitting: boolean;
}

export class LoginPresenter {
  service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }

  @action
  setSubmitting(store: LoginStore, submitting: boolean) {
    store.submitting = submitting;
  }

  @action
  async login(store: LoginStore, payload: LoginParams) {
    this.setSubmitting(store, true);
    try {
      const res = await this.service.login(payload);
      this.setSubmitting(store, false);
      const { code } = res;
      if (code === BodyCode.success) {
        message.success(res.message || '登录成功');
        setAuthority(AuthorityType.user);
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('#')) {
              redirect = redirect.substr(1);
            } else if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        history.replace(redirect || '/');
      } else {
        message.error(res.message || '提交失败');
      }
    } catch (err) {
      this.setSubmitting(store, false);
    }
  }
}
