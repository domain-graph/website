import './index.less';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { SvgCanvas } from '../svg-canvas';
import { Edge, Node } from './types';
import { useSimulation } from './use-simulation';
import { DomainObjectDataFunction, DomainObject } from './domain-object';
import { DomainEdge, DomainEdgeDataFunction } from './domain-edge';

export interface GraphProps {
  width: number;
  height: number;
  nodes: Node[];
  edges: Edge[];
}

type Hidable<T> = T & { isHidden: boolean };

export const Graph: React.FC<GraphProps> = React.memo(({ nodes, edges }) => {
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

  const nodeCallbackIndex = useRef<{ [id: string]: DomainObjectDataFunction }>(
    {},
  );
  const handleNodeReady = useCallback(
    (id: string, dataFn: DomainObjectDataFunction) => {
      nodeCallbackIndex.current[id] = dataFn;
    },
    [],
  );
  const edgeCallbackIndex = useRef<{ [id: string]: DomainEdgeDataFunction }>(
    {},
  );
  const handleEdgeReady = useCallback(
    (id: string, dataFn: DomainEdgeDataFunction) => {
      edgeCallbackIndex.current[id] = dataFn;
    },
    [],
  );

  useSimulation(
    visibleNodes,
    visibleEdges,
    ({ id, x, y }) => {
      nodeCallbackIndex.current[id]?.({ x, y });
    },
    ({ id, x1, y1, x2, y2 }) => {
      edgeCallbackIndex.current[id]?.({ x1, y1, x2, y2 });
    },
  );

  return (
    <>
      <SvgCanvas>
        {visibleEdges.map((edge) => (
          <DomainEdge key={edge.id} edge={edge} onReady={handleEdgeReady} />
        ))}
        {visibleNodes.map((node) => (
          <DomainObject
            key={node.id}
            onHide={() => setIsHidden(node.id, true)}
            onReady={handleNodeReady}
            node={node}
          />
        ))}
      </SvgCanvas>
      <ul className="hidden-nodes">
        {hiddenNodes.map((node) => (
          <li key={node.id}>
            <button onClick={() => setIsHidden(node.id, false)}>Show</button>
            <span>{node.id}</span>
          </li>
        ))}
      </ul>
    </>
  );
});
Graph.displayName = 'Graph';
