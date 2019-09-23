import React from 'react';
import { PageHeader } from 'antd';
import { observer } from 'mobx-react-lite';

export default function createWelcome() {
  return observer(() => <PageHeader title="欢迎使用Backstage-ui" />);
}
