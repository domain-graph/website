import React, { useCallback, useEffect, useRef } from 'react';

import { Node } from './types';
import { NodeMutationSubscriber, useNodeMutation } from './use-simulation';

export interface DomainObjectProps {
  node: Node;
  onHide: (id: string) => void;
  subscriber: NodeMutationSubscriber;
}

export const DomainObject: React.FC<DomainObjectProps> = React.memo(
  ({ node, onHide, subscriber }) => {
    const g = useRef<SVGGElement>();
    useNodeMutation(node.id, subscriber, ({ x, y }) => {
      if (g.current) {
        g.current.setAttribute('transform', `translate(${x} ${y})`);
      }
    });

    const handleClick = useCallback(
      (e: React.MouseEvent<SVGTextElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        onHide(node.id);
      },
      [node, onHide],
    );
    return (
      <g ref={g} className="node" id={node.id}>
        <circle r="30" />
        <text>{node.id}</text>
        <text x="15" y="-15" onClick={handleClick}>
          hide
        </text>
      </g>
    );
  },
);
DomainObject.displayName = 'DomainObject';
