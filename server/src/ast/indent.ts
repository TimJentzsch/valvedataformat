import { Range } from "vscode-languageserver/node";
import AstBaseNode, { NodeType } from "./baseNode";

/** Indent, i.e. spaces and tabs (no line endings). */
export default interface AstIndent extends AstBaseNode {
  type: NodeType.indent;
  children: [];
  /** The text of the indent. */
  value: string;
}

/** Create an AST node for indent (spaces and tabs). */
export function astIndent(value: string, range: Range): AstIndent {
  return {
    type: NodeType.indent,
    children: [],
    value,
    range,
  };
}
