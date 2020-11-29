import React, { useEffect, useRef } from 'react';

import { Edge } from './types';
import { useEdgeMutation } from './simulation';

export interface DomainEdgeProps {
  edge: Edge;
}

export const DomainEdge: React.FC<DomainEdgeProps> = ({ edge }) => {
  const line = useRef<SVGLineElement>();
  useEdgeMutation(edge.id, ({ x1, y1, x2, y2 }) => {
    if (line.current) {
      line.current.setAttribute('x1', `${x1}`);
      line.current.setAttribute('y1', `${y1}`);
      line.current.setAttribute('x2', `${x2}`);
      line.current.setAttribute('y2', `${y2}`);
    }
  });

  return <line ref={line} id={edge.id} className="edge" stroke="black" />;
};
