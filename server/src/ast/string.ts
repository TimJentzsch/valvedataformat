import { Range } from "vscode-languageserver/node";
import { VdfSchema } from "../schema/schema";
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
  content: string;
}

/** Create an AST node for a string. */
export function astString(
  isQuoted: boolean,
  content: string,
  range: Range,
  isTerminated: boolean = true,
  schema?: VdfSchema
): AstString {
  return {
    type: NodeType.string,
    children: [],
    isQuoted,
    isTerminated,
    content,
    range,
    schema,
  };
}

/** Create an AST node for a quoted string. */
export function astQuotedString(
  content: string,
  range: Range,
  isTerminated: boolean = true,
  schema?: VdfSchema
): AstString {
  return astString(true, content, range, isTerminated, schema);
}

/** Create an AST node for an unquoted string. */
export function astUnquotedString(
  value: string,
  range: Range,
  schema?: VdfSchema
): AstString {
  return astString(false, value, range, true, schema);
}
