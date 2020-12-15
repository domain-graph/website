export declare type Schema = {
    data: {
        __schema: {
            queryType: {
                name: string;
            };
            mutationType: {
                name: string;
            };
            subscriptionType: {
                name: string;
            };
            types: SchemaType[];
        };
    };
};
export interface Named {
    name: string;
    description: string | null;
}
export interface Deprecable {
    isDeprecated: boolean;
    deprecationReason: string | null;
}
export declare type SchemaType = ObjectType | ScalarType | EnumType | InputObjectType | InterfaceType | UnionType;
export interface ObjectType extends Named {
    kind: 'OBJECT';
    fields: Field[];
    interfaces: InterfaceFieldType[];
}
export declare function isObjectType(type: SchemaType | undefined | null): type is ObjectType;
export interface ScalarType extends Named {
    kind: 'SCALAR';
}
export declare function isScalarType(type: SchemaType | undefined | null): type is ScalarType;
export interface EnumType extends Named {
    kind: 'ENUM';
    enumValues: EnumValue[];
}
export interface EnumValue extends Named, Deprecable {
}
export declare function isEnumType(type: SchemaType | undefined | null): type is EnumType;
export interface InputObjectType extends Named {
    kind: 'INPUT_OBJECT';
    inputFields: InputValue[];
}
export interface InputField extends Named {
    type: FieldType;
    defaultValue: string | null;
}
export declare function isInputObjectType(type: SchemaType | undefined | null): type is InputObjectType;
export interface InterfaceType extends Named {
    kind: 'INTERFACE';
    fields: Field[];
    possibleTypes: ObjectFieldType[];
}
export declare function isInterfaceType(type: SchemaType | undefined | null): type is InterfaceType;
export interface UnionType extends Named {
    kind: 'UNION';
    possibleTypes: ObjectFieldType[];
}
export declare function isUnionType(type: SchemaType | undefined | null): type is UnionType;
export declare type FieldType = WrappedFieldType | SpecificFieldType;
export declare type WrappedFieldType = NonNullFieldType | ListFieldType;
export declare function isWrappedFieldType(type: FieldType | undefined | null): type is WrappedFieldType;
export interface NonNullFieldType {
    kind: 'NON_NULL';
    ofType: SpecificFieldType;
}
export declare function isNonNullFieldType(type: FieldType | undefined | null): type is NonNullFieldType;
export interface ListFieldType {
    kind: 'LIST';
    ofType: SpecificFieldType | NonNullFieldType;
}
export declare function isListFieldType(type: FieldType | undefined | null): type is ListFieldType;
export declare type SpecificFieldType = ObjectFieldType | ScalarFieldType | EnumFieldType | UnionFieldType | InterfaceFieldType;
export interface ObjectFieldType {
    kind: 'OBJECT';
    name: string;
}
export declare function isObjectFieldType(type: FieldType | undefined | null): type is ObjectFieldType;
export interface ScalarFieldType {
    kind: 'SCALAR';
    name: string;
}
export declare function isScalarFieldType(type: FieldType | undefined | null): type is ScalarFieldType;
export interface EnumFieldType {
    kind: 'ENUM';
    name: string;
}
export declare function isEnumFieldType(type: FieldType | undefined | null): type is EnumFieldType;
export interface UnionFieldType {
    kind: 'UNION';
    name: string;
}
export declare function isUnionFieldType(type: FieldType | undefined | null): type is UnionFieldType;
export interface InterfaceFieldType {
    kind: 'INTERFACE';
    name: string;
}
export declare function isInterfaceFieldType(type: FieldType | undefined | null): type is InterfaceFieldType;
export interface Field extends Named, Deprecable {
    args: InputValue[];
    type: FieldType;
}
export interface InputValue extends Named {
    type: FieldType;
    defaultValue: string;
}
