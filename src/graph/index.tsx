import './index.less';

import React, { useCallback, useMemo, useState } from 'react';

import { SvgCanvas } from '../svg-canvas';
import { Edge, EdgeGroup, Node } from './types';
import { DomainObject } from './domain-object';
import { DomainEdge } from './domain-edge';
import { Simulation } from './simulation';
import Eye from '../icons/eye';
import { NodePicker } from './node-picker';

export interface GraphProps {
  width: number;
  height: number;
  nodes: Node[];
  edges: Edge[];
}

export const Graph: React.FC<GraphProps> = ({ nodes, edges }) => {
  const [allNodes, setAllNodes] = useState<Node[]>(
    nodes.map((node) => ({ ...node, isHidden: true })),
  );

  const handleHideAll = useCallback(() => {
    setAllNodes((prev) => prev.map((node) => ({ ...node, isHidden: true })));
  }, []);

  const handleHideUnpinned = useCallback(() => {
    setAllNodes((prev) =>
      prev.map((node) => (node.fixed ? node : { ...node, isHidden: true })),
    );
  }, []);

  const allEdges: EdgeGroup[] = useMemo(() => {
    const index = edges.reduce<{ [id: string]: EdgeGroup }>((acc, edge) => {
      const { id, source, target, ...rest } = edge;

      const forwardId = `${source}>${target}`;
      const reverseId = `${target}>${source}`;
      const group = acc[forwardId] || acc[reverseId];

      if (group) {
        const e: EdgeGroup['edges'][number] = rest;
        if (group.id === reverseId) e.reverse = true;
        return { ...acc, [group.id]: { ...group, edges: [...group.edges, e] } };
      } else {
        const e: EdgeGroup['edges'][number] = rest;
        const g: EdgeGroup = {
          id: forwardId,
          source,
          target,
          edges: [e],
        };
        return {
          ...acc,
          [forwardId]: g,
        };
      }
    }, {});

    return Object.keys(index).map((key) => index[key]);
  }, [edges]);

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
          // TODO: support self-reference
          edge.source !== edge.target &&
          allNodes.find((node) => node.id === edge.source)?.isHidden ===
            false &&
          allNodes.find((node) => node.id === edge.target)?.isHidden === false,
      ),
    [allNodes, allEdges],
  );

  const setIsHidden = useCallback((nodeId: string, isHidden: boolean) => {
    setAllNodes((prev) =>
      prev.some((node) => node.id === nodeId)
        ? prev.map((node) =>
            node.id === nodeId ? { ...node, isHidden, fixed: false } : node,
          )
        : prev,
    );
  }, []);

  const setIsPinned = useCallback((nodeId: string, isPinned: boolean) => {
    setAllNodes((prev) =>
      prev.some((node) => node.id === nodeId)
        ? prev.map((node) =>
            node.id === nodeId ? { ...node, fixed: isPinned } : node,
          )
        : prev,
    );
  }, []);

  const handleExpand = useCallback(
    (nodeId: string) => {
      console.log('expand', nodeId);
      setAllNodes((prev) => {
        const nodeIds = allEdges
          .filter((edge) => edge.source === nodeId || edge.target === nodeId)
          .reduce<Set<string>>((acc, edge) => {
            if (edge.source !== nodeId) acc.add(edge.source);
            if (edge.target !== nodeId) acc.add(edge.target);
            return acc;
          }, new Set());

        if (
          nodeIds.size &&
          prev.some((node) => nodeIds.has(node.id) && node.isHidden)
        ) {
          return prev.some((node) => nodeIds.has(node.id))
            ? prev.map((node) =>
                nodeIds.has(node.id) && node.isHidden
                  ? { ...node, isHidden: false, fixed: false }
                  : node,
              )
            : prev;
        } else {
          return prev;
        }
      });
    },
    [allEdges],
  );

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
              onPin={(id) => setIsPinned(id, true)}
              onUnpin={(id) => setIsPinned(id, false)}
              onHide={(id) => setIsHidden(id, true)}
              onExpand={handleExpand}
              node={node}
            />
          ))}
        </g>
      </SvgCanvas>
      <NodePicker
        nodes={allNodes}
        onShow={(id) => {
          console.log('show', id);
          setIsHidden(id, false);
        }}
        onHide={(id) => {
          console.log('hide', id);
          setIsHidden(id, true);
        }}
        onHideAll={handleHideAll}
        onHideUnpinned={handleHideUnpinned}
      />
    </Simulation>
  );
};
