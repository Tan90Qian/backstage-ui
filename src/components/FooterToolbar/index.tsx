import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { isMobileContext } from 'src/context/basicContext';

import styles from './index.less';

interface FooterToolbarWrapperProps {
  children: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

interface FooterToolbarProps extends FooterToolbarWrapperProps {
  isMobile: boolean;
}

const FooterToolbar = (props: FooterToolbarProps) => {
  const { isMobile, children, className, extra, ...restProps } = props;
  const [width, setWidth] = useState(undefined);

  function resizeFooterToolbar() {
    const sider: HTMLElement = document.querySelector('.ant-layout-sider');
    if (sider == null) {
      return;
    }

    const newWidth = isMobile ? null : `calc(100% - ${sider.style.width})`;
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

export default function FooterToolbarWithContext(props: FooterToolbarWrapperProps) {
  return (
    <isMobileContext.Consumer>
      {(isMobile: boolean) => <FooterToolbar isMobile={isMobile} {...props} />}
    </isMobileContext.Consumer>
  );
}
