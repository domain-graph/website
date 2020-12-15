import { FieldType, Schema, SchemaType, SpecificFieldType } from './types';
export declare function getType(typeName: string, schema: Schema): SchemaType | null;
export declare function getField(typeName: string, fieldName: string, schema: Schema): NormalizedFieldType | null;
export declare type NormalizedFieldType = {
    type: SpecificFieldType;
    isNotNull: boolean;
    isList: boolean;
    isListElementNotNull: boolean | null;
};
export declare function normalizeFieldType(fieldType: FieldType): NormalizedFieldType;
