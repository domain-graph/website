import './index.less';

import React from 'react';
import { render } from 'react-dom';
import { App } from './app';

import { buildInfo } from './build-info';

console.log(JSON.stringify(buildInfo, null, 2));

render(<App />, document.getElementById('app-root'));

// Hot Module Replacement API
if (module['hot']) {
  module['hot'].accept();
}
