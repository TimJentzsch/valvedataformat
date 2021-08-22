import AstBracket from "./bracket";
import AstComment from "./comment";
import AstEndOfLine from "./endOfLine";
import AstObject from "./object";
import AstProperty from "./property";
import AstSpace from "./space";
import AstString from "./string";

type AstNode =
  | AstBracket
  | AstComment
  | AstEndOfLine
  | AstObject
  | AstProperty
  | AstSpace
  | AstString;

export default AstNode;
