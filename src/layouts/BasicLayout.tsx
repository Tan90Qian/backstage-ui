import React, { useState, useEffect, useContext, Fragment, useCallback } from 'react';
import { Layout, Icon, message } from 'antd';
import { Route, Redirect, Switch, RedirectProps } from 'react-router-dom';
import enquireJs from 'enquire.js';
import pathToRegexp from 'path-to-regexp';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import StoreContext from 'src/stores';
import Authorized from 'src/utils/Authorized';
import { getRoutes } from 'src/utils/utils';
import logo from 'src/assets/logo.jpg';

import { doLogout } from 'src/services/_utils';
import { logout } from 'src/services/user';

import { IRouterData, IRouterItem } from 'src/router/router';
import { getMenuData, IMenuItem } from 'src/router/menu';
import GlobalHeader from 'src/components/GlobalHeader';
import GlobalFooter from 'src/components/GlobalFooter';
import SiderMenu from 'src/components/SiderMenu';
import NotFound from 'src/pages/Exception/404';

import { RouteComponentProps } from 'src/declares/Component';
import { Code } from 'src/declares/Request';

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute } = Authorized;

const redirectData: RedirectProps[] = [];
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
getMenuData().forEach(getRedirect);

const getBreadcrumbNameMap = (menuData: IMenuItem[], routerData: IRouterData): IRouterData => {
  const result: IRouterData = {};
  const childResult: IRouterData = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

export default observer(function BasicLayout(
  props: RouteComponentProps
): React.FunctionComponentElement<HTMLElement> {
  const { history, location, match, routerData } = props;

  const { user, global } = useContext(StoreContext);
  const [collapsed, setCollapsed] = useState(false);

  function handleMenuCollapse(isCollapsed: boolean) {
    setCollapsed(isCollapsed);
  }

  async function handleMenuClick({ key }: { key: string }) {
    if (key === 'logout') {
      const res = await logout();
      try {
        if (res.code === Code.成功) {
          doLogout(history);
        }
      } catch (e) {
        message.error(e);
      }
    }
  }

  const queryMobile = useCallback(
    (mobile: boolean) => {
      global.setIsMobile(mobile);
    },
    [global]
  );

  useEffect(() => {
    /* 查询是否是移动端（排除iPad） */
    const mobileQuery = 'only screen and (max-width: 767.99px)';
    const handler = {
      match: () => queryMobile(true),
      unmatch: () => queryMobile(false),
    };

    enquireJs.register(mobileQuery, handler);

    return function clearHandler() {
      enquireJs.unregister(mobileQuery, handler);
    };
  }, [queryMobile]);

  useEffect(() => {
    global.setLocation(location);
    global.setBreadcrumbNameMap(getBreadcrumbNameMap(getMenuData(), routerData));
  }, [global, location, routerData]);

  useEffect(() => {
    /* 获取用户信息 */
    user.fetchCurrentUser();
  }, [user]);

  function getPageTitle(): string {
    const { pathname } = location;
    let title = global.globalTitle;
    let currRouterData: IRouterItem;
    // match params path
    Object.keys(routerData).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    });
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - ${global.globalTitle}`;
    }
    return title;
  }

  const layout = (
    <Layout>
      <SiderMenu
        logo={logo}
        // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
        Authorized={Authorized}
        menuData={getMenuData()}
        collapsed={collapsed}
        location={location}
        isMobile={global.isMobile}
        onCollapse={handleMenuCollapse}
      />
      <Layout>
        <Header style={{ padding: 0 }}>
          <GlobalHeader
            logo={logo}
            currentUser={user.currentUser}
            collapsed={collapsed}
            isMobile={global.isMobile}
            onCollapse={handleMenuCollapse}
            onMenuClick={handleMenuClick}
          />
        </Header>
        <Content style={{ margin: '24px 24px 0', height: '100%' }}>
          <Switch>
            {redirectData.map(item => (
              <Redirect key={item.from} exact from={item.from} to={item.to} />
            ))}
            {getRoutes(match.path, routerData).map(item => (
              <AuthorizedRoute
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
                authority={item.authority}
                redirectPath="/exception/403"
              />
            ))}
            <Redirect exact from="/" to="/welcome" />
            <Route render={NotFound} />
          </Switch>
        </Content>
        <Footer style={{ padding: 0 }}>
          <GlobalFooter
            copyright={
              <Fragment>
                Copyright <Icon type="copyright" /> {global.globalCopyright}
              </Fragment>
            }
          />
        </Footer>
      </Layout>
    </Layout>
  );

  return (
    <DocumentTitle title={getPageTitle()}>
      <ContainerQuery query={query}>
        {params => <div className={classNames(params)}>{layout}</div>}
      </ContainerQuery>
    </DocumentTitle>
  );
});
