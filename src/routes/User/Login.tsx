import React, { FormEvent, useState, FunctionComponentElement } from 'react';
import { Form, Input, Icon, Button, Tabs } from 'antd';
import { InputProps } from 'antd/lib/input';
import { WrappedFormInternalProps } from 'antd/lib/form/Form';

import { RouteComponentProps } from 'src/declares/Component';
import { login } from 'src/services/api';
import styles from './Login.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

interface ComponentProps extends WrappedFormInternalProps, RouteComponentProps {}

const InputDefaultProps: InputProps = {
  size: 'large',
  prefix: <Icon type="user" className={styles.prefixIcon} />,
};

function Login(props: ComponentProps): FunctionComponentElement<HTMLElement> {
  const { form } = props;
  const { getFieldDecorator, validateFields } = form;
  const [type, setType] = useState('account');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    validateFields({ force: true }, (err, value) => {
      if (!err) {
        setSubmitting(true);
        login(value)
          .then(res => {
            setSubmitting(false);
            console.log('res', res);
          })
          .catch(error => console.log('error', error));
      }
    });
  };

  const onSwitch = (newType: string): void => {
    setType(newType);
  };

  return (
    <div className={styles.main}>
      <Form onSubmit={handleSubmit}>
        <Tabs animated={false} className={styles.tabs} activeKey={type} onChange={onSwitch}>
          <TabPane tab="账号密码登录" key="account">
            <FormItem>
              {getFieldDecorator('username', {
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

export default Form.create()(Login);
