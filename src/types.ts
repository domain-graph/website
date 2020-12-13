export type Node = {
  id: string;
};

export type Edge = {
  id: string;
  name: string;
  source: string;
  target: string;
  plurality: 'single' | 'array';
  optional: boolean;
  heuristic?: string;
};
