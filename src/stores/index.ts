import React from 'react';

import global from './GlobalStore';
import user from './UserStore';

export const stores = {
  user,
  global,
};

const StoreContext = React.createContext(stores);
export default StoreContext;
