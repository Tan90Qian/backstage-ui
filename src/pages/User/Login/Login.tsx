import React, { FormEvent } from 'react';
import { Form, Input, Icon, Button, Tabs } from 'antd';
import { InputProps } from 'antd/lib/input';
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';

import styles from './Login.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

const InputDefaultProps: InputProps = {
  size: 'large',
  prefix: <Icon type="user" className={styles.prefixIcon} />,
};

export interface OnSubmit {
  (e: FormEvent, form: WrappedFormUtils): void;
}

export interface LoginProps extends FormComponentProps {
  activeKey: string;
  submitting: boolean;
  onSubmit: OnSubmit;
  onTabsChange: (key: string) => void;
}

export function Login(props: LoginProps) {
  const { form, onTabsChange, onSubmit, activeKey, submitting } = props;
  const { getFieldDecorator } = form;

  return (
    <div className={styles.main}>
      <Form onSubmit={e => onSubmit(e, form)}>
        <Tabs
          animated={false}
          className={styles.tabs}
          activeKey={activeKey}
          onChange={onTabsChange}
        >
          <TabPane tab="账号密码登录" key="account">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [
                  {
                    required: true,
                    message: '用户名不能为空',
                  },
                ],
              })(<Input {...InputDefaultProps} placeholder="请输入用户名" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '密码不能为空',
                  },
                ],
              })(<Input {...InputDefaultProps} placeholder="请输入密码" type="password" />)}
            </FormItem>
          </TabPane>
        </Tabs>

        <FormItem>
          <Button
            size="large"
            className={styles.submit}
            type="primary"
            htmlType="submit"
            loading={submitting}
          >
            登录
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}
