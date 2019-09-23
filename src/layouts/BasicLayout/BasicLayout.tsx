import React, { useEffect, Fragment } from 'react';
import { Layout, Icon } from 'antd';
import { Route, Redirect, Switch, RedirectProps } from 'react-router-dom';
import enquireJs from 'enquire.js';
import { Location } from 'history';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';

import { RouteComponentProps } from 'src/declares/Component';
import { IRouterData } from 'src/router/router';
import { CurrentUser } from 'src/stores/UserStore';
import { IMenuItem } from 'src/router/menu';

import GlobalHeader from 'src/components/GlobalHeader';
import GlobalFooter from 'src/components/GlobalFooter';
import SiderMenu from 'src/components/SiderMenu';
import NotFound from 'src/pages/Exception/404';
import Authorized from 'src/utils/Authorized';

import { getRoutes } from 'src/utils/utils';

const { AuthorizedRoute } = Authorized;

const mobileQuery = 'only screen and (max-width: 767.99px)';
const { Content, Header, Footer } = Layout;

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

interface QueryHandle {
  match?(): void;
  unmatch?(): void;
}

interface BasicLayoutProps extends RouteComponentProps {
  mobileQueryHandle: QueryHandle;
  updateLocation: (location: Location) => void;
  updateRouterData: (routerData: IRouterData) => void;
  fetchCurrentUser: () => void;
  pageTitle: string;
  globalCopyright: string;
  currentUser: CurrentUser;
  redirectData: RedirectProps[];
  menuData: IMenuItem[];
  isMobile: boolean;
  collapsed: boolean;
  handleMenuCollapse: (isCollapsed: boolean) => void;
  handleMenuClick: ({ key }: { key: string }) => void;
}

export function BasicLayout(props: BasicLayoutProps) {
  const {
    location,
    routerData,
    match,
    mobileQueryHandle,
    updateLocation,
    updateRouterData,
    fetchCurrentUser,
    currentUser,
    menuData,
    isMobile,
    redirectData,
    globalCopyright,
    collapsed,
    pageTitle,
    handleMenuCollapse,
    handleMenuClick,
  } = props;

  useEffect(() => {
    enquireJs.register(mobileQuery, mobileQueryHandle);

    return function clearHandler() {
      enquireJs.unregister(mobileQuery, mobileQueryHandle);
    };
  }, [mobileQueryHandle]);

  useEffect(() => {
    updateLocation(location);
  }, [updateLocation, location]);

  useEffect(() => {
    updateRouterData(routerData);
  }, [updateRouterData, routerData]);

  useEffect(() => {
    /* 获取用户信息 */
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const layout = (
    <Layout>
      <SiderMenu
        // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
        Authorized={Authorized}
        menuData={menuData}
        collapsed={collapsed}
        location={location}
        isMobile={isMobile}
        onCollapse={handleMenuCollapse}
      />
      <Layout>
        <Header style={{ padding: 0 }}>
          <GlobalHeader
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
            <Redirect exact from="/" to="/welcome" />
            <Route render={NotFound} />
          </Switch>
        </Content>
        <Footer style={{ padding: 0 }}>
          <GlobalFooter
            copyright={
              <Fragment>
                Copyright <Icon type="copyright" /> {globalCopyright}
              </Fragment>
            }
          />
        </Footer>
      </Layout>
    </Layout>
  );

  return (
    <DocumentTitle title={pageTitle}>
      <ContainerQuery query={query}>
        {params => <div className={classNames(params)}>{layout}</div>}
      </ContainerQuery>
    </DocumentTitle>
  );
}
