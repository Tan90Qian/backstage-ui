import React, { FormEvent, useState, FunctionComponentElement } from 'react';
import { Form, Input, Icon, Button, Tabs, message } from 'antd';
import { InputProps } from 'antd/lib/input';
import { WrappedFormInternalProps } from 'antd/lib/form/Form';

import { RouteComponentProps } from 'src/declares/Component';
import { setAuthority } from 'src/utils/authority';
import { reloadAuthorized } from 'src/utils/Authorized';
import { getPageQuery } from 'src/utils/utils';
import { login } from 'src/services/user';
import styles from './Login.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

interface ComponentProps extends WrappedFormInternalProps, RouteComponentProps {}

const InputDefaultProps: InputProps = {
  size: 'large',
  prefix: <Icon type="user" className={styles.prefixIcon} />,
};

function Login(props: ComponentProps): FunctionComponentElement<HTMLElement> {
  const { form, history } = props;
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
            console.log('res', res);
            setSubmitting(false);
            const {
              code,
              data: { authority },
            } = res.data;
            if (code === 0) {
              setAuthority(authority);
              reloadAuthorized();
              const urlParams = new URL(window.location.href);
              const params = getPageQuery();
              let { redirect } = params;
              if (redirect) {
                const redirectUrlParams = new URL(redirect);
                if (redirectUrlParams.origin === urlParams.origin) {
                  redirect = redirect.substr(urlParams.origin.length + urlParams.pathname.length);
                  if (redirect.startsWith('#')) {
                    redirect = redirect.substr(1);
                  } else if (redirect.startsWith('/#')) {
                    redirect = redirect.substr(2);
                  }
                } else {
                  window.location.href = redirect;
                  return;
                }
              }
              history.replace(redirect || '/');
            }
          })
          .catch(error => {
            console.log('error', error);
            message.error(error.data.msg || '提交失败');
            setSubmitting(false);
          });
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
