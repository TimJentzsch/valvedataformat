import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver/node";
import AstKey from "./ast/key";
import AstNode from "./ast/node";
import AstObject from "./ast/object";
import AstProperty, { AstStringProperty } from "./ast/property";
import AstRoot from "./ast/root";
import AstString from "./ast/string";

/** Validate the given AST node. */
export default async function validateNode(
  node: AstNode
): Promise<Diagnostic[]> {
  switch (node.type) {
    case "string":
      return validateString(node);
    case "key":
      return validateKey(node);
    case "root":
      return validateRoot(node);
    case "object":
      return validateObject(node);
    case "property":
      return validateProperty(node);
    default:
      return [];
  }
}

/** Validate all children of an AST node and merge the results. */
export async function validateChildren(
  children: AstNode[]
): Promise<Diagnostic[]> {
  const childDiagnostics = await Promise.all(
    children.map((child) => validateNode(child))
  );

  // Merge results
  return ([] as Diagnostic[]).concat(...childDiagnostics);
}

/** Validate the given root AST node. */
export async function validateRoot(root: AstRoot): Promise<Diagnostic[]> {
  return validateChildren(root.children);
}

/** Validate the given object AST node. */
export async function validateObject(obj: AstObject): Promise<Diagnostic[]> {
  return validateChildren(obj.children);
}

/** Validate the given property AST node. */
export async function validateProperty(
  property: AstProperty
): Promise<Diagnostic[]> {
  const childDiagnostics = await validateChildren(property.children);

  if (property.value === undefined) {
    // Only string properties can have undefined values
    const key = (property as AstStringProperty).key;

    const missingValueDiagnostic: Diagnostic = {
      severity: DiagnosticSeverity.Error,
      range: key.range,
      message: `The key "${key.value}" has no value.`,
    };

    return [missingValueDiagnostic].concat(childDiagnostics);
  }

  return childDiagnostics;
}

/** Validate the given string AST node. */
export async function validateString(str: AstString): Promise<Diagnostic[]> {
  if (str.isTerminated === false) {
    const end = str.range.end;

    return [
      {
        severity: DiagnosticSeverity.Error,
        range: {
          start: {
            line: end.line,
            character: end.character - 1,
          },
          end,
        },
        message: `Missing closing quotation marks for value "${str.value}".`,
      },
    ];
  }

  return [];
}

/** Validate the given key AST node. */
export async function validateKey(key: AstKey): Promise<Diagnostic[]> {
  if (key.isTerminated === false) {
    const end = key.range.end;

    return [
      {
        severity: DiagnosticSeverity.Error,
        range: {
          start: {
            line: end.line,
            character: end.character - 1,
          },
          end,
        },
        message: `Missing closing quotation marks for key "${key.value}".`,
      },
    ];
  }

  return [];
}
