import { Node as RawNode, Edge as RawEdge } from '../tools/convert';

export interface Node extends RawNode {
  fixed?: boolean;
  isHidden?: boolean;
}

export type Edge = RawEdge;

export interface EdgeGroup extends Pick<RawEdge, 'id' | 'source' | 'target'> {
  edges: (Omit<RawEdge, 'id' | 'source' | 'target'> & { reverse?: true })[];
}
