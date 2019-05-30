import request, { AxiosRequestConfig } from 'src/utils/request';

export async function login(params: AxiosRequestConfig) {
  return request('/Api/User/login', {
    method: 'post',
    data: params,
  });
}

export async function logout() {
  return request('/Api/User/logout');
}

export async function getCurrentUser() {
  return request('/Api/User/currentUser');
}
