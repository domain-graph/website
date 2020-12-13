import {
  Field,
  Type,
  Schema,
  SchemaType,
  FieldType,
  isObjectType,
  isInterfaceType,
} from './types';

export function getType(typeName: string, schema: Schema): SchemaType | null {
  if (!typeCaches.has(schema)) {
    typeCaches.set(schema, new Map());
  }

  const typeCache = typeCaches.get(schema);

  if (typeCache?.size === 0 && schema.data.__schema.types.length > 0) {
    for (const type of schema.data.__schema.types) {
      typeCache.set(type.name, type);
    }
  }

  return typeCache?.get(typeName) || null;
}
const typeCaches: WeakMap<Schema, Map<string, SchemaType>> = new WeakMap();

export function getField(typeName: string, fieldName: string, schema: Schema) {
  const type = getType(typeName, schema);

  if (isObjectType(type) || isInterfaceType(type)) {
    const field = type.fields.find((f) => f.name === fieldName);

    if (field) {
      return getFieldType(field);
    }
  }

  return null;
}

export function getFieldType(
  field: Field,
): {
  type: FieldType;
  isNotNull: boolean;
  isList: boolean;
  isListElementNotNull: boolean | null;
} {
  let type: Type = field.type;
  const isNotNull = type.kind === 'NON_NULL';
  let isList = false;
  let isListElementNotNull: boolean | null = null;

  if (type.kind === 'NON_NULL') {
    type = type.ofType;
  }

  if (type.kind === 'LIST') {
    isList = true;
    type = type.ofType;
    isListElementNotNull = type.kind === 'NON_NULL';

    if (type.kind === 'NON_NULL') {
      type = type.ofType;
    }
  }

  return {
    type,
    isNotNull,
    isList,
    isListElementNotNull,
  };
}
