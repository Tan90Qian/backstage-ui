import ReactDOM from 'react-dom';

import RouterConfig from './router';
import SetupMock from '../mock';

import './index.less';

const noProxy = process.env.NO_PROXY === 'true';

if (!noProxy) {
  SetupMock();
}

ReactDOM.render(RouterConfig(), document.getElementById('root'));
