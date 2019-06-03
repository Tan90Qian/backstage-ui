import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Route, Redirect, Switch, RedirectProps } from 'react-router-dom';
import enquireJs from 'enquire.js';
import pathToRegexp from 'path-to-regexp';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';

import Authorized from 'src/utils/Authorized';
import { getRoutes } from 'src/utils/utils';
import logo from 'src/assets/logo.jpg';

import { logout, getCurrentUser } from 'src/services/user';

import { getMenuData, IMenuItem } from 'src/router/menu';
import GlobalHeader from 'src/components/GlobalHeader';
import GlobalFooter from 'src/components/GlobalFooter';
import SiderMenu from 'src/components/SiderMenu';
import NotFound from 'src/pages/Exception/404';

import { IRouterData, IRouterItem } from 'src/router/router';
import { RouteComponentProps } from 'src/declares/Component';
import { doLogout } from 'src/services/_utils';

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

export default function BasicLayout(
  props: RouteComponentProps
): React.FunctionComponentElement<HTMLElement> {
  const { history, location, match, routerData } = props;

  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [currentUser, setCurrentUser] = useState({});

  function handleMenuCollapse(isCollapsed: boolean) {
    setCollapsed(isCollapsed);
  }

  function handleMenuClick({ key }: { key: string }) {
    if (key === 'logout') {
      logout().then(res => {
        if (res.data.code === 0) {
          doLogout(history);
        }
      });
    }
  }

  useEffect(() => {
    /* 查询是否是移动端（排除iPad） */
    const mobileQuery = 'only screen and (max-width: 767.99px)';
    function querMobile(mobile: boolean) {
      setIsMobile(mobile);
    }
    const handler = {
      match: () => querMobile(true),
      unmatch: () => querMobile(false),
    };

    enquireJs.register(mobileQuery, handler);

    return function clearHandler() {
      enquireJs.unregister(mobileQuery, handler);
    };
  }, []);

  useEffect(() => {
    /* 获取用户信息 */
    getCurrentUser().then(res => {
      const { code, data }: { code: number; data: object } = res.data;
      if (code === 0) {
        setCurrentUser(data);
      } else {
        doLogout(history);
      }
    });
  }, [history]);

  function getPageTitle(): string {
    const { pathname } = location;
    let title = '管理后台';
    let currRouterData: IRouterItem;
    // match params path
    Object.keys(routerData).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    });
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - 管理后台`;
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
        isMobile={isMobile}
        onCollapse={handleMenuCollapse}
      />
      <Layout>
        <Header style={{ padding: 0 }}>
          <GlobalHeader
            logo={logo}
            currentUser={currentUser}
            collapsed={collapsed}
            isMobile={isMobile}
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
            <Redirect exact from="/" to="/exception/403" />
            <Route render={NotFound} />
          </Switch>
        </Content>
        <Footer style={{ padding: 0 }}>
          <GlobalFooter copyright="Copyright" />
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
}
