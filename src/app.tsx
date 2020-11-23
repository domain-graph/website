import React, { useMemo } from 'react';

import edges from '../data/links.json';
import nodes from '../data/nodes.json';

console.log({ nodes, edges });

import { Graph } from './graph';

export const App: React.FC<{}> = () => {
  const randomNumber = useMemo(() => Math.random(), []);
  return (
    <>
      Hello from React!
      <h1>Random number: {randomNumber}</h1>
      <Graph width={1200} height={800} edges={edges} nodes={nodes} />
    </>
  );
};
