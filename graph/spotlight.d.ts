import './spotlight.less';
import React from 'react';
import { Edge, Node } from '../graph/types';
export interface SpotlightProps {
    source: Node | null;
    edge: Edge | null;
    target: Node | null;
    onSelectEdge(edgeId: string): void;
}
export declare const Spotlight: React.FC<SpotlightProps>;
