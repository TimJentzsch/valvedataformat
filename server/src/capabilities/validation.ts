import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver/node";
import { NodeType } from "../ast/baseNode";
import AstKey from "../ast/key";
import AstNode from "../ast/node";
import AstObject from "../ast/object";
import AstProperty, { PropertyType } from "../ast/property";
import AstRoot from "../ast/root";
import AstString from "../ast/string";
import { executeForNodeList } from "./utils";

/** Validate the given AST node. */
export default async function validateNode(
  node: AstNode
): Promise<Diagnostic[]> {
  switch (node.type) {
    case NodeType.string:
      return validateString(node);
    case NodeType.key:
      return validateKey(node);
    case NodeType.root:
      return validateRoot(node);
    case NodeType.object:
      return validateObject(node);
    case NodeType.property:
      return validateProperty(node);
    default:
      return [];
  }
}

/** Validate all children of an AST node and merge the results. */
export async function validateChildren(
  children: AstNode[]
): Promise<Diagnostic[]> {
  return executeForNodeList(children, validateNode);
}

/** Validate the given root AST node. */
export async function validateRoot(root: AstRoot): Promise<Diagnostic[]> {
  return validateChildren(root.children);
}

/** Validate the given object AST node. */
export async function validateObject(obj: AstObject): Promise<Diagnostic[]> {
  const childDiagnostics = await validateChildren(obj.children);

  if (obj.rBracket === undefined) {
    const missingClosingBracketDiagnostic: Diagnostic = {
      severity: DiagnosticSeverity.Error,
      range: obj.lBracket?.range ?? obj.range,
      message: "Object without closing bracket.",
    };

    return [missingClosingBracketDiagnostic].concat(childDiagnostics);
  }

  return childDiagnostics;
}

/** Validate the given property AST node. */
export async function validateProperty(
  property: AstProperty
): Promise<Diagnostic[]> {
  const childDiagnostics = await validateChildren(property.children);

  if (property.propertyType === PropertyType.string && property.value === undefined) {
    const key = property.key;

    const missingValueDiagnostic: Diagnostic = {
      severity: DiagnosticSeverity.Error,
      range: key.range,
      message: `The key "${key.value}" has no value.`,
    };

    const end = Date.now();

    return [missingValueDiagnostic].concat(childDiagnostics);
  } else if (property.propertyType === PropertyType.object && property.key === undefined) {
    const value = property.value;

    const missingValueDiagnostic: Diagnostic = {
      severity: DiagnosticSeverity.Error,
      range: value.lBracket?.range ?? value.range,
      message: `Object property without a key.`,
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
