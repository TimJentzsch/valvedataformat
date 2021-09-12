interface VdfSchema extends VdfSchemaBase {
  $id?: string;
  $schema?: string;
}

type VdfInnerSchmea = boolean | SchemaObject | SchemaString | SchemaInteger | SchemaBoolean;

interface VdfSchemaBase {
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
interface SchemaObject extends VdfSchemaBase {
  type: "object";
  /** Schema definitions for the object's properties. */
  properties?: {
    [propertyName: string]: VdfInnerSchmea;
  };
  /** Schema definitions for the properties matching a specific pattern. */
  patternProperties?: {
    [propertyPattern: string]: VdfInnerSchmea;
  };
  /** Schema definitions for additional properties. */
  additionalProperties?: VdfInnerSchmea;
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
interface SchemaString extends VdfSchemaBase {
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
interface SchmeaNumeric extends VdfSchemaBase {
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
interface SchemaInteger extends SchmeaNumeric {
  type: "integer";
}

/** A VDF floating point number.
 * @see https://json-schema.org/understanding-json-schema/reference/numeric.html#number
 */
 interface SchemaNumber extends SchmeaNumeric {
  type: "number";
}

/** A VDF boolean.
 * @see https://json-schema.org/understanding-json-schema/reference/boolean.html
 */
 interface SchemaBoolean extends VdfSchemaBase {
  type: "boolean";
}

/** A VDF null value.
 * @see https://json-schema.org/understanding-json-schema/reference/null.html
 */
 interface SchemaNull extends VdfSchemaBase {
  type: "null";
}
