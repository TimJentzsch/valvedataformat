import {
  Diagnostic,
  DiagnosticSeverity,
  Range,
} from "vscode-languageserver/node";
import { NodeType } from "../ast/baseNode";
import AstNode from "../ast/node";
import { VdfInnerSchema } from "./schema";

export type SchemaValidation = {
  schemaAst: AstNode;
  diagnostics: Diagnostic[];
};

function getSchemaDiagnostic(range: Range, message: string): Diagnostic {
  return {
    range,
    message,
    severity: DiagnosticSeverity.Warning,
  };
}

export default async function validateNodeSchema(
  node: AstNode,
  schema: VdfInnerSchema
): Promise<SchemaValidation> {
  if (schema === true) {
    // Always valid
    return {
      schemaAst: node,
      diagnostics: [],
    };
  }

  if (schema === false) {
    // Always invalid
    return {
      schemaAst: node,
      diagnostics: [
        getSchemaDiagnostic(node.range, `No ${node.type} allowed.`),
      ],
    };
  }

  // Validate the given schema
  switch (schema.type) {
    case "boolean":
      return validateBooleanSchema(node);
    case "null":
      return validateNullSchema(node);
    default:
      return {
        schemaAst: node,
        diagnostics: [],
      };
  }
}

export async function validateNullSchema(
  node: AstNode
): Promise<SchemaValidation> {
  if (node.type !== NodeType.string || node.value !== "") {
    return {
      schemaAst: node,
      diagnostics: [
        getSchemaDiagnostic(
          node.range,
          `Expected null value, use an empty string.`
        ),
      ],
    };
  }

  return {
    schemaAst: node,
    diagnostics: [],
  };
}

export async function validateBooleanSchema(
  node: AstNode
): Promise<SchemaValidation> {
  if (
    node.type !== NodeType.string ||
    // True and false are represented by 1 and 0.
    (node.value !== "1" && node.value !== "0")
  ) {
    return {
      schemaAst: node,
      diagnostics: [
        getSchemaDiagnostic(
          node.range,
          `Expected boolean value. Use a string with a "1" (true) or "0" (false) as content.`
        ),
      ],
    };
  }

  return {
    schemaAst: node,
    diagnostics: [],
  };
}
