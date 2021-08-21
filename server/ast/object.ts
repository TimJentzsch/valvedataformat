import AstNode from "./node";
import AstProperty from "./property";

export default interface AstObject extends AstNode {
  type: "object";
  /** The properties of the object. */
  properties: AstProperty[];
  /** Determines whether the object has a closing bracket. */
  isTerminated: boolean;
}
