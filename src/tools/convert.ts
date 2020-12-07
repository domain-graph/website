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

const myData = {
  nodes,
  edges: links,
};

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
