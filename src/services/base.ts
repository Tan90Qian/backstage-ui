import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { notification } from 'antd';

import baseRequest, { history } from 'src/utils/request';
import { IResponseData } from 'src/declares/Request';

import { doLogout } from './_utils';

interface IRequest {
  (url: string, params?: AxiosRequestConfig): Promise<IResponseData>;
}

function transformData(response: AxiosResponse<IResponseData>): IResponseData | Promise<any> {
  const { data, config } = response;
  const { code } = data;
  if (!code) return data;
  if (code === -1) {
    const { url } = config;
    notification.error({
      message: `请求错误 ${code}: ${url}`,
      description: '未登录或无权限',
    });
    doLogout(history);
  }
  return Promise.reject();
}

function catchError() {
  return {};
}

export const request: IRequest = (url, params) => {
  return baseRequest(url, params)
    .then(transformData)
    .catch(catchError);
};
