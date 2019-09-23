import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import Exception from 'src/components/Exception';

export default () =>
  observer(() => (
    <Exception type="403" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
  ));
