import { buildLexer } from "typescript-parsec";

export enum TokenKind {
  comment,
  quotedString,
  unquotedString,
  lBracket,
  rBracket,
  lineBreak,
  space,
}

export const tokenizer = buildLexer([
  // Comments start with two slashes and go to the end of the line
  [true, /^\/\/.*/g, TokenKind.comment],
  // Quoted strings are between double quotes
  // The end quote is optional for error tolarance
  [true, /^\"[^"]*\"?/g, TokenKind.quotedString],
  // Unquoted strings do not contain quotes, whitespace, or brackets
  [true, /^[^\s\"{}]+/g, TokenKind.unquotedString],
  // Opening bracket
  [true, /^{/g, TokenKind.lBracket],
  // Closing bracket
  [true, /^}/g, TokenKind.rBracket],
  // Line break
  [true, /^\n\r?/, TokenKind.lineBreak],
  // Whitespace (without line breaks)
  [true, /^[ \t]+/, TokenKind.space],
]);
