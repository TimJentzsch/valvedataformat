import { apply, Parser, tok } from "typescript-parsec";
import AstSpace from "../ast/space";
import { VDFToken } from "../lexer/lexer";
import { getRangeFromToken } from "./utils";

/** Parse spaces and tabs (no line endings). */
const spaceParser: Parser<VDFToken, AstSpace> = apply(
  tok(VDFToken.space),
  (token) => {
    const astSpace: AstSpace = {
      type: "space",
      children: [],
      value: token.text,
      range: getRangeFromToken(token),
    };
    return astSpace;
  }
);

export default spaceParser;
