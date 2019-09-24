import { observable, action, computed } from 'mobx';
import { message } from 'antd';
import { History } from 'history';

import { BodyCode } from 'src/declares/Request';
import { UserService } from 'src/services/user';
import { doLogout } from 'src/services/_utils';

export interface CurrentUser {
  name: string;
  avatar?: string;
}

export class UserPresenter {
  service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }

  @action
  setCurrentUser(store: UserStore, currentUser: CurrentUser) {
    store.currentUser = currentUser;
  }

  @action
  async fetchCurrentUser(store: UserStore, history: History) {
    const res = await this.service.getCurrentUser();
    const { code, data, message: msg } = res;
    if (code === BodyCode.success) {
      const { name } = data;
      this.setCurrentUser(store, { name });
    } else {
      message.error(msg || '无法获取用户信息');
      doLogout(history);
    }
  }

  @action
  async logout(history: History) {
    const res = await this.service.logout();
    try {
      if (res.code === BodyCode.success) {
        doLogout(history);
      }
    } catch (e) {
      message.error(e);
    }
  }
}

export class UserStore {
  @observable currentUser: CurrentUser;

  @computed get userName() {
    return this.currentUser && this.currentUser.name;
  }

  static instance: UserStore;
}

UserStore.instance = new UserStore();
