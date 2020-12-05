import React, { useEffect, useLayoutEffect, useRef } from 'react';

import { Edge } from './types';
import { useEdgeMutation } from './simulation';

export interface DomainEdgeProps {
  edge: Edge;
}

export const DomainEdge: React.FC<DomainEdgeProps> = ({ edge }) => {
  const g = useRef<SVGGElement>();
  const paths = useRef<SVGPathElement[]>();
  const handles = useRef<SVGCircleElement[]>();

  useLayoutEffect(() => {
    paths.current = [];
    handles.current = [];

    for (let i = 0; i < g.current.children.length; i++) {
      const item = g.current.children.item(i);

      if (item.tagName === 'path') {
        paths.current.push(g.current.children.item(i) as SVGPathElement);
      } else if (item.tagName === 'circle') {
        handles.current.push(g.current.children.item(i) as SVGCircleElement);
      }
    }
  }, [edge]);

  useEdgeMutation(edge.id, ({ x1, y1, x2, y2 }) => {
    if (g.current && paths.current?.length) {
      const count = paths.current.length;
      const midpoints = getMidPoints(count, 30, x1, y1, x2, y2);

      midpoints.forEach(([xa, ya, x, y], i) => {
        paths.current[i].setAttribute(
          'd',
          `M${x1} ${y1} Q${xa} ${ya} ${x2} ${y2}`,
        );

        handles.current[i].setAttribute('cx', `${x}`);
        handles.current[i].setAttribute('cy', `${y}`);
      });
    }
  });

  return (
    <g id={edge.id} className="edge" ref={g}>
      <path />
      <circle r="3" />
      <path />
      <circle r="3" />
      <path />
      <circle r="3" />
      <path />
      <circle r="3" />
    </g>
  );
};

function getMidPoints(
  count: number,
  spread: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): [number, number, number, number][] {
  const dx = x2 - x1;
  const dy = y2 - y1;

  const xm = (x1 + x2) / 2;
  const ym = (y1 + y2) / 2;

  const l = Math.sqrt(dx * dx + dy * dy);

  const midpoints = [];

  for (let i = 0; i < count; i++) {
    const r = (((count - 1) / 2 - i) * spread) / l;

    const xa = xm - dy * r;
    const ya = ym + dx * r;

    const x = (x1 + x2 + 2 * xa) / 4;
    const y = (y1 + y2 + 2 * ya) / 4;

    midpoints[i] = [xa, ya, x, y];
  }

  return midpoints;
}
