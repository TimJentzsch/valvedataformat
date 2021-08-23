import AstComment from "./comment";
import AstIndent from "./indent";

/** Trivia, i.e. indent or comments. */
type Trivia = AstIndent | AstComment;

export default Trivia;
