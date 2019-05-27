import React, { FormEvent, useState, FunctionComponentElement } from 'react';
import { Form, Input, Icon, Button, Tabs } from 'antd';
import { InputProps } from 'antd/lib/input';

import styles from './Login.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

const InputDefaultProps: InputProps = {
  size: 'large',
  prefix: <Icon type="user" className={styles.prefixIcon} />,
};

export default function Login(): FunctionComponentElement<HTMLElement> {
  const [type, setType] = useState('account');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    console.log(userName, password);
  };

  const onSwitch = (newType: string): void => {
    setType(newType);
  };

  return (
    <div className={styles.main}>
      <Form onSubmit={handleSubmit}>
        <Tabs animated={false} className={styles.tabs} activeKey={type} onChange={onSwitch}>
          <TabPane tab="账号密码登录" key="account">
            <FormItem required>
              <Input
                {...InputDefaultProps}
                value={userName}
                onChange={({ target }) => setUserName(target.value)}
                placeholder="请输入用户名"
              />
            </FormItem>
            <FormItem required>
              <Input
                {...InputDefaultProps}
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder="请输入密码"
                type="password"
              />
            </FormItem>
          </TabPane>
        </Tabs>

        <FormItem>
          <Button
            size="large"
            className={styles.submit}
            type="primary"
            htmlType="submit"
            // loading={submitting}
          >
            登录
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}
