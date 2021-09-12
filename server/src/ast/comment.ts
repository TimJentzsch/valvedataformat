import { Range } from "vscode-languageserver/node";
import AstBaseNode, { NodeType } from "./baseNode";

/** A line comment. */
export default interface AstComment extends AstBaseNode {
  type: NodeType.comment;
  children: [];
  /** The content of the comment. */
  content: string;
}

/** Create an AST node for a comment. */
export function astComment(value: string, range: Range): AstComment {
  return {
    type: NodeType.comment,
    children: [],
    content: value,
    range,
  };
}
