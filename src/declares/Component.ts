import { ComponentType } from 'react';
import { RouteComponentProps as ReactRouteComponentProps } from 'react-router';

import { IRouterData } from 'src/router/router';
import { UserStore } from 'src/stores/UserStore';
import { GlobalStore } from 'src/stores/GlobalStore';
import { UserService } from 'src/services/user';

export interface RouteComponentProps extends ReactRouteComponentProps {
  routerData: IRouterData;
}

export interface IService {
  user: UserService;
}

export interface IStore {
  user: UserStore;
  global: GlobalStore;
}

export interface ICallback {
  [callbackName: string]: Function;
}

export interface IFactory {
  ({
    service,
    store,
    callback,
  }: {
    service?: IService;
    store?: IStore;
    callback?: ICallback;
  }): ComponentType;
}
