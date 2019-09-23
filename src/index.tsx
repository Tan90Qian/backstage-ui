import React from 'react';
import ReactDOM from 'react-dom';

import { request } from './services/base';
import { UserService } from './services/user';

import StoreContext, { stores } from './stores';

import RouterConfig from './router';
import SetupMock from '../mock';

import './index.less';

const useMock = process.env.MOCK === 'true';

if (useMock) {
  SetupMock();
}

const userService = new UserService(request);
const service = {
  user: userService,
};

ReactDOM.render(
  <StoreContext.Provider value={stores}>{RouterConfig(service, stores)}</StoreContext.Provider>,
  document.getElementById('root')
);
