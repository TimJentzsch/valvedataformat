import { Range } from "vscode-languageserver/node";
import AstNode from "./node";

/** A line comment. */
export default interface AstComment extends AstNode {
  type: "comment";
  children: [];
  /** The content of the comment. */
  value: string;
}

/** Create an AST node for a comment. */
export function astComment(value: string, range: Range): AstComment {
  return {
    type: "comment",
    children: [],
    value,
    range,
  };
}
