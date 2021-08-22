import { alt, apply, Parser, tok } from "typescript-parsec";
import AstString from "../ast/string";
import { VDFToken } from "../lexer/lexer";
import { getRangeFromToken } from "./utils";

/** Parse a string. */
const stringParser: Parser<VDFToken, AstString> = alt(
  apply(tok(VDFToken.quotedString), (token) => {
    const isTerminated = token.text[token.text.length - 1] === '"';
    const str: AstString = {
      type: "string",
      children: [],
      isQuoted: false,
      isTerminated,
      value: isTerminated
        ? token.text.slice(1, token.text.length - 1)
        : token.text.slice(1),
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

export default stringParser;
