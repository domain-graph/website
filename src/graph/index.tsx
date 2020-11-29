import './index.less';

import React, { useCallback, useMemo, useState } from 'react';

import { SvgCanvas } from '../svg-canvas';
import { Edge, Node } from './types';
import { DomainObject } from './domain-object';
import { DomainEdge } from './domain-edge';
import { Simulation } from './simulation';
import Eye from '../icons/eye';

export interface GraphProps {
  width: number;
  height: number;
  nodes: Node[];
  edges: Edge[];
}

type Hidable<T> = T & { isHidden: boolean };

export const Graph: React.FC<GraphProps> = ({ nodes, edges }) => {
  // const [visibleNodes, setVisibleNodes] = useState(nodes);
  // const [visibleEdges, setVisibleEdges] = useState(edges);
  // const [hiddenNodes, setHiddenNodes] = useState<Node[]>([]);
  // const [hiddenEdges, setHiddenEdges] = useState<Edge[]>([]);

  const [allNodes, setAllNodes] = useState<Hidable<Node>[]>(
    nodes.map((node) => ({ ...node, isHidden: false })),
  );
  const [allEdges, setAllEdges] = useState<Hidable<Edge>[]>(
    edges.map((edge) => ({ ...edge, isHidden: false })),
  );

  const visibleNodes = useMemo(
    () => allNodes.filter((node) => !node.isHidden),
    [allNodes],
  );

  const hiddenNodes = useMemo(() => allNodes.filter((node) => node.isHidden), [
    allNodes,
  ]);

  const visibleEdges = useMemo(
    () =>
      allEdges.filter(
        (edge) =>
          allNodes.find((node) => node.id === edge.source)?.isHidden ===
            false &&
          allNodes.find((node) => node.id === edge.target)?.isHidden === false,
      ),
    [allNodes, allEdges],
  );

  const setIsHidden = useCallback((nodeId: string, isHidden: boolean) => {
    console.log(isHidden ? 'hide' : 'show', nodeId);

    setAllNodes((prev) =>
      prev.some((node) => node.id === nodeId)
        ? prev.map((node) =>
            node.id === nodeId ? { ...node, isHidden } : node,
          )
        : prev,
    );
  }, []);

  return (
    <Simulation nodes={visibleNodes} edges={visibleEdges}>
      <SvgCanvas>
        <g>
          {visibleEdges.map((edge) => (
            <DomainEdge key={edge.id} edge={edge} />
          ))}
        </g>
        <g>
          {visibleNodes.map((node) => (
            <DomainObject
              key={node.id}
              onHide={() => setIsHidden(node.id, true)}
              node={node}
            />
          ))}
        </g>
      </SvgCanvas>
      <ul className="hidden-nodes">
        {hiddenNodes.map((node) => (
          <li key={node.id}>
            <button onClick={() => setIsHidden(node.id, false)}>
              <Eye />
            </button>
            <span>{node.id}</span>
          </li>
        ))}
      </ul>
    </Simulation>
  );
};
