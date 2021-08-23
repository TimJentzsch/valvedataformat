import AstBracket from "./bracket";
import AstComment from "./comment";
import AstEndOfLine from "./endOfLine";
import AstObject from "./object";
import AstProperty from "./property";
import AstIndent from "./indent";
import AstString from "./string";

type AstNode =
  | AstBracket
  | AstComment
  | AstEndOfLine
  | AstObject
  | AstProperty
  | AstIndent
  | AstString;

export default AstNode;
