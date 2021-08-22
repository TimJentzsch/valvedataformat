import { apply, Parser, tok } from "typescript-parsec";
import AstEndOfLine from "../ast/endOfLine";
import { VDFToken } from "../lexer/lexer";
import { getRangeFromToken } from "./utils";

/** Parse line endings. */
const endOfLineParser: Parser<VDFToken, AstEndOfLine> = apply(
  tok(VDFToken.endOfLine),
  (token) => {
    const astEndOfLine: AstEndOfLine = {
      type: "endOfLine",
      children: [],
      value: token.text,
      isLf: token.text === "\n",
      isCrLf: token.text === "\r\n",
      range: getRangeFromToken(token),
    };
    return astEndOfLine;
  }
);

export default endOfLineParser;
