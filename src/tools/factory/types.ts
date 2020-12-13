import { Schema, SchemaType } from '../types';

export interface TypeHeuristic {
  (type: SchemaType, schema: Schema): {
    heuristicName: string;
    canonicalType: SchemaType;
    forceList: boolean;
    ignoredTypes: Iterable<SchemaType>;
  } | null;
}
