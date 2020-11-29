import React, { useEffect, useRef } from 'react';

import { Edge } from './types';
import { EdgeMutationSubscriber, useEdgeMutation } from './use-simulation';

export interface DomainEdgeProps {
  edge: Edge;
  subscriber: EdgeMutationSubscriber;
}

export const DomainEdge: React.FC<DomainEdgeProps> = React.memo(
  ({ edge, subscriber }) => {
    const line = useRef<SVGLineElement>();
    useEdgeMutation(edge.id, subscriber, ({ x1, y1, x2, y2 }) => {
      if (line.current) {
        line.current.setAttribute('x1', `${x1}`);
        line.current.setAttribute('y1', `${y1}`);
        line.current.setAttribute('x2', `${x2}`);
        line.current.setAttribute('y2', `${y2}`);
      }
    });

    return <line ref={line} id={edge.id} className="edge" stroke="black" />;
  },
);
DomainEdge.displayName = 'DomainEdge';
