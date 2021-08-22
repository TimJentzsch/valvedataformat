import { Range } from "vscode-languageserver/node";
import AstNode from "./node";

/** A string literal value. */
export default interface AstString extends AstNode {
  type: "string";
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
export function astString(isQuoted: boolean, isTerminated: boolean, value: string, range: Range): AstString {
  return {
    type: "string",
    children: [],
    isQuoted,
    isTerminated,
    value,
    range,
  };
}

/** Create an AST node for a quoted string. */
export function astQuotedString(isTerminated: boolean, value: string, range: Range): AstString {
  return astString(true, isTerminated, value, range);
}


/** Create an AST node for an unquoted string. */
export function astUnquotedString(value: string, range: Range): AstString {
  return astString(false, true, value, range);
}
