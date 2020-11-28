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

  useSimulation(visibleNodes, visibleEdges);

  return (
    <>
      <SvgCanvas>
        {visibleEdges.map((edge) => (
          <line key={edge.id} id={edge.id} className="edge" stroke="black" />
        ))}
        {visibleNodes.map((node) => (
          <DomainObject
            key={node.id}
            onHide={() => setIsHidden(node.id, true)}
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

export interface DomainObjectProps {
  node: Node;
  onHide: (node: Node) => void;
}

export const DomainObject: React.FC<DomainObjectProps> = React.memo(
  ({ node, onHide }) => {
    const handleClick = useCallback(
      (e: React.MouseEvent<SVGTextElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        onHide(node);
      },
      [node, onHide],
    );
    return (
      <g className="node" id={node.id}>
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
