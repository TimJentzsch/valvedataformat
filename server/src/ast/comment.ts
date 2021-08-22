import AstNode from "./node";

/** A line comment. */
export default interface AstComment extends AstNode {
  type: "comment";
  children: [];
  /** The content of the comment. */
  value: string;
}
