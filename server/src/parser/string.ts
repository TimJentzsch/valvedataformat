import { alt, apply, Parser, tok } from "typescript-parsec";
import AstString, { astQuotedString, astUnquotedString } from "../ast/string";
import { VDFToken } from "../lexer/lexer";
import { getRangeFromToken } from "./utils";

/** Parse a string. */
const stringParser: Parser<VDFToken, AstString> = alt(
  // Quoted string
  apply(tok(VDFToken.quotedString), (token) => {
    const text = token.text;
    const isTerminated = text.length >= 2 && text[text.length - 1] === '"';
    const value = isTerminated ? text.slice(1, text.length - 1) : text.slice(1);
    const range = getRangeFromToken(token);

    return astQuotedString(isTerminated, value, range);
  }),
  // Unquoted string
  apply(tok(VDFToken.unquotedString), (token) => {
    const value = token.text;
    const range = getRangeFromToken(token);

    return astUnquotedString(value, range);
  })
);

export default stringParser;
