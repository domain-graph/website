import * as d3 from 'd3';

export interface Node extends d3.SimulationNodeDatum {
  id: string;
}

export interface Edge {
  source: string;
  target: string;
}
