import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { format } from 'prettier';

import {
  Field,
  FieldType,
  isEnumFieldType,
  isObjectType,
  isScalarFieldType,
  Schema,
} from './types';

const schema: Schema = JSON.parse(
  readFileSync(join('data', 'schema.json')).toString(),
);

// type Type = {
//   name: string;
//   fields: Record<string, string>;
// };

const types = schema.data.__schema.types
  .filter(isObjectType)
  .map((type) => ({
    name: type.name,
    description: type.description,
    fields: type.fields
      .map((field) => ({
        name: field.name,
        type: getFieldType(field),
      }))
      .filter(
        (field) =>
          !isEnumFieldType(field.type.type) &&
          !isScalarFieldType(field.type.type),
      ),
  }))
  .filter(
    (x) =>
      x.name !== 'Query' &&
      x.name !== 'Mutation' &&
      x.name !== 'UserError' &&
      x.name !== 'PageInfo' &&
      !x.name.startsWith('__') &&
      !x.name.endsWith('Error') &&
      !x.name.endsWith('Payload') &&
      !x.name.endsWith('Result'),
  );

const nodes = types.map((type) => ({ id: type.name }));
const links = types
  .map((type) =>
    type.fields.map((field) => ({
      id: `${type.name}>${field.name}>${field.type.type.name}`,
      name: field.name,
      source: type.name,
      target: field.type.type.name,
      plurality: field.type.plurality,
      optional: field.type.optional,
    })),
  )
  .reduce((a, b) => a.concat(b), [])
  .filter(
    (link) =>
      nodes.some((n) => n.id === link.source) &&
      nodes.some((n) => n.id === link.target),
  );

export type Node = typeof nodes[number];
export type Edge = typeof links[number];

function traverse(
  name: string,
  depth: number,
  stop: string[] = [],
): { nodes: Node[]; edges: Edge[] } {
  const node = nodes.find((n) => n.id === name);

  console.log(node);

  const foundNodes = new Set<Node>([node]);
  const foundEdges = new Set<Edge>();

  let startNodes = new Set<Node>([node]);

  for (let i = 0; i < depth; i++) {
    console.log({ i, startNodes });
    const startFrom = Array.from(startNodes.values());
    startNodes = new Set<Node>();

    for (const s of startFrom) {
      const edges = links.filter(
        (link) => link.source === s.id || link.target === s.id,
      );
      console.log({ edges });
      edges.forEach((edge) => foundEdges.add(edge));

      const xxx = nodes.filter(
        (n) =>
          !foundNodes.has(n) &&
          edges.some((e) => e.source === n.id || e.target === n.id),
      );
      xxx.forEach((n) => {
        foundNodes.add(n);
        if (!stop.includes(n.id)) startNodes.add(n);
      });
    }
  }

  return {
    nodes: Array.from(foundNodes.values()),
    edges: Array.from(foundEdges.values()),
  };
}

const myData = traverse('ProjectTrackingEmployee', 4, ['Employee', 'Company']);

writeFileSync(
  join('data', 'nodes.json'),
  format(JSON.stringify(myData.nodes), { parser: 'json' }),
);
writeFileSync(
  join('data', 'links.json'),
  format(JSON.stringify(myData.edges), { parser: 'json' }),
);

function getFieldType(
  field: Field,
): {
  plurality: 'single' | 'array';
  type: FieldType;
  optional: boolean;
} {
  let t = field.type;

  let foundList = false;

  const optional = t.kind !== 'NON_NULL';

  do {
    switch (t.kind) {
      case 'LIST':
        t = t.ofType;
        foundList = true;
        break;
      case 'NON_NULL':
        t = t.ofType;
        break;
      default:
        return { plurality: foundList ? 'array' : 'single', type: t, optional };
    }
  } while (true);
}
