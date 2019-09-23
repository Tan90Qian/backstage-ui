import { IResponseData } from 'src/declares/Request';
import { IRequest } from './base';

export interface LoginParams {
  userName: string;
  password: string;
}

export class UserService {
  engine: IRequest;

  constructor(engine: IRequest) {
    this.engine = engine;
  }

  async login(params: LoginParams) {
    return this.engine('/Api/User/login', {
      method: 'post',
      data: params,
    });
  }

  async logout() {
    return this.engine('/Api/User/logout');
  }

  async getCurrentUser(): Promise<IResponseData<CurrentUser>> {
    return this.engine('/Api/User/currentUser');
  }
}

interface CurrentUser {
  name: string;
}
