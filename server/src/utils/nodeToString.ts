import { NodeType } from "../ast/baseNode";
import AstBracket, { BracketType } from "../ast/bracket";
import AstComment from "../ast/comment";
import AstEndOfLine, { EolType } from "../ast/endOfLine";
import AstIndent, { IndentType } from "../ast/indent";
import AstKey from "../ast/key";
import AstNode from "../ast/node";
import AstObject from "../ast/object";
import AstProperty from "../ast/property";
import AstRoot from "../ast/root";
import AstString from "../ast/string";
import { repeatStr } from "./stringUtils";

/** Convert an AST node to a string. */
export function astNodeToString(node: AstNode): string {
  switch (node.type) {
    case NodeType.key:
      return astKeyToString(node);
    case NodeType.string:
      return astStringToString(node);
    case NodeType.indent:
      return astIndentToString(node);
    case NodeType.comment:
      return astCommentToString(node);
    case NodeType.endOfLine:
      return astEndOfLineToString(node);
    case NodeType.property:
      return astPropertyToString(node);
    case NodeType.object:
      return astObjectToString(node);
    case NodeType.root:
      return astRootToString(node);
    case NodeType.bracket:
      return astBracketToString(node);
    default:
      return "";
  }
}

/** Convert a list of nodes to a string. */
export function childNodesToString(children: AstNode[]): string {
  let res = "";

  for (const child of children) {
    res += astNodeToString(child);
  }

  return res;
}

/** Convert a string node to a string. */
export function astStringToString(node: AstString): string {
  if (node.isQuoted) {
    if (node.isTerminated) {
      return `"${node.value}"`;
    }
    return `"${node.value}`;
  }
  return node.value;
}

/** Convert a key node to a string. */
export function astKeyToString(node: AstKey): string {
  if (node.isQuoted) {
    if (node.isTerminated) {
      return `"${node.value}"`;
    }
    return `"${node.value}`;
  }
  return node.value;
}

/** Convert an indent node to a string. */
export function astIndentToString(node: AstIndent): string {
  if (node.indentType === IndentType.spaces) {
    return repeatStr(" ", node.count);
  }
  return repeatStr("\t", node.count);
}

/** Convert a comment node to a string. */
export function astCommentToString(node: AstComment): string {
  return `// ${node.value}`;
}

/** Convert an end of line node to a string. */
export function astEndOfLineToString(node: AstEndOfLine): string {
  if (node.eolType === EolType.lf) {
    return "\n";
  }
  return "\r\n";
}

/** Convert a property node to a string. */
export function astPropertyToString(node: AstProperty): string {
  return childNodesToString(node.children);
}

/** Convert an object node to a string. */
export function astObjectToString(node: AstObject): string {
  return childNodesToString(node.children);
}

/** Convert a root node to a string. */
export function astRootToString(node: AstRoot): string {
  return childNodesToString(node.children);
}

/** Convert a bracket node to a string. */
export function astBracketToString(node: AstBracket): string {
  if (node.bracketType === BracketType.left) {
    return "{";
  }
  return "}";
}
