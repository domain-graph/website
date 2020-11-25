import { useEffect } from 'react';
import * as d3 from 'd3';
import { Edge, Node } from './types';

export function useSimulation(
  svg: SVGSVGElement,
  nodes: Node[],
  edges: Edge[],
): void {
  useEffect(() => {
    if (nodes && edges && svg) {
      const selector = d3.select(svg);

      const simulation = d3
        .forceSimulation<Node, Edge>(nodes)
        .force(
          'link',
          d3
            .forceLink<Node, Edge>(edges)
            .id((d) => d.id)
            .distance(120),
        )
        .force('charge', d3.forceManyBody().strength(-500).distanceMax(150))
        .force('center', d3.forceCenter(0, 0).strength(1.5));

      const link = selector.selectAll('line.edge').data(edges).join('line');

      const node = selector
        .selectAll('g.node')
        .data(nodes)
        .call(drag(simulation));

      simulation.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node.attr('transform', (d) => {
          const n = 10.0;
          const x = Math.floor(d.x * n) / n;
          const y = Math.floor(d.y * n) / n;

          return `translate(${x},${y})`;
        });
      });
    }
  }, [svg, nodes, edges]);
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
