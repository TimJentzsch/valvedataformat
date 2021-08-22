import { apply, Parser, tok } from "typescript-parsec";
import AstComment, { astComment } from "../ast/comment";
import { VDFToken } from "../lexer/lexer";
import { getRangeFromToken } from "./utils";

/** Parse a comment. */
const commentParser: Parser<VDFToken, AstComment> = apply(
  tok(VDFToken.comment),
  (token) => {
    const value = token.text.slice(2);
    const range = getRangeFromToken(token);

    return astComment(value, range);
  }
);

export default commentParser;
