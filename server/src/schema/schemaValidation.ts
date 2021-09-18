import {
  Diagnostic,
  DiagnosticSeverity,
  Range,
} from "vscode-languageserver/node";
import { NodeType } from "../ast/baseNode";
import AstNode from "../ast/node";
import { VdfSchema } from "./schema";

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
