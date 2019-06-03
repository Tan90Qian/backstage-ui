import { authorityType } from 'src/components/Authorized/utils';

export interface IMenuItem {
  name: string;
  path: string;
  icon?: string;
  hideInMenu?: boolean;
  hideInBreadcrumb?: boolean;
  authority?: authorityType;
  children?: IMenuItem[];
  target?: string;
  key?: string;
}

const menuData: IMenuItem[] = [
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    hideInMenu: true,
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    hideInMenu: true,
    children: [
      {
        name: '登录',
        path: 'login',
      },
    ],
  },
];

export const getMenuData = (): IMenuItem[] => {
  return menuData;
};
