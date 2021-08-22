import { apply, Parser, tok } from "typescript-parsec";
import AstEndOfLine, { astEndOfLine } from "../ast/endOfLine";
import { VDFToken } from "../lexer/lexer";
import { getRangeFromToken } from "./utils";

/** Parse line endings. */
const endOfLineParser: Parser<VDFToken, AstEndOfLine> = apply(
  tok(VDFToken.endOfLine),
  (token) => {
    const value = token.text;
    const isLf = token.text === "\n";
    const range = getRangeFromToken(token);
    
    return astEndOfLine(value, isLf, range);
  }
);

export default endOfLineParser;
