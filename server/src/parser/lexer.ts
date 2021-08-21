import { buildLexer, Token } from "typescript-parsec";

export enum VDFToken {
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
  [true, /^\/\/.*/g, VDFToken.comment],
  // Quoted strings are between double quotes
  // The end quote is optional for error tolarance
  [true, /^\"[^"]*\"?/g, VDFToken.quotedString],
  // Unquoted strings do not contain quotes, whitespace, or brackets
  [true, /^[^\s\"{}]+/g, VDFToken.unquotedString],
  // Opening bracket
  [true, /^{/g, VDFToken.lBracket],
  // Closing bracket
  [true, /^}/g, VDFToken.rBracket],
  // End of line (line break)
  [true, /^\r?\n/g, VDFToken.endOfLine],
  // Whitespace (without line breaks)
  [true, /^[ \t]+/g, VDFToken.space],
]);

export function getTokenStream(input: string): Token<VDFToken>[] {
  const stream = [];

  let next = tokenizer.parse(input);

  while (next !== undefined) {
    stream.push(next);
    next = next.next;
  }

  return stream;
}
