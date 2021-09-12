type VdfSchema = {
  /** The ID of the schema. */
  $id?: string;
  /** The ID of the used meta schema. */
  $schema?: string;
} & VdfInnerSchema;

type VdfInnerSchema =
  | {}
  | boolean
  | VdfObjectSchema
  | VdfStringSchema
  | VdfIntegerSchema
  | VdfBooleanSchema
  | VdfNullSchema;

interface VdfBaseSchema {
  /** A short title for the data. */
  title?: string;
  /** A longer explanation for the data. */
  description?: string;
  /** The default value for the data. */
  default?: any;
  /** Example values for the data. */
  examples?: any[];
  /** Indicate whether the data is deprecated. */
  deprecated?: boolean;
  /** An internal comment for the data. */
  $comment?: string;
  /** An enumeration of allowed values for the data. */
  enum?: any[];
  /** Restrict the data to a single value. */
  const?: any;
}

/** A VDF object.
 * @see https://json-schema.org/understanding-json-schema/reference/object.html
 */
interface VdfObjectSchema extends VdfBaseSchema {
  type: "object";
  /** Schema definitions for the object's properties. */
  properties?: {
    [propertyName: string]: VdfInnerSchema;
  };
  /** Schema definitions for the properties matching a specific pattern. */
  patternProperties?: {
    [propertyPattern: string]: VdfInnerSchema;
  };
  /** Schema definitions for additional properties. */
  additionalProperties?: VdfInnerSchema;
  /** A list of required properties. */
  required?: string[];
  /** A pattern that the property names need to follow. */
  propertyNames?: string;
  /** The minimum number of properties. */
  minProperties?: number;
  /** The maximum number of properties. */
  maxProperties?: number;
}

/** A VDF string.
 * @see https://json-schema.org/understanding-json-schema/reference/string.html
 */
interface VdfStringSchema extends VdfBaseSchema {
  type: "string";
  /** The minimum length of the string. */
  minLength?: number;
  /** The maximum length of the string. */
  maxLength?: number;
  /** The pattern the string has to match. */
  pattern?: string;
  /** The format of the string. */
  format?: string;
}

/** Base for numeric VDF types.
 *  @see https://json-schema.org/understanding-json-schema/reference/numeric.html
 */
interface VdfNumericBaseSchema extends VdfBaseSchema {
  /** Restrict the number to be a multiple of another number. */
  multipleOf?: number;
  /** The inclusive miniumum value of the number. */
  minimum?: number;
  /** The exclusive miniumum value of the number. */
  exclusiveMinimum?: number;
  /** The inclusive maximum value of the number. */
  maximum?: number;
  /** The exclusive maximum value of the number. */
  exclusiveMaxmimum?: number;
}

/** A VDF integer.
 * @see https://json-schema.org/understanding-json-schema/reference/numeric.html#integer
 */
interface VdfIntegerSchema extends VdfNumericBaseSchema {
  type: "integer";
}

/** A VDF floating point number.
 * @see https://json-schema.org/understanding-json-schema/reference/numeric.html#number
 */
interface VdfNumberSchema extends VdfNumericBaseSchema {
  type: "number";
}

/** A VDF boolean.
 * @see https://json-schema.org/understanding-json-schema/reference/boolean.html
 */
interface VdfBooleanSchema extends VdfBaseSchema {
  type: "boolean";
}

/** A VDF null value.
 * @see https://json-schema.org/understanding-json-schema/reference/null.html
 */
interface VdfNullSchema extends VdfBaseSchema {
  type: "null";
}
