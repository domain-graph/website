import React, { useCallback, useEffect, useRef } from 'react';

import { Node } from './types';

export interface Data {
  x: number;
  y: number;
}

export interface DomainObjectDataFunction {
  (data: Data): void;
}

export interface DomainObjectProps {
  node: Node;
  onHide: (id: string) => void;
  onReady: (id: string, dataFn: DomainObjectDataFunction) => void;
}

export const DomainObject: React.FC<DomainObjectProps> = React.memo(
  ({ node, onHide, onReady }) => {
    const g = useRef<SVGGElement>();
    useEffect(() => {
      onReady(node.id, ({ x, y }: Data) => {
        if (g.current) {
          g.current.setAttribute('transform', `translate(${x} ${y})`);
        }
      });
    }, [onReady, node.id]);

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
