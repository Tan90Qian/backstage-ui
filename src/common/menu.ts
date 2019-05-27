export interface IMenuItem {
  name: string;
  path: string;
  icon?: string;
  hideInMenu?: boolean;
  hideInBreadcrumb?: boolean;
  children?: IMenuItem[];
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
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
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
