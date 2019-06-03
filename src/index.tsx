import ReactDOM from 'react-dom';

import RouterConfig from './router';
import SetupMock from '../mock';

import './index.less';

const useMock = process.env.MOCK === 'true';

if (useMock) {
  SetupMock();
}

ReactDOM.render(RouterConfig(), document.getElementById('root'));
