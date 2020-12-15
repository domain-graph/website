import './domain-edge.less';
import React from 'react';
import { EdgeGroup } from './types';
export interface DomainEdgeProps {
    edge: EdgeGroup;
    selectedEdgeId?: string;
    onSelect: (ids: string) => void;
}
export declare const DomainEdge: React.FC<DomainEdgeProps>;
