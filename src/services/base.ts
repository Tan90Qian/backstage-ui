import { AxiosResponse, AxiosRequestConfig } from 'axios';

import baseRequest from 'src/utils/request';
import { IResponseData } from 'src/declares/Request';

interface IRequest {
  (url: string, params?: AxiosRequestConfig): Promise<IResponseData>;
}

// 刨除response body之外的字段，可随意扩充（如判断是否登录、有无权限等通用逻辑）
function transformData(response: AxiosResponse<IResponseData>): IResponseData | Promise<any> {
  const { data } = response;
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
