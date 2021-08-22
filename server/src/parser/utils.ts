import {
  expectEOF,
  expectSingleResult,
  Parser,
  Token,
  TokenPosition,
} from "typescript-parsec";
import { Position, Range } from "vscode-languageserver/node";
import { tokenizer, VDFToken } from "../lexer/lexer";

/** Converts a token position to a document range.
 *
 * Note that the row and column of the tokens are one-based,
 * while the line and character of the range are zero-based.
 */
export function getRangeFromTokenPosition(pos: TokenPosition): Range {
  const start: Position = {
    line: pos.rowBegin - 1,
    character: pos.columnBegin - 1,
  };

  const end: Position = {
    line: pos.rowEnd - 1,
    character: pos.columnEnd - 1,
  };

  return { start, end };
}

/** Get a range without constructing an object. */
export function getRange(startLine: number, startCharacter: number, endLine: number, endCharacter: number): Range {
  const start: Position = {
    line: startLine,
    character: startCharacter,
  };

  const end: Position = {
    line: endLine,
    character: endCharacter,
  };

  return { start, end };
}

/** Get a range from the same line. */
export function getInlineRange(line: number, startCharacter: number, endCharacter?: number): Range {
  return getRange(line, startCharacter, line, endCharacter ?? startCharacter);
}

/** Extract the range from a token. */
export function getRangeFromToken<T>(token: Token<T>): Range {
  return getRangeFromTokenPosition(token.pos);
}

/** Apply the parser to the given input string. */
export function applyParser<T>(parser: Parser<VDFToken, T>, input: string): T {
  return expectSingleResult(expectEOF(parser.parse(tokenizer.parse(input))));
}
