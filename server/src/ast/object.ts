import { getRangeFromNodeList } from "../parser/utils";
import AstBaseNode from "./baseNode";
import AstBracket from "./bracket";
import AstNode from "./node";
import AstProperty from "./property";

/** An object, i.e. a collection of properties. */
export default interface AstObject extends AstBaseNode {
  type: "object";
  /** The properties of the object. */
  properties: AstProperty[];
  /** Determines whether the object has a closing bracket. */
  isTerminated: boolean;
}

/** Create a new AST object node. */
export function astObject(
  lBracket: AstBracket,
  content: AstNode[] = [],
  rBracket?: AstBracket,
): AstObject {
  const isTerminated = rBracket !== undefined;

  const children: AstNode[] = ([lBracket] as AstNode[])
    .concat(content as AstNode[])
    .concat(isTerminated ? [rBracket as AstNode] : []);

  const properties: AstProperty[] = content.filter(
    (value) => (value as AstNode).type === "property"
  ) as AstProperty[];

  const range = getRangeFromNodeList(children);

  const obj: AstObject = {
    type: "object",
    children,
    properties,
    isTerminated,
    range,
  };

  return obj;
}
