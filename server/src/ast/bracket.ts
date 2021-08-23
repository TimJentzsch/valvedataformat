import { Range } from "vscode-languageserver/node";
import AstBaseNode from "./baseNode";

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
): AstBracket {
  return {
    type: "bracket",
    children: [],
    value,
    bracketType,
    range,
  };
}

/** Create an AST node for a left bracket ({). */
export function astLBracket(range: Range): AstBracket {
  return astBracket("{", "left", range);
}

/** Create an AST node for a right bracket (}). */
export function astRBracket(range: Range): AstBracket {
  return astBracket("}", "right", range);
}
