import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Edge, Node } from './types';

export function useSimulation(
  nodes: Node[],
  edges: Edge[],
): React.Ref<SVGSVGElement> {
  const [svg, setSvg] = useState<SVGSVGElement>();
  const ref = useCallback((el: SVGSVGElement) => {
    setSvg(el);
function useStableClone<TItem, TClone extends TItem>(
  items: TItem[],
  compare: (a: TItem, b: TItem & Partial<Omit<TClone, keyof TItem>>) => boolean,
): (TItem & Partial<Omit<TClone, keyof TItem>>)[] {
  type C = TItem & Partial<Omit<TClone, keyof TItem>>;

  const [clonedNodes, setClonedNodes] = useState<C[]>(
    items.map((item) => ({ ...item })),
  );

  const compareFn = useRef(compare);
  useEffect(() => {
    compareFn.current = compare;
  }, [compare]);

  useEffect(() => {
    setClonedNodes((prev) =>
      items.map((nextNode) => {
        const prevNode = prev.find((n) => compareFn.current(nextNode, n));

        if (prevNode) {
          for (const key of Object.keys(nextNode)) {
            prevNode[key] = nextNode[key];
          }
          return prevNode;
        } else {
          return { ...nextNode };
        }
      }),
    );
  }, [items]);

  return clonedNodes;
}

export function useSimulation(
  nodes: Node[],
  edges: Edge[],
  onNodeMove: (values: { id: string; x: number; y: number }) => void,
  onEdgeMove: (values: {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }) => void,
): void {
  const [svg, setSvg] = useState(d3.select('svg'));

  useEffect(() => {
    setSvg(d3.select('svg'));
  }, []);

  const handleNodeMove = useRef(onNodeMove);
  useEffect(() => {
    handleNodeMove.current = onNodeMove;
  }, [onNodeMove]);

  const handleEdgeMove = useRef(onEdgeMove);
  useEffect(() => {
    handleEdgeMove.current = onEdgeMove;
  }, [onEdgeMove]);

  const clonedNodes = useStableClone(nodes, (a, b) => a.id === b.id);
  const clonedEdges = useStableClone(edges, (a, b) => a.id === b.id);

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
          handleEdgeMove.current({
            id: d.id,
            x1: d.source.x,
            y1: d.source.y,
            x2: d.target.x,
            y2: d.target.y,
          });
        });

        node.each((d) => {
          handleNodeMove.current({ id: d.id, x: d.x, y: d.y });
        });
      });
    }
  }, [clonedNodes, clonedEdges, svg]);
}

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
