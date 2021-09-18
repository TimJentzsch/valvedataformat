import { Range } from "vscode-languageserver/node";
import { VdfSchema } from "../schema/schema";
import AstNode from "./node";

export enum NodeType {
  bracket,
  comment,
  endOfLine,
  indent,
  key,
  object,
  property,
  root,
  string
};

export default interface AstBaseNode {
  /** The type of the node. */
  type: NodeType;
  /** The list of all children of the node. */
  children: AstNode[];
  /** The range of the node in the full text. */
  range: Range;
  /** The schema for this node. */
  schema?: VdfSchema;
}
