import AstNode from "./node";
import AstObject from "./object";
import AstString from "./string";

/** The key of a property. */
export type AstKey = AstString;
/** The value of a property. */
export type AstValue = AstString | AstObject;

/** A key-value pair within an object. */
export default interface AstProperty extends AstNode {
  type: "property";
  /** The key of the property. */
  key: AstKey;
  /** The value of the property. Can be undefined for incomplete documents. */
  value?: AstValue;
}
