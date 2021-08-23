import { getRangeFromNodeList } from "../parser/utils";
import AstBaseNode from "./baseNode";
import AstNode from "./node";
import AstProperty from "./property";

/** The root of a document. Like an object, but without the brackets. */
export default interface AstRoot extends AstBaseNode {
  type: "root";
  /** The properties of the root. */
  properties: AstProperty[];
}

/** Create a new AST root node. */
export function astRoot(
  children: AstNode[] = [],
): AstRoot {
  const properties: AstProperty[] = children.filter(
    (value) => (value as AstNode).type === "property"
  ) as AstProperty[];

  const range = getRangeFromNodeList(children);

  const root: AstRoot = {
    type: "root",
    children,
    properties,
    range,
  };

  return root;
}
