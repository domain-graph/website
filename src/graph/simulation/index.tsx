import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import * as d3 from 'd3';

import { Edge, Node } from '../types';
import { useStableClone } from '../../use-stable-clone';

const context = createContext<{
  nodeSubscriber: NodeMutationSubscriber;
  edgeSubscriber: EdgeMutationSubscriber;
}>(null);

export function useNodeMutation(nodeId: string, onChange: NodeMutation): void {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const subscribe = useContext(context)?.nodeSubscriber;

  useEffect(() => {
    subscribe?.(nodeId, (change) => {
      requestAnimationFrame(() => {
        onChangeRef.current?.(change);
      });
    });
  }, [subscribe, nodeId]);
}

export interface NodeMutationSubscriber {
  (nodeId: string, mutation: NodeMutation): void;
}
export interface NodeMutation {
  (change: { x: number; y: number }): void;
}

export function useEdgeMutation(edgeId: string, onChange: EdgeMutation): void {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const subscribe = useContext(context)?.edgeSubscriber;

  useEffect(() => {
    subscribe?.(edgeId, (change) => {
      requestAnimationFrame(() => {
        onChangeRef.current?.(change);
      });
    });
  }, [subscribe, edgeId]);
}

export interface EdgeMutationSubscriber {
  (edgeId: string, mutation: EdgeMutation): void;
}
export interface EdgeMutation {
  (change: { x1: number; y1: number; x2: number; y2: number }): void;
}

export const Simulation: React.FC<{ nodes: Node[]; edges: Edge[] }> = ({
  nodes,
  edges,
  children,
}) => {
  const [svg, setSvg] = useState(d3.select('svg'));

  useEffect(() => {
    setSvg(d3.select('svg'));
  }, []);

  const clonedNodes = useStableClone(nodes, (a, b) => a.id === b.id);
  const clonedEdges = useStableClone(edges, (a, b) => a.id === b.id);

  const nodeMutations = useRef<{ [id: string]: NodeMutation }>({});
  const nodeSubscriber: NodeMutationSubscriber = useCallback(
    (id: string, dataFn: NodeMutation) => {
      nodeMutations.current[id] = dataFn;
    },
    [],
  );
  const edgeMutations = useRef<{ [id: string]: EdgeMutation }>({});
  const edgeSubscriber: EdgeMutationSubscriber = useCallback(
    (id: string, dataFn: EdgeMutation) => {
      edgeMutations.current[id] = dataFn;
    },
    [],
  );

  // Must be a layout effect because we attach the sim to existing DOM nodes
  useLayoutEffect(() => {
    if (svg && clonedNodes) {
      const simulation = d3
        .forceSimulation<Node, Edge>(clonedNodes)
        .force(
          'link',
          d3
            .forceLink<Node, Edge>(clonedEdges)
            .id((d) => d.id)
            .distance(120),
        )
        .force('charge', d3.forceManyBody().strength(-500).distanceMax(150))
        .force('center', d3.forceCenter(0, 0).strength(1));

      const link = svg.selectAll('line.edge').data(clonedEdges);

      const node = svg
        .selectAll('g.node')
        .data(clonedNodes, function (this: Element, d: any) {
          // eslint-disable-next-line no-invalid-this
          return d ? d.id : this.id;
        });

      node.call(drag(simulation));

      simulation.on('tick', () => {
        link.each((d: any) => {
          edgeMutations.current[d.id]?.({
            x1: d.source.x,
            y1: d.source.y,
            x2: d.target.x,
            y2: d.target.y,
          });
        });

        node.each((d) => {
          nodeMutations.current[d.id]?.({ x: d.x, y: d.y });
        });
      });
    }
  }, [clonedNodes, clonedEdges, svg]);

  return (
    <context.Provider value={{ nodeSubscriber, edgeSubscriber }}>
      {children}
    </context.Provider>
  );
};

function drag(simulation: d3.Simulation<Node, Edge>): any {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3
    .drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
}
