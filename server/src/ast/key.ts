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
  value: string,
  range: Range,
  isTerminated: boolean = true
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
  value: string,
  range: Range,
  isTerminated: boolean = true
): AstKey {
  return astKey(true, value, range, isTerminated);
}

/** Create an AST node for an unquoted key. */
export function astUnquotedKey(value: string, range: Range): AstKey {
  return astKey(false, value, range);
}

/** Convert a string node to a key node. */
export function astKeyFromString(astString: AstString): AstKey {
  return astKey(
    astString.isQuoted,
    astString.value,
    astString.range,
    astString.isTerminated
  );
}
