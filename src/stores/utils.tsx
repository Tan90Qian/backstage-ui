import React, { SFC, useContext } from 'react';
import { observer } from 'mobx-react-lite';

import StoreContext from './index';

export default function withStore(Component: SFC) {
  return observer(function HOC(props: any) {
    const store = useContext(StoreContext);
    return <Component {...props} store={store} />;
  });
}
