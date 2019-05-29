import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

export interface IGlobalFooterProps {
  className?: string[] | string;
  links?: {
    key?: string;
    title: React.ReactNode;
    href: string;
    blankTarget?: boolean;
  }[];
  copyright?: React.ReactNode;
  style?: React.CSSProperties;
}

const GlobalFooter = ({ className, links, copyright }: IGlobalFooterProps) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <div className={clsString}>
      {links && (
        <div className={styles.links}>
          {links.map(link => (
            <a key={link.key} target={link.blankTarget ? '_blank' : '_self'} href={link.href}>
              {link.title}
            </a>
          ))}
        </div>
      )}
      {copyright && <div className={styles.copyright}>{copyright}</div>}
    </div>
  );
};

export default GlobalFooter;
