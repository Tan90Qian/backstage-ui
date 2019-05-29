import React, { createElement, SFC } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import config from './typeConfig';
import styles from './index.less';

export interface ExceptionProps {
  type?: '403' | '404' | '500';
  title?: React.ReactNode;
  desc?: React.ReactNode;
  img?: string;
  actions?: React.ReactNode;
  linkElement?: any;
  style?: React.CSSProperties;
  className?: string;
}

const Exception: SFC<ExceptionProps> = ({
  className,
  linkElement = 'a',
  type,
  title,
  desc,
  img,
  actions,
  ...rest
}: ExceptionProps) => {
  const pageType = type in config ? type : '404';
  const clsString = classNames(styles.exception, className);
  return (
    <div className={clsString} {...rest}>
      <div className={styles.imgBlock}>
        <div
          className={styles.imgEle}
          style={{ backgroundImage: `url(${img || config[pageType].img})` }}
        />
      </div>
      <div className={styles.content}>
        <h1>{title || config[pageType].title}</h1>
        <div className={styles.desc}>{desc || config[pageType].desc}</div>
        <div className={styles.actions}>
          {actions ||
            createElement(
              linkElement,
              {
                to: '/',
                href: '/',
              },
              <Button type="primary">返回首页</Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Exception;
