import ReactDOM from 'react-dom';

import RouterConfig from './router';
import SetupMock from '../mock';

import './index.less';

const useProxy = process.env.PROXY === 'true';

if (useProxy) {
  SetupMock();
}

ReactDOM.render(RouterConfig(), document.getElementById('root'));
