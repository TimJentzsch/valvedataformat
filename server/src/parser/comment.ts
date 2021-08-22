import { apply, Parser, tok } from "typescript-parsec";
import AstComment from "../ast/comment";
import { VDFToken } from "../lexer/lexer";
import { getRangeFromToken } from "./utils";

/** Parse a comment. */
const commentParser: Parser<VDFToken, AstComment> = apply(
  tok(VDFToken.comment),
  (token) => {
    const astComment: AstComment = {
      type: "comment",
      children: [],
      value: token.text.slice(2),
      range: getRangeFromToken(token),
    };
    return astComment;
  }
);

export default commentParser;
