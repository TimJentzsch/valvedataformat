import { Range } from "vscode-languageserver/node";

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
  children: AstBaseNode[];
  /** The range of the node in the full text. */
  range: Range;
}
