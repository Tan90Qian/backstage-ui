// 定义服务端接口格式
export interface IResponseData<D = any> {
  code: BodyCode;
  message: string;
  data: D;
}

export enum BodyCode {
  notLogin = -1,
  failed = 0,
  success = 1,
  catchedError = -99,
}
