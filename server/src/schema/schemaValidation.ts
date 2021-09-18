import {
  Diagnostic,
  DiagnosticSeverity,
  Range,
} from "vscode-languageserver/node";
import { NodeType } from "../ast/baseNode";
import AstNode from "../ast/node";
import { executeForNodeList } from "../capabilities/utils";
import { VdfObjectSchema, VdfStringSchema } from "./schema";

function getSchemaDiagnostic(range: Range, message: string): Diagnostic {
  return {
    range,
    message,
    severity: DiagnosticSeverity.Warning,
  };
}

export default async function validateNodeSchema(
  node: AstNode
): Promise<Diagnostic[]> {
  const schema = node.schema;

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
    case "string":
      return validateStringSchema(node, schema);
    case "object":
      return validateObjectSchema(node, schema);
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

export async function validateStringSchema(
  node: AstNode,
  schema: VdfStringSchema
): Promise<Diagnostic[]> {
  if (node.type !== NodeType.string) {
    return [getSchemaDiagnostic(node.range, `Expected string value.`)];
  }

  const diagnostics: Diagnostic[] = [];
  const content = node.content;

  // Check constant value
  const cst = schema.const;
  if (cst !== undefined && content !== cst) {
    diagnostics.push(
      getSchemaDiagnostic(node.range, `Expected constant value "${cst}".`)
    );
  }

  // Check enum value
  const enm = schema.enum;
  if (enm !== undefined && !enm.includes(content)) {
    const enumStr = enm.map((value) => `"${value}"`).join(", ");
    diagnostics.push(
      getSchemaDiagnostic(node.range, `Expected one value of [${enumStr}].`)
    );
  }

  // Check length
  const length = content.length;
  const minLength = schema.minLength;
  const maxLength = schema.maxLength;
  if (minLength !== undefined && length < minLength) {
    diagnostics.push(
      getSchemaDiagnostic(
        node.range,
        `The string length (${length}) is smaller than the minimum length (${minLength}).`
      )
    );
  }
  if (maxLength !== undefined && length > maxLength) {
    diagnostics.push(
      getSchemaDiagnostic(
        node.range,
        `The string length (${length}) is bigger than the maximum length (${maxLength}).`
      )
    );
  }

  // Check pattern
  const pattern = schema.pattern;
  if (pattern !== undefined) {
    const regex = new RegExp(pattern);
    if (!regex.test(content)) {
      diagnostics.push(
        getSchemaDiagnostic(
          node.range,
          `The string doesn't match the pattern "${pattern}".`
        )
      );
    }
  }

  return diagnostics;
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
      const value = node.value;

      if (value !== undefined) {
        return validateNodeSchema(value);
      }

      return [];
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
