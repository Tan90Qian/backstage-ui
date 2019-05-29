import request, { AxiosRequestConfig } from 'src/utils/request';

export async function login(params: AxiosRequestConfig) {
  return request('/Api/Login/login', params);
}
