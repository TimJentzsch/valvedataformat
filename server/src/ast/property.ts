import { getRangeFromNodeList } from "../parser/utils";
import AstBaseNode from "./baseNode";
import AstKey from "./key";
import AstNode from "./node";
import AstObject from "./object";
import AstString from "./string";
import { InlineTrivia, MultilineTrivia } from "./trivia";

/** A string property, e.g. "key" "value". */
export interface AstStringProperty extends AstBaseNode {
  type: "property";
  /** The key of the property. */
  key: AstKey;
  /** The value of the property. Can be undefined for incomplete documents. */
  value?: AstString;
}

/** An object property, e.g. "key" {}. */
export interface AstObjectProperty extends AstBaseNode {
  type: "property";
  /** The key of the property. Can be undefined for incomplete documents. */
  key?: AstKey;
  /** The value of the property. */
  value: AstObject;
}

/** A key-value pair within an object. */
type AstProperty = AstStringProperty | AstObjectProperty;
export default AstProperty;

/** Create a new AST string property node. */
export function astStringProperty(
  key: AstKey,
  betweenTrivia: InlineTrivia[] = [],
  value: AstString | undefined = undefined,
  postTrivia: InlineTrivia[] = []
) {
  const children = [key as AstNode]
    .concat(betweenTrivia)
    .concat(value !== undefined ? [value] : [])
    .concat(postTrivia);

    const property: AstStringProperty = {
      type: "property",
      key,
      value,
      children,
      range: getRangeFromNodeList(children),
    };

  return property;
}

/** Create a new AST object property node. */
export function astObjectProperty(
  key: AstKey | undefined = undefined,
  betweenTrivia: MultilineTrivia[] = [],
  value: AstObject,
  postTrivia: InlineTrivia[] = []
) {
  const children = (key !== undefined ? [key as AstNode] : ([] as AstNode[]))
    .concat(betweenTrivia)
    .concat(value !== undefined ? [value] : [])
    .concat(postTrivia);

    const property: AstObjectProperty = {
      type: "property",
      key,
      value,
      children,
      range: getRangeFromNodeList(children),
    };

  return property;
}
