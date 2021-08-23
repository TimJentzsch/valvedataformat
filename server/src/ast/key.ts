import { Range } from "vscode-languageserver/node";
import AstBaseNode from "./baseNode";
import AstNode from "./node";
import AstString from "./string";

/** A property key. Basically the same as a string. */
export default interface AstKey extends AstBaseNode {
  type: "key";
  children: [];
  /** Determines whether the key is quoted or unquoted. */
  isQuoted: boolean;
  /** Determines whether the key has the closing quote.
   * This should always be true for unquoted keys.
   */
  isTerminated: boolean;
  /** The content of the key. */
  value: string;
}

/** Create an AST node for a property key. */
export function astKey(
  isQuoted: boolean,
  isTerminated: boolean,
  value: string,
  range: Range
): AstKey {
  return {
    type: "key",
    children: [],
    isQuoted,
    isTerminated,
    value,
    range,
  };
}

/** Create an AST node for a quoted key. */
export function astQuotedKey(
  isTerminated: boolean,
  value: string,
  range: Range
): AstKey {
  return astKey(true, isTerminated, value, range);
}

/** Create an AST node for an unquoted key. */
export function astUnquotedKey(value: string, range: Range): AstKey {
  return astKey(false, true, value, range);
}

/** Convert a string node to a key node. */
export function astKeyFromString(astString: AstString): AstKey {
  return astKey(
    astString.isQuoted,
    astString.isTerminated,
    astString.value,
    astString.range
  );
}
