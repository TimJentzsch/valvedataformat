import { NodeType } from "../ast/baseNode";
import AstNode from "../ast/node";
import AstObject from "../ast/object";
import AstString from "../ast/string";
import { VdfSchema } from "./schema";

/** Annotate the node with the given schema. */
export default function annotateSchema(
  node: AstNode,
  schema?: VdfSchema
): AstNode {
  node.schema = schema;

  if (node.type !== NodeType.root && node.type !== NodeType.object) {
    // If the node is not an object or root, nothing else is to do
    return node;
  }

  if (typeof schema !== "object" || schema.type !== "object") {
    // If the schema is not for an object, reset the schema for all property values
    for (const property of node.properties) {
      const value = property.value;

      if (value !== undefined) {
        annotateSchema(value, undefined);
      }
    }

    return node;
  }

  // Propagate the schema to the properties
  for (const property of node.properties) {
    const value = property.value;
    const keyName = property.key?.content;

    if (value === undefined || keyName === undefined) {
      // We don't know which schema to apply, ignore the property
      continue;
    }

    const exactMatch = Object.entries(schema.properties ?? {}).find(
      ([schemaKey]) => {
        return schemaKey === keyName;
      }
    );
    if (exactMatch !== undefined) {
      // The property matches a fixed name property schema
      property.value = annotateSchema(value, exactMatch[1]) as
        | AstString
        | AstObject;
      continue;
    }

    const patternMatch = Object.entries(schema.patternProperties ?? {}).find(
      ([schemaKeyPattern]) => {
        const schemaKeyRegex = new RegExp(schemaKeyPattern);
        return schemaKeyRegex.test(keyName);
      }
    );
    if (patternMatch !== undefined) {
      // The property matches a pattern property schema
      property.value = annotateSchema(value, patternMatch[1]) as
        | AstString
        | AstObject;
      continue;
    }

    // It's an additional property
    property.value = annotateSchema(value, schema.additionalProperties) as
      | AstString
      | AstObject;
    continue;
  }

  return node;
}
