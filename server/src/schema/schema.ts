interface VdfSchema extends VdfSchemaBase {
  $id?: string;
  $schema?: string;
}

type VdfInnerSchmea = boolean | SchemaObject;

interface VdfSchemaBase {
  title?: string;
  description?: string;
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
