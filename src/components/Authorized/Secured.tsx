import React from 'react';
import Exception from '../Exception/index';
import CheckPermissions from './CheckPermissions';
import { authorityType, IReactComponent } from './utils';

export interface Secured {
  (authority: authorityType, error?: React.ReactNode): (target: IReactComponent) => IReactComponent;
}

/**
 * 默认不能访问任何页面
 * default is "NULL"
 */
const Exception403 = () => <Exception type="403" style={{ minHeight: 500, height: '80%' }} />;

/**
 * 用于判断是否拥有权限访问此view权限
 * authority 支持传入  string ,funtion:()=>boolean
 */
const authorize: Secured = (authority, error) => {
  /**
   * conversion into a class
   * 防止传入字符串时找不到staticContext造成报错
   * String parameters can cause staticContext not found error
   */
  let classError: any = false;
  if (error) {
    classError = () => error;
  }
  if (!authority) {
    throw new Error('authority is required');
  }
  return function decideAuthority(target) {
    return CheckPermissions(authority, target, classError || Exception403);
  };
};

export default authorize;
