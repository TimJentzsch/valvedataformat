import { Range } from "vscode-languageserver/node";
import AstBaseNode from "./baseNode";
import AstNode from "./node";

/** Whitespace, except for line endings. */
export default interface AstSpace extends AstBaseNode {
  type: "space";
  children: [];
  /** The text of the whitespace. */
  value: string;
}

/** Create an AST node for whitespace. */
export function astSpace(value: string, range: Range, parent?: AstNode): AstSpace {
  return {
    type: "space",
    children: [],
    value,
    range,
    parent,
  };
}
