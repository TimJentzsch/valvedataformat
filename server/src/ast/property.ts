import { getRangeFromNodeList } from "../parser/utils";
import AstBaseNode from "./baseNode";
import AstKey from "./key";
import AstNode from "./node";
import AstObject from "./object";
import AstString from "./string";

/** The value of a property. */
export type PropertyValue = AstString | AstObject;

/** A key-value pair within an object. */
export default interface AstProperty extends AstBaseNode {
  type: "property";
  /** The key of the property. */
  key: AstKey;
  /** The value of the property. Can be undefined for incomplete documents. */
  value?: PropertyValue;
}

/** Create a new AST property node. */
export function astProperty(children: AstNode[], key: AstKey, value?: PropertyValue) {
  const property: AstProperty = {
    type: "property",
    key,
    value,
    children,
    range: getRangeFromNodeList(children),
  };

  return property;
}
