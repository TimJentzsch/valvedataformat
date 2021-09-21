import { getInlineRange, getRangeFromNodeList } from "../parser/utils";
import { VdfSchema } from "../schema/schema";
import AstBaseNode, { NodeType } from "./baseNode";
import AstNode from "./node";
import AstProperty from "./property";

/** The root of a document. Like an object, but without the brackets. */
export default interface AstRoot extends AstBaseNode {
  type: NodeType.root;
  /** The properties of the root. */
  properties: AstProperty[];
}

/** Create a new AST root node. */
export function astRoot(children: AstNode[] = [], schema?: VdfSchema): AstRoot {
  const properties: AstProperty[] = children.filter(
    (value) => (value as AstNode).type === NodeType.property
  ) as AstProperty[];

  const range = getRangeFromNodeList(children, getInlineRange(0, 0));

  const root: AstRoot = {
    type: NodeType.root,
    children,
    properties,
    range,
    schema,
  };

  return root;
}
