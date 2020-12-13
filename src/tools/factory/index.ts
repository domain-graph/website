import { Node, Edge } from '../../types';
import { isInterfaceType, isObjectType, isUnionType, Schema } from '../types';
import { getFieldType } from '../utils';
import { TypeHeuristic } from './types';

export class GraphFactory {
  constructor(...heuristics: TypeHeuristic[]) {
    this.heuristics = heuristics;
  }
  private readonly heuristics: TypeHeuristic[];

  build(schema: Schema): { nodes: Node[]; edges: Edge[] } {
    const nodes: Record<string, Node> = {};
    const edges: Record<string, Edge> = {};

    const resultsByIgnoredTypeName = new Map<
      string,
      ReturnType<TypeHeuristic>
    >();

    for (const type of schema.data.__schema.types) {
      for (const heuristic of this.heuristics) {
        const result = heuristic(type, schema);
        if (result) {
          for (const ignoredType of result.ignoredTypes) {
            resultsByIgnoredTypeName.set(ignoredType.name, result);
          }
        }
      }
    }

    for (const type of schema.data.__schema.types) {
      if (!resultsByIgnoredTypeName.has(type.name)) {
        nodes[type.name] = {
          id: type.name,
        };

        if (isObjectType(type) || isInterfaceType(type)) {
          for (const field of type.fields) {
            const fieldType = getFieldType(field);

            if (
              fieldType.type.kind === 'SCALAR' ||
              fieldType.type.kind === 'ENUM'
            ) {
              continue;
            }

            const heuristicResult = resultsByIgnoredTypeName.get(
              fieldType.type.name,
            );

            const target = heuristicResult?.canonicalType || fieldType.type;
            const isList = heuristicResult?.forceList || fieldType.isList;

            const edge: Edge = {
              id: `${type.name}>${field.name}>${target.name}`,
              name: field.name,
              optional: !fieldType.isNotNull,
              source: type.name,
              target: target.name,
              plurality: isList ? 'array' : 'single',
            };

            if (heuristicResult) {
              edge.heuristic = heuristicResult.heuristicName;
            }

            edges[edge.id] = edge;
          }
        } else if (isUnionType(type)) {
          // TODO
        }
      }
    }

    return {
      nodes: Object.keys(nodes).map((key) => nodes[key]),
      edges: Object.keys(edges).map((key) => edges[key]),
    };
  }
}
