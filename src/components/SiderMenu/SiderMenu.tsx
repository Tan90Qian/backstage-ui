import React, { FunctionComponent, useState, useEffect } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Location } from 'history';
import { IconComponent, IconProps } from 'antd/lib/icon';
import pathToRegexp from 'path-to-regexp';
import { Link } from 'react-router-dom';

import { IMenuItem } from 'src/router/menu';
import { AuthorizedType } from '../Authorized';

import styles from './index.less';
import { urlToList } from '../_utils/pathTools';
import { authorityType } from '../Authorized/utils';

const { Sider } = Layout;
const { SubMenu } = Menu;

type Logo = string | IconComponent<IconProps>;

interface HandleCollapse {
  (isCollapsed: boolean): void;
}

export interface SiderMenuProps {
  logo: string;
  Authorized: AuthorizedType;
  menuData: IMenuItem[];
  collapsed: boolean;
  isMobile: boolean;
  location: Location<any>;
  onCollapse: HandleCollapse;
}

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon: Logo) => {
  if (typeof icon === 'string') {
    if (icon.indexOf('http') === 0) {
      return <img src={icon} alt="icon" className={`${styles.icon} sider-menu-item-img`} />;
    }
    return <Icon type={icon} />;
  }

  return icon;
};

// Recursively flatten the data
export const getFlatMenuKeys = (menu: IMenuItem[]): string[] =>
  menu.reduce((keys, item) => {
    keys.push(item.path);
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children));
    }
    return keys;
  }, []);

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (flatMenuKeys: string[], paths: string[]): string[] =>
  paths.reduce(
    (matchKeys, path) =>
      matchKeys.concat(flatMenuKeys.filter(item => pathToRegexp(item).test(path))),
    []
  );

// 转化路径
function conversionPath(path: string) {
  if (path && path.indexOf('http') === 0) {
    return path;
  }
  return `/${path || ''}`.replace(/\/+/g, '/');
}

const SiderMenu: FunctionComponent<SiderMenuProps> = (props: SiderMenuProps) => {
  const { location, menuData, isMobile, onCollapse, Authorized, collapsed, logo } = props;
  const { pathname } = location;
  const [flatMenuKeys, setFlatMenuKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);

  // 验证权限，权限不足时该项不显示
  function checkPermissionItem(authority: authorityType, ItemDom: any) {
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  }

  function getSubMenuOrItem(item: IMenuItem) {
    if (item.children && item.children.some(child => !!child.name)) {
      const childrenItems = getNavMenuItems(item.children);
      // 当子菜单为空时不展示菜单
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    }
    // 当无子菜单时展示菜单项
    return <Menu.Item key={item.path}>{getMenuItemPath(item)}</Menu.Item>;
  }

  // 获取可展示的子菜单列表
  function getNavMenuItems(menusData: IMenuItem[]): IMenuItem[] {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // 递归处理
        const ItemDom = getSubMenuOrItem(item);
        return checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  }

  function isMainMenu(key: string) {
    return menuData.some(item => key && (item.key === key || item.path === key));
  }

  function getMenuItemPath(item: IMenuItem) {
    const itemPath = conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse(true);
              }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  }

  function handleOpenChange(newOpenKeys: string[]) {
    const lastOpenKey = newOpenKeys[newOpenKeys.length - 1];
    const moreThanOne = newOpenKeys.filter(openKey => isMainMenu(openKey)).length > 1;
    setOpenKeys(moreThanOne ? [lastOpenKey] : [...newOpenKeys]);
  }

  useEffect(() => {
    setFlatMenuKeys(getFlatMenuKeys(menuData));
  }, [menuData]);

  useEffect(() => {
    setOpenKeys(getMenuMatchKeys(flatMenuKeys, urlToList(pathname)));
  }, [flatMenuKeys, pathname]);

  // Don't show popup menu when it is been collapsed
  const menuProps = collapsed
    ? {}
    : {
        openKeys,
      };
  // if pathname can't match, use the nearest parent's key
  let selectedKeys = getMenuMatchKeys(flatMenuKeys, urlToList(pathname));
  if (!selectedKeys.length) {
    selectedKeys = [openKeys[openKeys.length - 1]];
  }
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      onCollapse={onCollapse}
      width={256}
      className={styles.sider}
    >
      <div className={styles.logo} key="logo">
        <Link to="/">
          <img src={logo} alt="logo" />
          <h1>管理后台</h1>
        </Link>
      </div>
      <Menu
        key="Menu"
        theme="dark"
        mode="inline"
        {...menuProps}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={{ padding: '16px 0', width: '100%' }}
      >
        {getNavMenuItems(menuData)}
      </Menu>
    </Sider>
  );
};

export default SiderMenu;
