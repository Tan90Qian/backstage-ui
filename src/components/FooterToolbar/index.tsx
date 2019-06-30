import React, { useState, useEffect, useContext } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import StoreContext from 'src/stores';

import styles from './index.less';

interface FooterToolbarWrapperProps {
  children: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const FooterToolbar = (props: FooterToolbarWrapperProps) => {
  const { children, className, extra, ...restProps } = props;
  const { global } = useContext(StoreContext);
  const [width, setWidth] = useState(undefined);

  function resizeFooterToolbar() {
    const sider: HTMLElement = document.querySelector('.ant-layout-sider');
    if (sider == null) {
      return;
    }

    const newWidth = global.isMobile ? null : `calc(100% - ${sider.style.width})`;
    if (width !== newWidth) {
      setWidth(width);
    }
  }

  useEffect(() => {
    window.addEventListener('resize', resizeFooterToolbar);
    resizeFooterToolbar();

    return function cleanUp() {
      window.removeEventListener('resize', resizeFooterToolbar);
    };
  });

  return (
    <div className={classNames(className, styles.toolbar)} style={{ width }} {...restProps}>
      <div className={styles.left}>{extra}</div>
      <div className={styles.right}>{children}</div>
    </div>
  );
};

export default FooterToolbar;
