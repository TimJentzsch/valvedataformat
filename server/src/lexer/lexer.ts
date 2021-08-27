import { buildLexer, Token } from "typescript-parsec";

export enum VdfToken {
  comment,
  quotedString,
  unquotedString,
  lBracket,
  rBracket,
  endOfLine,
  space,
}

export const tokenizer = buildLexer([
  // Comments start with two slashes and go to the end of the line
  [true, /^\/\/.*/g, VdfToken.comment],
  // Quoted strings are between double quotes
  // The end quote is optional for error tolarance
  [true, /^\"[^"\n]*\"?/g, VdfToken.quotedString],
  // Unquoted strings do not contain quotes, whitespace, or brackets
  [true, /^[^\s\"{}]+/g, VdfToken.unquotedString],
  // Opening bracket
  [true, /^{/g, VdfToken.lBracket],
  // Closing bracket
  [true, /^}/g, VdfToken.rBracket],
  // End of line (line break)
  [true, /^\r?\n/g, VdfToken.endOfLine],
  // Whitespace (without line breaks)
  [true, /^[ \t]+/g, VdfToken.space],
]);

export function getTokenStream(input: string): Token<VdfToken>[] {
  const stream = [];

  let next = tokenizer.parse(input);

  while (next !== undefined) {
    stream.push(next);
    next = next.next;
  }

  return stream;
}
