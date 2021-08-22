import { alt, apply, expectEOF, expectSingleResult, Parser, tok, Token, TokenPosition } from "typescript-parsec";
import { Position, Range } from "vscode-languageserver/node";
import AstComment from "../ast/comment";
import AstString from "../ast/string";
import { tokenizer, VDFToken } from "./lexer";

/** Converts a token position to a document range.
 * 
 * Note that the row and column of the tokens are one-based,
 * while the line and character of the range are zero-based.
 */
export function tokenPositionToDocumentRange(pos: TokenPosition): Range {
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

/** Extract the range from a token. */
export function getRangeFromToken<T>(token: Token<T>): Range {
  return tokenPositionToDocumentRange(token.pos);
}

/** Parse a comment. */
export const commentParser: Parser<VDFToken, AstComment> = apply(
  tok(VDFToken.comment),
  (token) => {
    const astComment: AstComment = {
      type: "comment",
      children: [],
      value: token.text.slice(2),
      range: getRangeFromToken(token),
    };
    return astComment;
  }
);


/** Parse a string. */
export const stringParser: Parser<VDFToken, AstString> = alt(
  apply(tok(VDFToken.quotedString), (token) => {
    const isTerminated = token.text[token.text.length - 1] === '"';
    const str: AstString = {
      type: "string",
      children: [],
      isQuoted: false,
      isTerminated,
      value: isTerminated ? token.text.slice(1, token.text.length - 1) : token.text.slice(1),
      range: getRangeFromToken(token),
    };
    return str;
  }),
  apply(tok(VDFToken.unquotedString), (token) => {
    const str: AstString = {
      type: "string",
      children: [],
      isQuoted: false,
      isTerminated: true,
      value: token.text,
      range: getRangeFromToken(token),
    };
    return str;
  })
);

/** Apply the parser to the given input string. */
export function applyParser<T>(parser: Parser<VDFToken, T>, input: string): T {
  return expectSingleResult(expectEOF(parser.parse(tokenizer.parse(input))));
}
