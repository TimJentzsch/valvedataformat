import { Range } from "vscode-languageserver/node";
import AstNode from "./node";

/** A line ending. */
export default interface AstEndOfLine extends AstNode {
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
  range: Range
): AstEndOfLine {
  return {
    type: "endOfLine",
    children: [],
    value,
    isLf,
    range,
  };
}

/** Create an AST node for a Unix kind end of line (LF). */
export function astLf(range: Range): AstEndOfLine {
  return astEndOfLine("\n", true, range);
}

/** Create an AST node for a Windows kind end of line (CRLF). */
export function astCrLf(range: Range): AstEndOfLine {
  return astEndOfLine("\r\n", false, range);
}
