import React from 'react';
import { render } from 'react-dom';

import { buildInfo } from './build-info';
import { Router } from './pages/router';

console.log(JSON.stringify(buildInfo, null, 2));

render(<Router />, document.getElementById('app-root'));

// Hot Module Replacement API
if (module['hot']) {
  module['hot'].accept();
}
