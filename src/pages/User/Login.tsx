import React, { FormEvent, useState, FunctionComponentElement } from 'react';
import { Form, Input, Icon, Button, Tabs, message } from 'antd';
import { InputProps } from 'antd/lib/input';
import { WrappedFormInternalProps } from 'antd/lib/form/Form';

import { RouteComponentProps } from 'src/declares/Component';
import { Code } from 'src/declares/Request';
import { setAuthority, AuthorityType } from 'src/utils/authority';
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
    if (e) e.preventDefault();
    validateFields({ force: true }, async (err, value) => {
      if (!err) {
        setSubmitting(true);
        const res = await login(value);
        setSubmitting(false);
        const { code } = res;
        if (code === Code.成功) {
          message.success(res.msg || '登录成功');
          setAuthority(AuthorityType.user);
          reloadAuthorized();
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
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
        } else {
          message.error(res.msg || '提交失败');
        }
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

export default Form.create()(Login);
