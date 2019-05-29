import { CURRENT } from './renderAuthorize';

import { authorityType, IReactComponent } from './utils';

export interface Check {
  (authority: authorityType, target: IReactComponent, Exception: IReactComponent): IReactComponent;
}

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定  } authority
 * @param { 你的权限 } currentAuthority
 * @param { 通过的组件  } target
 * @param { 未通过的组件  } Exception
 */
const checkPermissions = (
  authority: authorityType,
  currentAuthority: string,
  target: IReactComponent,
  Exception: IReactComponent
) => {
  // 没有判定权限.默认查看所有
  // Retirement authority, return target;
  if (!authority) {
    return target;
  }
  // 数组处理
  if (Array.isArray(authority)) {
    if (authority.indexOf(currentAuthority) >= 0) {
      return target;
    }
    if (Array.isArray(currentAuthority)) {
      for (let i = 0; i < currentAuthority.length; i += 1) {
        const element = currentAuthority[i];
        if (authority.indexOf(element) >= 0) {
          return target;
        }
      }
    }
    return Exception;
  }

  // string 处理
  if (typeof authority === 'string') {
    if (authority === currentAuthority) {
      return target;
    }
    if (Array.isArray(currentAuthority)) {
      for (let i = 0; i < currentAuthority.length; i += 1) {
        const element = currentAuthority[i];
        if (authority.indexOf(element) >= 0) {
          return target;
        }
      }
    }
    return Exception;
  }

  // Function 处理
  if (typeof authority === 'function') {
    try {
      const bool = authority(currentAuthority);
      if (bool) {
        return target;
      }
      return Exception;
    } catch (error) {
      throw error;
    }
  }
  throw new Error('unsupported parameters');
};

export { checkPermissions };

const check: Check = (authority, target, Exception) => {
  return checkPermissions(authority, CURRENT, target, Exception);
};

export default check;
