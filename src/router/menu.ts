import { authorityType } from 'src/components/Authorized/utils';

import { isUrl } from '../utils/utils';

export interface IMenuItem {
  path: string;
  name?: string;
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

function formatter(data: IMenuItem[], parentPath = '/', parentAuthority?: authorityType) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = (): IMenuItem[] => {
  return formatter(menuData);
};
