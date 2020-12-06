import './domain-object.less';

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { Node } from './types';
import { useNodeMutation } from './simulation';
import EyeOff from '../icons/eye-off';
import Lock from '../icons/lock';
import Unlock from '../icons/unlock';
import Info from '../icons/info';
import { CircleButton, RectButton } from '../svg-button';

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

  const [showControls, setShowControls] = useState<boolean | null>(null);

  const handleMouseEnter = useCallback(() => {
    setShowControls(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setShowControls(false);
  }, []);

  return (
    <g
      className={`c-domain-object simulation-node${
        isDragging ? ' dragging' : ''
      }${isPinned ? ' pinned' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <g ref={controls} className={`controls`}>
        <g className={`${showControls ? 'visible' : 'hidden'} control-wheel`}>
          <circle r="50" />
          <MenuItem index={0} of={3} isVisible={showControls}>
            <CircleButton r={16} onClick={handleClickHide}>
              <EyeOff size={16} x={-8} y={-8} />
            </CircleButton>
          </MenuItem>

          <MenuItem index={1} of={3} isVisible={showControls}>
            <CircleButton r={18} onClick={handleClickPin}>
              {node.fixed ? (
                <Lock size={16} x={-8} y={-8} />
              ) : (
                <Unlock size={16} x={-8} y={-8} />
              )}
            </CircleButton>
          </MenuItem>

          <MenuItem index={2} of={3} isVisible={showControls}>
            <CircleButton r={16}>
              <Info size={16} x={-8} y={-8} />
            </CircleButton>
          </MenuItem>
        </g>
      </g>
      <g ref={handle} className="handle" id={node.id}>
        <circle r="30" />
        <text>{node.id}</text>
      </g>
    </g>
  );
};

const MenuItem: React.FC<{ index: number; of: number; isVisible: boolean }> = ({
  index,
  of,
  children,
  isVisible,
}) => {
  const spread = 45;
  const radius = 55;
  const angle = ((of - 1) / 2 - index) * spread;

  const g = useRef<SVGGElement>();

  useLayoutEffect(() => {
    if (isVisible) {
      tween({
        delay: index * 25,
        duration: 75,
        easing: linear,
        tick: (v) => {
          g.current.setAttribute(
            'transform',
            `rotate(${angle}) translate(0 ${-v * radius}) rotate(${-angle})`,
          );
          g.current.setAttribute('opacity', `${v}`);
        },
      });
    } else if (g.current.transform?.baseVal?.numberOfItems) {
      tween({
        delay: index * 25,
        duration: 75,
        easing: linear,
        tick: (v) => {
          g.current.setAttribute(
            'transform',
            `rotate(${angle}) translate(0 ${
              -(1 - v) * radius
            }) rotate(${-angle})`,
          );
          g.current.setAttribute('opacity', `${1 - v}`);
        },
      });
    }
  }, [isVisible, angle, index]);

  return <g ref={g}>{children}</g>;
};

interface TweenOptions {
  delay?: number;
  duration: number;
  easing: (t: number) => number;
  tick: (value: number) => void;
  done?: () => void;
}

function tween({
  delay = 0,
  duration,
  tick,
  done,
  easing,
}: TweenOptions): void {
  setTimeout(() => {
    const start = performance.now();

    const doit = () => {
      requestAnimationFrame(() => {
        const now = performance.now();

        if (now - start > duration) {
          tick(1);
          done?.();
        } else {
          const t = (now - start) / duration;
          tick(easing(t));
          doit();
        }
      });
    };
    doit();
  }, delay);
}

// TODO: create non-linear functions
function linear(t: number) {
  return t;
}
