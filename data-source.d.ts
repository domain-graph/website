import React from 'react';
import { Schema } from './tools/types';
import { Edge, Node } from './types';
export interface DataSourceContext {
    nodes: Node[];
    edges: Edge[];
    setSchema: (schema: Schema) => void;
}
export declare const useDataSource: () => DataSourceContext;
export declare const DataSource: React.FC;
