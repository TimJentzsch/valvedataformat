import { Range } from "vscode-languageserver/node";
import AstBaseNode from "./baseNode";
import AstNode from "./node";

/** Indent, i.e. spaces and tabs (no line endings). */
export default interface AstIndent extends AstBaseNode {
  type: "indent";
  children: [];
  /** The text of the indent. */
  value: string;
}

/** Create an AST node for indent (spaces and tabs). */
export function astIndent(value: string, range: Range, parent?: AstNode): AstIndent {
  return {
    type: "indent",
    children: [],
    value,
    range,
    parent,
  };
}
