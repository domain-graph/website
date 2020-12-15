import { Node, Edge } from '../../types';
import { Schema } from '../types';
import { TypeHeuristic } from './types';
export declare class GraphFactory {
    constructor(...heuristics: TypeHeuristic[]);
    private readonly heuristics;
    build(schema: Schema): {
        nodes: Node[];
        edges: Edge[];
    };
}
