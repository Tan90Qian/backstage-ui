import React, { FormEvent, useState } from 'react';
import { Form, Input, Icon, Button, Tabs } from 'antd';
import { InputProps } from 'antd/lib/input';

import styles from './Login.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

const usernameDefaultProps: InputProps = {
  size: 'large',
  prefix: <Icon type="user" className={styles.prefixIcon} />,
};

function Login(): JSX.Element {
  const [type, setType] = useState('account');

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
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
              <Input {...usernameDefaultProps} placeholder="请输入用户名" />
            </FormItem>
            <FormItem required>
              <Input {...usernameDefaultProps} placeholder="请输入密码" type="password" />
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

export default Login;
