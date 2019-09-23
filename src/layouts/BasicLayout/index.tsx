import React from 'react';
import { observer } from 'mobx-react-lite';
import { Location } from 'history';
import { RedirectProps } from 'react-router-dom';

import { IFactory, RouteComponentProps } from 'src/declares/Component';
import { UserPresenter } from 'src/stores/UserStore';
import { GlobalPresenter } from 'src/stores/GlobalStore';
import { history } from 'src/utils/history';
import { IRouterData } from 'src/router/router';
import { getMenuData, IMenuItem } from 'src/router/menu';

import { BasicLayoutPresenter, BasicLayoutStore } from './BasicLayoutPresenter';
import { BasicLayout } from './BasicLayout';

const createBasicLayout: IFactory = ({ store, service }) => {
  const { user: userStore, global: globalStore } = store;
  const basicLayoutStore = new BasicLayoutStore(false);
  const userPresenter = new UserPresenter(service.user);
  const redirectData: RedirectProps[] = [];
  const menuData = getMenuData();
  const getRedirect = (item: IMenuItem) => {
    if (item && item.children) {
      if (item.children[0] && item.children[0].path) {
        redirectData.push({
          from: `${item.path}`,
          to: `${item.children[0].path}`,
        });
        item.children.forEach(children => {
          getRedirect(children);
        });
      }
    }
  };
  menuData.forEach(getRedirect);

  const handleMenuCollapse = (isCollapsed: boolean) => {
    BasicLayoutPresenter.setCollapsed(basicLayoutStore, isCollapsed);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      userPresenter.logout(history);
    }
  };

  const queryMobile = (mobile: boolean) => {
    GlobalPresenter.setIsMobile(globalStore, mobile);
  };

  const mobileQueryHandle = {
    match: () => queryMobile(true),
    unmatch: () => queryMobile(false),
  };

  const updateLocation = (location: Location) => {
    GlobalPresenter.setLocation(globalStore, location);
  };

  const updateRouterData = (routerData: IRouterData) => {
    GlobalPresenter.setRouterData(globalStore, routerData);
  };

  const fetchCurrentUser = () => {
    userPresenter.fetchCurrentUser(userStore, history);
  };

  return observer((props: RouteComponentProps) => (
    <BasicLayout
      {...props}
      mobileQueryHandle={mobileQueryHandle}
      updateLocation={updateLocation}
      updateRouterData={updateRouterData}
      fetchCurrentUser={fetchCurrentUser}
      pageTitle={globalStore.pageTitle}
      currentUser={userStore.currentUser}
      redirectData={redirectData}
      isMobile={globalStore.isMobile}
      globalCopyright={globalStore.globalCopyright}
      collapsed={basicLayoutStore.collapsed}
      menuData={menuData}
      handleMenuCollapse={handleMenuCollapse}
      handleMenuClick={handleMenuClick}
    />
  ));
};

export default createBasicLayout;
