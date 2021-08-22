import { Range } from "vscode-languageserver/node";
import AstBaseNode from "./baseNode";
import AstNode from "./node";

/** A line ending. */
export default interface AstEndOfLine extends AstBaseNode {
  type: "endOfLine";
  children: [];
  /** The text of the line break. */
  value: string;
  /** Determines whether the line break is of Unix kind (LF) or Windows kind (CRLF).*/
  isLf: boolean;
}

/** Create an AST node for an end of line. */
export function astEndOfLine(
  value: string,
  isLf: boolean,
  range: Range,
  parent?: AstNode,
): AstEndOfLine {
  return {
    type: "endOfLine",
    children: [],
    value,
    isLf,
    range,
    parent,
  };
}

/** Create an AST node for a Unix kind end of line (LF). */
export function astLf(range: Range, parent?: AstNode): AstEndOfLine {
  return astEndOfLine("\n", true, range, parent);
}

/** Create an AST node for a Windows kind end of line (CRLF). */
export function astCrLf(range: Range, parent?: AstNode): AstEndOfLine {
  return astEndOfLine("\r\n", false, range, parent);
}
