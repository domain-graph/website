import React, { useEffect, useRef } from 'react';

import { Edge } from './types';

export interface Data {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DomainEdgeDataFunction {
  (data: Data): void;
}

export interface DomainEdgeProps {
  edge: Edge;
  onReady: (id: string, dataFn: DomainEdgeDataFunction) => void;
}

export const DomainEdge: React.FC<DomainEdgeProps> = React.memo(
  ({ edge, onReady }) => {
    const line = useRef<SVGLineElement>();
    useEffect(() => {
      onReady(edge.id, ({ x1, y1, x2, y2 }) => {
        if (line.current) {
          line.current.setAttribute('x1', `${x1}`);
          line.current.setAttribute('y1', `${y1}`);
          line.current.setAttribute('x2', `${x2}`);
          line.current.setAttribute('y2', `${y2}`);
        }
      });
    }, [onReady, edge.id]);

    return <line ref={line} id={edge.id} className="edge" stroke="black" />;
  },
);
DomainEdge.displayName = 'DomainEdge';
