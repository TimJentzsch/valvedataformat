import { Range } from "vscode-languageserver/node";
import AstBaseNode, { NodeType } from "./baseNode";

/** A string literal value. */
export default interface AstString extends AstBaseNode {
  type: NodeType.string;
  children: [];
  /** Determines whether the string is quoted or unquoted. */
  isQuoted: boolean;
  /** Determines whether the string has the closing quote.
   * This should always be true for unquoted strings.
   */
  isTerminated: boolean;
  /** The content of the string. */
  value: string;
}

/** Create an AST node for a string. */
export function astString(
  isQuoted: boolean,
  value: string,
  range: Range,
  isTerminated: boolean = true
): AstString {
  return {
    type: NodeType.string,
    children: [],
    isQuoted,
    isTerminated,
    value,
    range,
  };
}

/** Create an AST node for a quoted string. */
export function astQuotedString(
  value: string,
  range: Range,
  isTerminated: boolean = true
): AstString {
  return astString(true, value, range, isTerminated);
}

/** Create an AST node for an unquoted string. */
export function astUnquotedString(value: string, range: Range): AstString {
  return astString(false, value, range);
}
