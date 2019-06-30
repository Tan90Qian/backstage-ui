// 定义服务端接口格式
export interface IResponseData<D = any> {
  code: Code;
  msg: string;
  data: D;
}

export enum Code {
  未登录 = -1,
  失败 = 1,
  成功 = 0,
}
