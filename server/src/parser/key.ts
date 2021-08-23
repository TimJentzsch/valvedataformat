import { apply, Parser } from "typescript-parsec";
import AstKey, { astKeyFromString } from "../ast/key";
import { VDFToken } from "../lexer/lexer";
import stringParser from "./string";

/** Parse a property key. */
const keyParser: Parser<VDFToken, AstKey> = apply(stringParser, (astString) => {
  return astKeyFromString(astString);
});

export default keyParser;
