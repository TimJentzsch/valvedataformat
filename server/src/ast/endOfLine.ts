import { Range } from "vscode-languageserver/node";
import AstBaseNode from "./baseNode";
import AstNode from "./node";

/** The type of the line ending.
 * Can be Unix style (LF | \n) or Windows style (CRLF | \r\n).
 */
export type EolType = "LF" | "CRLF";

/** A line ending. */
export default interface AstEndOfLine extends AstBaseNode {
  type: "endOfLine";
  children: [];
  /** The text of the line break. */
  value: string;
  /** The type of the line ending.
   * Can be Unix style (LF | \n) or Windows style (CRLF | \r\n).
   */
  eolType: "LF" | "CRLF";
}

/** Create an AST node for an end of line. */
export function astEndOfLine(
  value: string,
  eolType: EolType,
  range: Range
): AstEndOfLine {
  return {
    type: "endOfLine",
    children: [],
    value,
    eolType,
    range,
  };
}

/** Create an AST node for a Unix kind end of line (LF). */
export function astLf(range: Range): AstEndOfLine {
  return astEndOfLine("\n", "LF", range);
}

/** Create an AST node for a Windows kind end of line (CRLF). */
export function astCrLf(range: Range): AstEndOfLine {
  return astEndOfLine("\r\n", "CRLF", range);
}
