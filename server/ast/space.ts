import AstNode from "./node";

/** Whitespace, except for line endings. */
export default interface AstSpace extends AstNode {
  type: "space";
  children: [];
  /** The text of the whitespace. */
  value: string;
}
