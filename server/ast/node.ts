import { Range } from "vscode-languageserver/node";

export type NodeType =
  | "comment"
  | "string"
  | "property"
  | "object"
  | "endOfLine"
  | "space"
  | "bracket";

export default interface AstNode {
  /** The type of the node. */
  type: NodeType;
  /** The list of all children of the node. */
  children: AstNode[];
  /** The range of the node in the full text. */
  range: Range;
}
