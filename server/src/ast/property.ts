import { getRangeFromNodeList } from "../parser/utils";
import AstBaseNode, { NodeType } from "./baseNode";
import AstIndent from "./indent";
import AstKey from "./key";
import AstNode from "./node";
import AstObject from "./object";
import AstString from "./string";
import { InlineTrivia, MultilineTrivia } from "./trivia";

export enum PropertyType {
  /** A property with a string value. */
  string,
  /** A property with an object value. */
  object,
}

/** A string property, e.g. "key" "value". */
export interface AstStringProperty extends AstBaseNode {
  type: NodeType.property;
  propertyType: PropertyType.string;
  /** The key of the property. */
  key: AstKey;
  betweenIndent: AstIndent[];
  /** The value of the property. Can be undefined for incomplete documents. */
  value?: AstString;
}

/** An object property, e.g. "key" {}. */
export interface AstObjectProperty extends AstBaseNode {
  type: NodeType.property;
  propertyType: PropertyType.object;
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
  betweenIndent: AstIndent[] = [],
  value: AstString | undefined = undefined,
  postTrivia: InlineTrivia[] = []
) {
  const children = [key as AstNode]
    .concat(betweenIndent)
    .concat(value !== undefined ? [value] : [])
    .concat(postTrivia);

    const property: AstStringProperty = {
      type: NodeType.property,
      propertyType: PropertyType.string,
      key,
      betweenIndent,
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
      type: NodeType.property,
      propertyType: PropertyType.object,
      key,
      value,
      children,
      range: getRangeFromNodeList(children),
    };

  return property;
}
