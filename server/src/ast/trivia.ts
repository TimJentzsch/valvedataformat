import AstComment from "./comment";
import AstEndOfLine from "./endOfLine";
import AstIndent from "./indent";

/** Inline trivia, i.e. comments or indent. */
export type InlineTrivia = AstComment | AstIndent;

/** Multiline trivia, i.e. comments, indent or end of line. */
export type MultilineTrivia = AstComment | AstIndent | AstEndOfLine;
