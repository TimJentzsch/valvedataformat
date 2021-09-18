import { Range } from "vscode-languageserver/node";
import { VdfSchema } from "../schema/schema";
import AstBaseNode, { NodeType } from "./baseNode";
import AstString from "./string";

/** A property key. Basically the same as a string. */
export default interface AstKey extends AstBaseNode {
  type: NodeType.key;
  children: [];
  /** Determines whether the key is quoted or unquoted. */
  isQuoted: boolean;
  /** Determines whether the key has the closing quote.
   * This should always be true for unquoted keys.
   */
  isTerminated: boolean;
  /** The content of the key. */
  content: string;
}

/** Create an AST node for a property key. */
export function astKey(
  isQuoted: boolean,
  value: string,
  range: Range,
  isTerminated: boolean = true,
  schema?: VdfSchema
): AstKey {
  return {
    type: NodeType.key,
    children: [],
    isQuoted,
    isTerminated,
    content: value,
    range,
  };
}

/** Create an AST node for a quoted key. */
export function astQuotedKey(
  value: string,
  range: Range,
  isTerminated: boolean = true,
  schema?: VdfSchema
): AstKey {
  return astKey(true, value, range, isTerminated, schema);
}

/** Create an AST node for an unquoted key. */
export function astUnquotedKey(
  value: string,
  range: Range,
  schema?: VdfSchema
): AstKey {
  return astKey(false, value, range, true, schema);
}

/** Convert a string node to a key node. */
export function astKeyFromString(astString: AstString): AstKey {
  return astKey(
    astString.isQuoted,
    astString.content,
    astString.range,
    astString.isTerminated,
    astString.schema
  );
}
