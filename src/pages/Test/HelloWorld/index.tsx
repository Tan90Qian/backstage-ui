import React from 'react';
import { observer } from 'mobx-react-lite';

import { HelloWorld } from './HelloWorld';

export default function createHelloWorld() {
  return observer(() => <HelloWorld />);
}
