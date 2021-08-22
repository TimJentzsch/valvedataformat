import AstBaseNode from "./baseNode";
import AstProperty from "./property";

/** An object, i.e. a collection of properties. */
export default interface AstObject extends AstBaseNode {
  type: "object";
  /** The properties of the object. */
  properties: AstProperty[];
  /** Determines whether the object has a closing bracket. */
  isTerminated: boolean;
}
