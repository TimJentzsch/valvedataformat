import { Range } from "vscode-languageserver/node";
import AstBaseNode, { NodeType } from "./baseNode";

/** The type of the line ending.
 * Can be Unix style (LF | \n) or Windows style (CRLF | \r\n).
 */
export enum EolType {
  /** Unix style line ending (LF | \n). */
  lf,
  /** Windows style line ending (CRLF | \r\n). */
  crlf,
};

/** A line ending. */
export default interface AstEndOfLine extends AstBaseNode {
  type: NodeType.endOfLine;
  children: [];
  /** The type of the line ending.
   * Can be Unix style (LF | \n) or Windows style (CRLF | \r\n).
   */
  eolType: EolType;
}

/** Create an AST node for an end of line. */
export function astEndOfLine(
  eolType: EolType,
  range: Range
): AstEndOfLine {
  return {
    type: NodeType.endOfLine,
    children: [],
    eolType,
    range,
  };
}

/** Create an AST node for a Unix kind end of line (LF). */
export function astLf(range: Range): AstEndOfLine {
  return astEndOfLine(EolType.lf, range);
}

/** Create an AST node for a Windows kind end of line (CRLF). */
export function astCrLf(range: Range): AstEndOfLine {
  return astEndOfLine(EolType.crlf, range);
}
