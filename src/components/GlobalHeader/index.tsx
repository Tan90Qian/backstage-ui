import React, { useEffect, FunctionComponentElement } from 'react';
import { Menu, Icon, Spin, Dropdown, Divider } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import Debounce from 'lodash/debounce';
import { Link } from 'react-router-dom';

import { CurrentUser } from 'src/stores/UserStore';

import styles from './index.less';
import { HandleCollapse } from '../SiderMenu/SiderMenu';

interface GlobalHeaderProps {
  collapsed: boolean;
  onCollapse: HandleCollapse;
  currentUser: CurrentUser;
  isMobile: boolean;
  logo?: string;
  onMenuClick: (param: ClickParam) => void;
}

const triggerResizeEvent = Debounce(() => {
  const event = document.createEvent('HTMLEvents');
  event.initEvent('resize', true, false);
  window.dispatchEvent(event);
}, 600);

export default function GlobalHeader(
  props: GlobalHeaderProps
): FunctionComponentElement<HTMLElement> {
  const { currentUser, collapsed, isMobile, logo, onMenuClick } = props;

  function toggle() {
    const { onCollapse } = props;
    onCollapse(!collapsed);
    triggerResizeEvent();
  }

  useEffect(() => {
    return function cleanup() {
      triggerResizeEvent.cancel();
    };
  }, []);

  const menu = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item disabled>
        <Icon type="user" />
        个人中心
      </Menu.Item>
      <Menu.Item disabled>
        <Icon type="setting" />
        设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <Icon type="logout" />
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.header}>
      {isMobile &&
        logo && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
      <Icon
        className={styles.trigger}
        type={collapsed ? 'menu-unfold' : 'menu-fold'}
        onClick={toggle}
      />
      <div className={styles.right}>
        {currentUser && currentUser.name ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              {/* <Avatar size="small" className={styles.avatar} src={currentUser.avatar} /> */}
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8 }} />
        )}
      </div>
    </div>
  );
}
