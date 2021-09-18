import {
  Diagnostic,
  DiagnosticSeverity,
  Range,
} from "vscode-languageserver/node";
import { NodeType } from "../ast/baseNode";
import AstNode from "../ast/node";
import AstProperty from "../ast/property";
import { executeForNodeList } from "../capabilities/utils";
import { VdfObjectSchema, VdfRootSchema, VdfSchema } from "./schema";

function getSchemaDiagnostic(range: Range, message: string): Diagnostic {
  return {
    range,
    message,
    severity: DiagnosticSeverity.Warning,
  };
}

export default async function validateNodeSchema(
  node: AstNode,
  schema?: VdfSchema
): Promise<Diagnostic[]> {
  if (schema === false) {
    // Always invalid
    return [getSchemaDiagnostic(node.range, `No ${node.type} allowed.`)];
  }

  if (schema === true || schema === undefined || schema.type === undefined) {
    // Always valid
    return [];
  }

  // Validate the given schema
  switch (schema.type) {
    case "boolean":
      return validateBooleanSchema(node);
    case "null":
      return validateNullSchema(node);
    default:
      return [];
  }
}

export async function validateNullSchema(node: AstNode): Promise<Diagnostic[]> {
  if (node.type !== NodeType.string || node.content !== "") {
    return [
      getSchemaDiagnostic(
        node.range,
        `Expected null value, use an empty string.`
      ),
    ];
  }

  return [];
}

export async function validateBooleanSchema(
  node: AstNode
): Promise<Diagnostic[]> {
  if (
    node.type !== NodeType.string ||
    // True and false are represented by 1 and 0.
    (node.content !== "1" && node.content !== "0")
  ) {
    return [
      getSchemaDiagnostic(
        node.range,
        `Expected boolean value. Use a string with a "1" (true) or "0" (false) as content.`
      ),
    ];
  }

  return [];
}

export async function validateObjectSchema(
  node: AstNode,
  schema: VdfObjectSchema
): Promise<Diagnostic[]> {
  if (node.type !== NodeType.object && node.type !== NodeType.root) {
    return [getSchemaDiagnostic(node.range, `Expected object.`)];
  }

  // Validate all properties
  const diagnostics = await executeForNodeList(
    node.properties,
    async (node) => {
      return validatePropertySchema(node, schema);
    }
  );

  const keys = node.properties.map((property) => property.key?.content);
  // Check if required properties are present
  for (const requiredProperty of schema.required ?? []) {
    if (!keys.includes(requiredProperty)) {
      diagnostics.push(
        getSchemaDiagnostic(node.range, `Missing property ${requiredProperty}.`)
      );
    }
  }

  return diagnostics;
}

export async function validatePropertySchema(
  property: AstProperty,
  schema: VdfObjectSchema | VdfRootSchema
): Promise<Diagnostic[]> {
  const value = property.value;
  const keyName = property.key?.content;

  if (value === undefined || keyName === undefined) {
    // We don't know which schema to apply, ignore the property
    return [];
  }

  const exactMatch = Object.entries(schema.properties ?? {}).find(
    ([schemaKey]) => {
      return schemaKey === keyName;
    }
  );
  if (exactMatch !== undefined) {
    // The property matches a fixed name property schema
    return validateNodeSchema(value, exactMatch[1]);
  }

  const patternMatch = Object.entries(schema.patternProperties ?? {}).find(
    ([schemaKeyPattern]) => {
      const schemaKeyRegex = new RegExp(schemaKeyPattern);
      return schemaKeyRegex.test(keyName);
    }
  );
  if (patternMatch !== undefined) {
    // The property matches a pattern property schema
    return validateNodeSchema(value, patternMatch[1]);
  }

  // It's an additional property
  return validateNodeSchema(value, schema.additionalProperties);
}
