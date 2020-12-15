import { Schema } from '../../types';
import { TypeHeuristic, TypeHeuristicResult } from '../types';
export declare function get(heuristics: TypeHeuristic[], schema: Schema): {
    byIgnoredTypeName: (typeName: string) => TypeHeuristicResult | undefined;
    byCanonicalTypeName: (typeName: string) => TypeHeuristicResult | undefined;
};
export interface TypeHeuristicResultCache {
    byIgnoredTypeName: Map<string, TypeHeuristicResult>;
    byCanonicalTypeName: Map<string, TypeHeuristicResult>;
}
