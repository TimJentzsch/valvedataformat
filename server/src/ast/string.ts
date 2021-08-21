import AstNode from "./node";

/** A string literal value. */
export default interface AstString extends AstNode {
  type: "string";
  children: [];
  /** Determines whether the string is quoted or unquoted. */
  isQuoted: boolean;
  /** Determines whether the string has the closing quote.
   * This should always be true for unquoted strings.
   */
  isTerminated: boolean;
  /** The content of the string. */
  value: string;
}
