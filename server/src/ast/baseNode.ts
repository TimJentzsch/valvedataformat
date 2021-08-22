import { Range } from "vscode-languageserver/node";
import AstNode from "./node";

export type NodeType =
  | "comment"
  | "string"
  | "property"
  | "object"
  | "endOfLine"
  | "space"
  | "bracket";

export default interface AstBaseNode {
  /** The type of the node. */
  type: NodeType;
  /** The list of all children of the node. */
  children: AstNode[];
  /** The range of the node in the full text. */
  range: Range;
  /** The parent AST node. If this is undefined, this node is the root of the AST. */
  parent?: AstNode;
}
