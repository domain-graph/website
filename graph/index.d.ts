import './index.less';
import React from 'react';
import { Edge, Node } from './types';
export interface GraphProps {
    width: number;
    height: number;
    nodes: Node[];
    edges: Edge[];
}
export declare const Graph: React.FC<GraphProps>;
