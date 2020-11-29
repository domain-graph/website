import * as d3 from 'd3';

export interface Node extends d3.SimulationNodeDatum {
  id: string;
  fixed?: boolean;
}

export interface Edge {
  id: string;
  name: string;
  source: string;
  target: string;
}
