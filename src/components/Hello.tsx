import * as React from 'react';
import { Button } from 'antd';

import * as style from './hello.less';

export interface HelloProps {
  compiler: string;
  framework: string;
}

export const Hello = (props: HelloProps): React.FunctionComponentElement<HTMLElement> => {
  const { compiler, framework } = props;
  return (
    <h1 className={style.title}>
      Hello from {compiler} and {framework}!<Button>1</Button>
    </h1>
  );
};
