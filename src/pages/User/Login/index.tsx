import React from 'react';
import { observer } from 'mobx-react-lite';
import { Form } from 'antd';

import { IFactory } from 'src/declares/Component';
import { TabsPresenter, TabsStore } from 'src/stores/base/tabs-presenter';

import { LoginStore, LoginPresenter } from './LoginPresenter';
import { Login, OnSubmit, LoginProps } from './Login';

const tabList = [
  {
    key: 'account',
    tab: '账号密码登录',
  },
];

const createLogin: IFactory = ({ service }) => {
  const { user: userService } = service;
  const loginStore = new LoginStore();
  const tabStore = new TabsStore(tabList, 'account');
  const loginPresenter = new LoginPresenter(userService);

  const handleSubmit: OnSubmit = (e, form) => {
    if (e) e.preventDefault();
    if (form && typeof form.validateFields === 'function') {
      form.validateFields({ force: true }, async (err, value) => {
        if (err) return;
        loginPresenter.login(loginStore, value);
      });
    }
  };

  const handleTabsChange = (key: string) => {
    TabsPresenter.setActiveKey(tabStore, key);
  };

  const FormedLogin = Form.create<LoginProps>()(Login);

  return observer(() => (
    <FormedLogin
      onTabsChange={handleTabsChange}
      onSubmit={handleSubmit}
      activeKey={tabStore.activeKey}
      submitting={loginStore.submitting}
    />
  ));
};

export default createLogin;
