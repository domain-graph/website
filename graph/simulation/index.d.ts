import React from 'react';
import { EdgeGroup, Node } from '../types';
export declare function useNodeMutation(nodeId: string, onChange: NodeMutation): void;
export interface NodeMutationSubscriber {
    (nodeId: string, mutation: NodeMutation): void;
}
export interface NodeMutation {
    (event: 'dragstart' | 'dragend' | 'drag' | 'tick', location: {
        x: number;
        y: number;
    }): void;
}
export declare function useEdgeMutation(edgeId: string, onChange: EdgeMutation): void;
export interface EdgeMutationSubscriber {
    (edgeId: string, mutation: EdgeMutation): void;
}
export interface EdgeMutation {
    (change: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }): void;
}
export declare const Simulation: React.FC<{
    nodes: Node[];
    edges: EdgeGroup[];
}>;
