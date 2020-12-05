import './domain-object.less';

import React, { useCallback, useEffect, useRef, useState } from 'react';

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

  const [isDragging, setIsDragging] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useNodeMutation(node.id, (event, { x, y }) => {
    if (event === 'dragstart') {
      setIsDragging(true);
      onPin(node.id);
      setIsPinned(true);
    } else if (event === 'dragend') {
      setIsDragging(false);
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
    setIsPinned(!node.fixed);
  }, [node, onPin, onUnpin]);

  return (
    <g
      className={`c-domain-object simulation-node${
        isDragging ? ' dragging' : ''
      }${isPinned ? ' pinned' : ''}`}
    >
      <g ref={handle} className="handle" id={node.id}>
        <circle r="30" />
        <text>{node.id}</text>
      </g>
      <g ref={controls} className="controls">
        <RectButton
          x="15"
          y="-40"
          width="24"
          height="24"
          onClick={handleClickHide}
        >
          <rect width="24" height="24" />
          <EyeOff size={24} />
        </RectButton>

        <RectButton
          x="-30"
          y="-40"
          width="24"
          height="24"
          onClick={handleClickPin}
        >
          <rect width="24" height="24" />
          {node.fixed ? <Lock /> : <Unlock />}
        </RectButton>
      </g>
    </g>
  );
};
