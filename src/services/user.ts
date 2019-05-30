import request from 'src/utils/request';

export async function getCurrentUser() {
  return request('/Api/User/currentUser');
}
