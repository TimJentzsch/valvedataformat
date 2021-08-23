import { alt, apply, opt, rep_sc, rule, seq, tok } from "typescript-parsec";
import AstComment, { astComment } from "../ast/comment";
import AstEndOfLine, { astEndOfLine } from "../ast/endOfLine";
import AstKey, { astKeyFromString } from "../ast/key";
import AstIndent, { astIndent } from "../ast/indent";
import AstString, { astQuotedString, astUnquotedString } from "../ast/string";
import { VDFToken } from "../lexer/lexer";
import { getRangeFromNodeList, getRangeFromToken } from "./utils";
import { InlineTrivia, MultilineTrivia } from "../ast/trivia";
import AstProperty, { astProperty } from "../ast/property";
import AstNode from "../ast/node";

// To avoid circular imports, all parsers are defined in a single file

// ====================================================================
// DECLARATIONS
// ====================================================================

/** Parse a comment. */
export const commentParser = rule<VDFToken, AstComment>();

/** Parse a string literal value. */
export const stringParser = rule<VDFToken, AstString>();

/** Parse a property key. */
export const keyParser = rule<VDFToken, AstKey>();

/** Parse spaces and tabs (no line endings). */
export const indentParser = rule<VDFToken, AstIndent>();

/** Parse line endings. */
export const endOfLineParser = rule<VDFToken, AstEndOfLine>();

/** Parse inline trivia (spaces, tabs and comments). */
export const inlineTriviaParser = rule<VDFToken, InlineTrivia[]>();

/** Parse multiline trivia (spaces, tabs, comments and line endings). */
export const multilineTriviaParser = rule<VDFToken, MultilineTrivia[]>();

/** Parse string properties ("key" "value"). */
export const stringPropertyParser = rule<VDFToken, AstProperty>();

// ====================================================================
// DEFINITIONS
// ====================================================================

// --------------------------------------------------------------------
// Comment
// --------------------------------------------------------------------
commentParser.setPattern(
  apply(tok(VDFToken.comment), (token) => {
    const value = token.text.slice(2);
    const range = getRangeFromToken(token);

    return astComment(value, range);
  })
);

// --------------------------------------------------------------------
// String
// --------------------------------------------------------------------
stringParser.setPattern(
  alt(
    // Quoted string
    apply(tok(VDFToken.quotedString), (token) => {
      const text = token.text;
      const isTerminated = text.length >= 2 && text[text.length - 1] === '"';
      const value = isTerminated
        ? text.slice(1, text.length - 1)
        : text.slice(1);
      const range = getRangeFromToken(token);

      return astQuotedString(isTerminated, value, range);
    }),
    // Unquoted string
    apply(tok(VDFToken.unquotedString), (token) => {
      const value = token.text;
      const range = getRangeFromToken(token);

      return astUnquotedString(value, range);
    })
  )
);

// --------------------------------------------------------------------
// Key
// --------------------------------------------------------------------
keyParser.setPattern(
  apply(stringParser, (astString) => {
    return astKeyFromString(astString);
  })
);

// --------------------------------------------------------------------
// Indent (spaces and tabs)
// --------------------------------------------------------------------
indentParser.setPattern(
  apply(tok(VDFToken.space), (token) => {
    const value = token.text;
    const range = getRangeFromToken(token);

    return astIndent(value, range);
  })
);

// --------------------------------------------------------------------
// End of line
// --------------------------------------------------------------------
endOfLineParser.setPattern(
  apply(tok(VDFToken.endOfLine), (token) => {
    const value = token.text;
    const eolType = token.text === "\n" ? "LF" : "CRLF";
    const range = getRangeFromToken(token);

    return astEndOfLine(value, eolType, range);
  })
);

// --------------------------------------------------------------------
// Trivia
// --------------------------------------------------------------------

// Inline trivia
inlineTriviaParser.setPattern(rep_sc(alt(commentParser, indentParser)));
// Multiline trivia
multilineTriviaParser.setPattern(
  rep_sc(alt(commentParser, indentParser, endOfLineParser))
);

// --------------------------------------------------------------------
// Property
// --------------------------------------------------------------------

// String property
// "key" "value"
stringPropertyParser.setPattern(
  apply(
    seq(
      keyParser,
      inlineTriviaParser,
      opt(seq(stringParser, inlineTriviaParser))
    ),
    ([key, trivia1, rest]) => {
      const value = rest ? rest[0] : undefined;
      const trivia2 = rest ? rest[1] : [];
      const children: AstNode[] = ([key] as AstNode[])
        .concat(trivia1)
        .concat(value ? [value] : [])
        .concat(trivia2);

      return astProperty(children, key, value);
    }
  )
);
