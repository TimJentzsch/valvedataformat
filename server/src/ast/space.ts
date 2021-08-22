import AstBaseNode from "./baseNode";

/** Whitespace, except for line endings. */
export default interface AstSpace extends AstBaseNode {
  type: "space";
  children: [];
  /** The text of the whitespace. */
  value: string;
}
