import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { notification } from 'antd';

import baseRequest, { history } from 'src/utils/request';
import { IResponseData, Code } from 'src/declares/Request';

import { doLogout } from './_utils';

interface IRequest {
  (url: string, params?: AxiosRequestConfig): Promise<IResponseData>;
}

// 刨除response body之外的字段，可随意扩充（如判断是否登录、有无权限等通用逻辑）
function transformData(response: AxiosResponse<IResponseData>): IResponseData | Promise<any> {
  const { data, config } = response;
  const { code } = data;
  if (code === Code.未登录) {
    const { url } = config;
    notification.error({
      message: `请求错误 ${code}: ${url}`,
      description: '未登录或无权限',
    });
    doLogout(history);
    return Promise.reject();
  }
  return data;
}

function catchError() {
  return {};
}

export const request: IRequest = (url, params) => {
  return baseRequest(url, params)
    .then(transformData)
    .catch(catchError);
};
