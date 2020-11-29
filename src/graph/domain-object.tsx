import React, { useCallback, useEffect, useRef } from 'react';

import { Node } from './types';
import { useNodeMutation } from './simulation';
import EyeOff from '../icons/eye-off';
import Lock from '../icons/lock';
import Unlock from '../icons/unlock';
import { RectButton } from '../svg-button';

export interface DomainObjectProps {
  node: Node;
  onPin: (id: string) => void;
  onUnpin: (id: string) => void;
  onHide: (id: string) => void;
}

export const DomainObject: React.FC<DomainObjectProps> = ({
  node,
  onPin,
  onUnpin,
  onHide,
}) => {
  const handle = useRef<SVGGElement>();
  const controls = useRef<SVGGElement>();
  useNodeMutation(node.id, (event, { x, y }) => {
    if (event === 'dragstart') {
      onPin(node.id);
    }

    if (handle.current && controls.current && event === 'tick') {
      handle.current.setAttribute('transform', `translate(${x} ${y})`);
      controls.current.setAttribute('transform', `translate(${x} ${y})`);
    }
  });

  const handleClickHide = useCallback(() => {
    onHide(node.id);
  }, [node, onHide]);

  const handleClickPin = useCallback(() => {
    node.fixed ? onUnpin(node.id) : onPin(node.id);
  }, [node, onPin, onUnpin]);

  return (
    <g>
      <g ref={handle} className="node fixed" id={node.id}>
        <circle r="30" />
        <text>{node.id}</text>
      </g>
      <g ref={controls}>
        <RectButton
          x="15"
          y="-40"
          width="24"
          height="24"
          onClick={handleClickHide}
        >
          <rect width="24" height="24" fill="green" />
          <EyeOff size={24} />
        </RectButton>

        <RectButton
          x="-30"
          y="-40"
          width="24"
          height="24"
          onClick={handleClickPin}
        >
          <rect width="24" height="24" fill="green" />
          {node.fixed ? <Lock /> : <Unlock />}
        </RectButton>
      </g>
    </g>
  );
};
