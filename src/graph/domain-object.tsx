import React, { useCallback, useEffect, useRef } from 'react';

import { Node } from './types';
import { useNodeMutation } from './simulation';
import EyeOff from '../icons/eye-off';
import { RectButton } from '../svg-button';

export interface DomainObjectProps {
  node: Node;
  onHide: (id: string) => void;
}

export const DomainObject: React.FC<DomainObjectProps> = ({ node, onHide }) => {
  const handle = useRef<SVGGElement>();
  const controls = useRef<SVGGElement>();
  useNodeMutation(node.id, ({ x, y }) => {
    if (handle.current) {
      handle.current.setAttribute('transform', `translate(${x} ${y})`);
    }
    if (controls.current) {
      controls.current.setAttribute('transform', `translate(${x} ${y})`);
    }
  });

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      onHide(node.id);
    },
    [node, onHide],
  );
  return (
    <g>
      <g ref={handle} className="node" id={node.id}>
        <circle r="30" />
        <text>{node.id}</text>
      </g>
      <g ref={controls}>
        <RectButton x="15" y="-40" width="24" height="24" onClick={handleClick}>
          <rect width="24" height="24" fill="green" />
          <EyeOff size={24} />
        </RectButton>
      </g>
    </g>
  );
};
