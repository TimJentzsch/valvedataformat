import { Range } from "vscode-languageserver/node";
import AstBaseNode from "./baseNode";
import AstNode from "./node";

export type BracketType = "left" | "right";

/** A bracket for an object. */
export default interface AstBracket extends AstBaseNode {
  type: "bracket";
  /** Left is an opening bracket, right is a closing bracket. */
  bracketType: BracketType;
  value: string;
  children: [];
}

/** Create an AST node for a bracket. */
export function astBracket(
  value: string,
  bracketType: BracketType,
  range: Range,
  parent?: AstNode
): AstBracket {
  return {
    type: "bracket",
    children: [],
    value,
    bracketType,
    range,
    parent,
  };
}

/** Create an AST node for a left bracket ({). */
export function astLBracket(range: Range, parent?: AstNode): AstBracket {
  return astBracket("{", "left", range, parent);
}

/** Create an AST node for a right bracket (}). */
export function astRBracket(range: Range, parent?: AstNode): AstBracket {
  return astBracket("}", "right", range, parent);
}
