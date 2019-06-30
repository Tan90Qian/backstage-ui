import React from 'react';
import ReactDOM from 'react-dom';

import RouterConfig from './router';
import SetupMock from '../mock';
import StoreContext, { stores } from './stores';

import './index.less';

const useMock = process.env.MOCK === 'true';

if (useMock) {
  SetupMock();
}

ReactDOM.render(
  <StoreContext.Provider value={stores}>{RouterConfig()}</StoreContext.Provider>,
  document.getElementById('root')
);
