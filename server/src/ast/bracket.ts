import { Range } from "vscode-languageserver/node";
import AstBaseNode, { NodeType } from "./baseNode";

export enum BracketType {
  left,
  right,
}

/** A bracket for an object. */
export default interface AstBracket extends AstBaseNode {
  type: NodeType.bracket;
  /** Left is an opening bracket, right is a closing bracket. */
  bracketType: BracketType;
  children: [];
}

/** Create an AST node for a bracket. */
export function astBracket(bracketType: BracketType, range: Range): AstBracket {
  return {
    type: NodeType.bracket,
    children: [],
    bracketType,
    range,
  };
}

/** Create an AST node for a left bracket ({). */
export function astLBracket(range: Range): AstBracket {
  return astBracket(BracketType.left, range);
}

/** Create an AST node for a right bracket (}). */
export function astRBracket(range: Range): AstBracket {
  return astBracket(BracketType.right, range);
}
