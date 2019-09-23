import React from 'react';
import { configure } from 'mobx';

import { GlobalStore } from './GlobalStore';
import { UserStore } from './UserStore';

configure({ enforceActions: 'always' });

export const stores = {
  user: UserStore.instance,
  global: GlobalStore.instance,
};

const StoreContext = React.createContext(stores);
export default StoreContext;
