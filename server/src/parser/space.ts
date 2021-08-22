import { apply, Parser, tok } from "typescript-parsec";
import AstSpace, { astSpace } from "../ast/space";
import { VDFToken } from "../lexer/lexer";
import { getRangeFromToken } from "./utils";

/** Parse spaces and tabs (no line endings). */
const spaceParser: Parser<VDFToken, AstSpace> = apply(
  tok(VDFToken.space),
  (token) => {
    const value = token.text;
    const range = getRangeFromToken(token);
    
    return astSpace(value, range);
  }
);

export default spaceParser;
