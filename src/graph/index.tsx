import './index.less';

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export interface GraphProps {
  width: number;
  height: number;
  nodes: Node[];
  edges: Edge[];
}

export interface Node extends d3.SimulationNodeDatum {
  id: string;
}

export interface Edge {
  source: string;
  target: string;
}

export const Graph: React.FC<GraphProps> = ({
  width,
  height,
  nodes,
  edges,
}) => {
  const ref = useRef<SVGSVGElement>();

  useEffect(() => {
    if (nodes && edges && ref.current) {
      const svg = d3.select(ref.current);

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
        .force('center', d3.forceCenter(width / 2, height / 2).strength(1.5));

      const link = svg.selectAll('line').data(edges).join('line');

      const node = svg.selectAll('g.node').data(nodes).call(drag(simulation));

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
  }, [nodes, edges]);

  return (
    <>
      <svg className="d3-component" width={width} height={height} ref={ref}>
        {edges.map((edge, i) => (
          <line key={i} stroke="black" />
        ))}
        {nodes.map((node) => (
          <g key={node.id} className="node">
            <circle r="30" fill="red" />
            <text>{node.id}</text>
          </g>
        ))}
      </svg>
    </>
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
