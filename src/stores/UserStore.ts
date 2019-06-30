import { observable, action, runInAction, computed, configure } from 'mobx';
import { message } from 'antd';

import { Code } from 'src/declares/Request';
import { getCurrentUser } from 'src/services/user';
import { doLogout } from 'src/services/_utils';
import { history } from 'src/utils/history';

configure({ enforceActions: 'always' });

export interface CurrentUser {
  name: string;
  avatar?: string;
}

export class UserStore {
  @observable currentUser: CurrentUser;

  @computed get userName() {
    return this.currentUser && this.currentUser.name;
  }

  @action
  async fetchCurrentUser() {
    const res = await getCurrentUser();
    const { code, data, msg } = res;
    if (code === Code.成功) {
      const { name } = data;
      runInAction(() => {
        this.currentUser = {
          name,
        };
      });
    } else {
      message.error(msg || '无法获取用户信息');
      doLogout(history);
    }
  }
}

const userStore = new UserStore();

export default userStore;
