import { IResponseData } from 'src/declares/Request';
import { request } from './base';

interface LoginParams {
  userName: string;
  password: string;
}

export async function login(params: LoginParams) {
  return request('/Api/User/login', {
    method: 'post',
    data: params,
  });
}

export async function logout() {
  return request('/Api/User/logout');
}

interface CurrentUser {
  name: string;
}

export async function getCurrentUser(): Promise<IResponseData<CurrentUser>> {
  return request('/Api/User/currentUser');
}
