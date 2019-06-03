import React, { useState, createRef, useEffect, RefObject } from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

export interface IEllipsisProps {
  tooltip?: boolean;
  length?: number;
  lines?: number;
  style?: React.CSSProperties;
  className?: string;
  fullWidthRecognition?: boolean;
  children: string;
}

/* eslint react/no-did-mount-set-state: 0 */
/* eslint no-param-reassign: 0 */

const isSupportLineClamp = document.body.style['webkitLineClamp' as any] !== undefined;

const TooltipOverlayStyle: React.CSSProperties = {
  overflowWrap: 'break-word',
  wordWrap: 'break-word',
};

export const getStrFullLength = (str = '') => {
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1;
    }
    return pre + 2;
  }, 0);
};

interface CutStrByFullLength {
  (str: string, maxLength?: number): string;
}

export const cutStrByFullLength: CutStrByFullLength = (str = '', maxLength) => {
  let showLength = 0;
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1;
    } else {
      showLength += 2;
    }
    if (showLength <= maxLength) {
      return pre + cur;
    }
    return pre;
  }, '');
};

interface EllipsisTextProps {
  text: string;
  length: number;
  tooltip?: boolean;
  fullWidthRecognition?: boolean;
  [otherProp: string]: any;
}

const EllipsisText = ({
  text,
  length,
  tooltip,
  fullWidthRecognition,
  ...other
}: EllipsisTextProps) => {
  const textLength = fullWidthRecognition ? getStrFullLength(text) : text.length;
  if (textLength <= length || length < 0) {
    return <span {...other}>{text}</span>;
  }
  const tail = '...';
  let displayText;
  if (length - tail.length <= 0) {
    displayText = '';
  } else {
    displayText = fullWidthRecognition ? cutStrByFullLength(text, length) : text.slice(0, length);
  }

  if (tooltip) {
    return (
      <Tooltip overlayStyle={TooltipOverlayStyle} title={text}>
        <span>
          {displayText}
          {tail}
        </span>
      </Tooltip>
    );
  }

  return (
    <span {...other}>
      {displayText}
      {tail}
    </span>
  );
};

interface Bisection {
  (th: number, m: number, b: number, e: number, text: string, shadowNode: any): number;
}

const bisection: Bisection = (th, m, b, e, text, shadowNode) => {
  const suffix = '...';
  let mid = m;
  let end = e;
  let begin = b;
  shadowNode.innerHTML = text.substring(0, mid) + suffix;
  let sh = shadowNode.offsetHeight;

  if (sh <= th) {
    shadowNode.innerHTML = text.substring(0, mid + 1) + suffix;
    sh = shadowNode.offsetHeight;
    if (sh > th || mid === begin) {
      return mid;
    }
    begin = mid;
    if (end - begin === 1) {
      mid = 1 + begin;
    } else {
      mid = Math.floor((end - begin) / 2) + begin;
    }
    return bisection(th, mid, begin, end, text, shadowNode);
  }
  if (mid - 1 < 0) {
    return mid;
  }
  shadowNode.innerHTML = text.substring(0, mid - 1) + suffix;
  sh = shadowNode.offsetHeight;
  if (sh <= th) {
    return mid - 1;
  }
  end = mid;
  mid = Math.floor((end - begin) / 2) + begin;
  return bisection(th, mid, begin, end, text, shadowNode);
};

const Ellipsis = (props: IEllipsisProps) => {
  const { children, lines, length, className, tooltip, fullWidthRecognition, ...restProps } = props;
  const [text, setText] = useState('');
  const [targetCount, setTargetCount] = useState(0);

  const root: RefObject<HTMLDivElement> = createRef();
  const content: RefObject<HTMLDivElement> = createRef();
  const node: RefObject<HTMLSpanElement> = createRef();
  const shadow: RefObject<HTMLDivElement> = createRef();
  const shadowChildren: RefObject<HTMLDivElement> = createRef();

  function computeLine() {
    if (lines && !isSupportLineClamp) {
      const newText = shadowChildren.current.innerText;
      const lineHeight = parseInt(getComputedStyle(root.current).lineHeight, 10);
      const targetHeight = lines * lineHeight;
      content.current.style.height = `${targetHeight}px`;
      const totalHeight = shadowChildren.current.offsetHeight;
      const shadowNode = shadow.current.firstChild;

      if (totalHeight <= targetHeight) {
        setText(newText);
        setTargetCount(newText.length);
        return;
      }

      // bisection
      const len = text.length;
      const mid = Math.ceil(len / 2);

      const count = bisection(targetHeight, mid, 0, len, text, shadowNode);

      setText(newText);
      setTargetCount(count);
    }
  }

  useEffect(() => {
    if (node && node.current) {
      computeLine();
    }
  }, [computeLine, lines, node]);

  const cls = classNames(styles.ellipsis, className, {
    [styles.lines]: lines && !isSupportLineClamp,
    [styles.lineClamp]: lines && isSupportLineClamp,
  });

  if (!lines && !length) {
    return (
      <span className={cls} {...restProps}>
        {children}
      </span>
    );
  }

  // length
  if (!lines) {
    return (
      <EllipsisText
        className={cls}
        length={length}
        text={children || ''}
        tooltip={tooltip}
        fullWidthRecognition={fullWidthRecognition}
        {...restProps}
      />
    );
  }

  const id = `antd-pro-ellipsis-${`${new Date().getTime()}${Math.floor(Math.random() * 100)}`}`;

  // support document.body.style.webkitLineClamp
  if (isSupportLineClamp) {
    const style = `#${id}{-webkit-line-clamp:${lines};-webkit-box-orient: vertical;}`;
    return (
      <div id={id} className={cls} {...restProps}>
        <style>{style}</style>
        {tooltip ? (
          <Tooltip overlayStyle={TooltipOverlayStyle} title={children}>
            {children}
          </Tooltip>
        ) : (
          children
        )}
      </div>
    );
  }

  const childNode = (
    <span ref={node}>
      {targetCount > 0 && text.substring(0, targetCount)}
      {targetCount > 0 && targetCount < text.length && '...'}
    </span>
  );

  return (
    <div {...restProps} ref={root} className={cls}>
      <div ref={content}>
        {tooltip ? (
          <Tooltip overlayStyle={TooltipOverlayStyle} title={text}>
            {childNode}
          </Tooltip>
        ) : (
          childNode
        )}
        <div className={styles.shadow} ref={shadowChildren}>
          {children}
        </div>
        <div className={styles.shadow} ref={shadow}>
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
};

export default Ellipsis;
