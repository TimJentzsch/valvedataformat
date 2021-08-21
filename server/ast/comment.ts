import AstNode from "./node";

/** A line comment. */
export default interface AstComment extends AstNode {
  type: "comment";
  children: [];
  /** Determines whether the comment is on a separate line or inline with other elements. */
  isInline: boolean;
  /** The content of the comment. */
  value: string;
}
