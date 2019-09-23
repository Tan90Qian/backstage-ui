import React from 'react';
import { configure } from 'mobx';

import { GlobalStore } from './GlobalStore';
import { UserStore } from './UserStore';

configure({ enforceActions: 'always' });

const globalStore = new GlobalStore();

export const stores = {
  user: UserStore.instance,
  global: globalStore,
};

const StoreContext = React.createContext(stores);
export default StoreContext;
