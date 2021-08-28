import { Range } from "vscode-languageserver/node";
import AstBaseNode, { NodeType } from "./baseNode";

/** The type of indent. */
export enum IndentType {
  spaces,
  tabs,
};

/** Indent, i.e. spaces and tabs (no line endings). */
export default interface AstIndent extends AstBaseNode {
  type: NodeType.indent;
  children: [];
  /** The type of indent. Can be spaces or tabs. */
  indentType: IndentType;
  /** The number of indent characters. */
  count: number;
}

/** Create an AST node for indent (spaces and tabs). */
export function astIndent(indentType: IndentType, count: number, range: Range): AstIndent {
  return {
    type: NodeType.indent,
    children: [],
    indentType,
    count,
    range,
  };
}

/** Create an AST node for spaces. */
export function astSpaces(count: number, range: Range): AstIndent {
  return astIndent(IndentType.spaces, count, range);
}

/** Create an AST node for tabs. */
export function astTabs(count: number, range: Range): AstIndent {
  return astIndent(IndentType.tabs, count, range);
}
