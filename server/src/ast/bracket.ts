import AstNode from "./node";

/** A bracket for an object. */
export default interface AstBracket extends AstNode {
  type: "bracket";
  /** Left is an opening bracket, right is a closing bracket. */
  bracketType: "left" | "right";
  children: [];
}
