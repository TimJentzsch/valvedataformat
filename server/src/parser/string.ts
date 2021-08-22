import { alt, apply, Parser, tok } from "typescript-parsec";
import AstString from "../ast/string";
import { VDFToken } from "../lexer/lexer";
import { getRangeFromToken } from "./utils";

/** Parse a string. */
const stringParser: Parser<VDFToken, AstString> = alt(
  // Quoted string
  apply(tok(VDFToken.quotedString), (token) => {
    const text = token.text;
    const isTerminated = text.length >= 2 && text[text.length - 1] === '"';

    const str: AstString = {
      type: "string",
      children: [],
      isQuoted: true,
      isTerminated,
      value: isTerminated ? text.slice(1, text.length - 1) : text.slice(1),
      range: getRangeFromToken(token),
    };

    return str;
  }),
  // Unquoted string
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

export default stringParser;
