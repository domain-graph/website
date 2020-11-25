import './index.less';

import React from 'react';

import { SvgCanvas, useSvgCanvas } from './svg-canvas';
import { Edge, Node } from './types';
import { useSimulation } from './use-simulation';

export interface GraphProps {
  width: number;
  height: number;
  nodes: Node[];
  edges: Edge[];
}

const GraphGuts: React.FC<GraphProps> = ({ width, height, nodes, edges }) => {
  const svg = useSvgCanvas();
  useSimulation(svg, nodes, edges);

  return (
    <>
      <line
        x1="0"
        x2="0"
        y1="-10000"
        y2="10000"
        stroke="gray"
        strokeWidth="1"
      />
      <line
        y1="0"
        y2="0"
        x1="-10000"
        x2="10000"
        stroke="gray"
        strokeWidth="1"
      />
      {edges.map((edge, i) => (
        <line key={i} className="edge" stroke="black" />
      ))}
      {nodes.map((node) => (
        <g key={node.id} className="node">
          <circle r="30" fill="red" />
          <text>{node.id}</text>
        </g>
      ))}
    </>
  );
};

export const Graph: React.FC<GraphProps> = (props) => {
  return (
    <SvgCanvas>
      <GraphGuts {...props} />
    </SvgCanvas>
  );
};
