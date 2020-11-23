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
  .filter((x) => x.name !== 'Query');

const nodes = types.map((type) => ({ id: type.name })).slice(100, 120);
const links = types
  .map((type) =>
    type.fields.map((field) => ({
      source: type.name,
      target: field.type.type.name,
    })),
  )
  .reduce((a, b) => a.concat(b), [])
  .filter(
    (link) =>
      nodes.some((n) => n.id === link.source) &&
      nodes.some((n) => n.id === link.target),
  );

writeFileSync(
  join('data', 'nodes.json'),
  format(JSON.stringify(nodes), { parser: 'json' }),
);
writeFileSync(
  join('data', 'links.json'),
  format(JSON.stringify(links), { parser: 'json' }),
);

function getFieldType(
  field: Field,
): {
  plurality: 'single' | 'array';
  type: FieldType;
} {
  let t = field.type;

  let foundList = false;

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
        return { plurality: foundList ? 'array' : 'single', type: t };
    }
  } while (true);
}
