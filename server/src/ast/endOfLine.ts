import AstNode from "./node";

/** A line ending. */
export default interface AstEndOfLine extends AstNode {
  type: "endOfLine";
  children: [];
  /** The text of the line break. */
  value: string;
  /** Determines whether the line break is of Unix kind (LF). */
  isLf: boolean;
  /** Determines whether the line break is of Windows kind (CRLF). */
  isCrLf: boolean;
}
