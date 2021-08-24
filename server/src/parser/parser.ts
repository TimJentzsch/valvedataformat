import { alt, apply, opt_sc, rep_sc, rule, seq, tok } from "typescript-parsec";
import AstComment, { astComment } from "../ast/comment";
import AstEndOfLine, { astEndOfLine } from "../ast/endOfLine";
import AstKey, { astKeyFromString } from "../ast/key";
import AstIndent, { astIndent } from "../ast/indent";
import AstString, { astQuotedString, astUnquotedString } from "../ast/string";
import { VDFToken } from "../lexer/lexer";
import { getRangeFromToken } from "./utils";
import { InlineTrivia, MultilineTrivia } from "../ast/trivia";
import AstProperty, {
  astObjectProperty,
  astStringProperty,
} from "../ast/property";
import AstBracket, { astLBracket, astRBracket } from "../ast/bracket";
import AstObject, { astObject } from "../ast/object";
import AstNode from "../ast/node";
import AstRoot, { astRoot } from "../ast/root";

// To avoid circular imports, all parsers are defined in a single file

// ====================================================================
// DECLARATIONS
// ====================================================================

/** Parse a comment. */
export const commentParser = rule<VDFToken, AstComment>();

/** Parse an opening bracket. */
export const lBracketParser = rule<VDFToken, AstBracket>();

/** Parse a closing bracket. */
export const rBracketParser = rule<VDFToken, AstBracket>();

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

/** Parse properties of an object. */
export const propertyParser = rule<VDFToken, AstProperty>();

/** Parse an object. */
export const objectParser = rule<VDFToken, AstObject>();

/** Parse the root, i.e. a VDF document. */
export const rootParser = rule<VDFToken, AstRoot>();

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
// Bracket
// --------------------------------------------------------------------

// Opening bracket
lBracketParser.setPattern(
  apply(tok(VDFToken.lBracket), (token) => {
    const range = getRangeFromToken(token);

    return astLBracket(range);
  })
);

// Closing bracket
rBracketParser.setPattern(
  apply(tok(VDFToken.rBracket), (token) => {
    const range = getRangeFromToken(token);

    return astRBracket(range);
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

      return astQuotedString(value, range, isTerminated);
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
propertyParser.setPattern(
  apply(
    seq(
      keyParser,
      inlineTriviaParser,
      // The value is optional (for incomplete documents)
      opt_sc(
        // The value with optional trailing trivia
        seq(
          // The value is either a string or an object
          alt(
            stringParser,
            // If the value is an object, we have two possibilites:
            alt(
              // It's either on the same line and we can parse it directly.
              objectParser,
              // Or we hit a line break. In that case we can have additional trivia with line breaks.
              seq(endOfLineParser, multilineTriviaParser, objectParser)
            )
          ),
          // Optional trailing whitespace (no line breaks)
          inlineTriviaParser
        )
      )
    ),
    ([key, betweenInlineTrivia, rest]) => {
      const valueStuff = rest ? rest[0] : undefined;
      const postTrivia = rest ? rest[1] : [];

      if (valueStuff === undefined) {
        // No value provided
        return astStringProperty(key, betweenInlineTrivia, undefined, postTrivia);
      }

      if (Array.isArray(valueStuff)) {
        // Object value due to line break
        const [endOfLine, multiTrivia, value] = valueStuff;
        const betweenTrivia = (betweenInlineTrivia as MultilineTrivia[])
          .concat([endOfLine])
          .concat(multiTrivia);

        return astObjectProperty(key, betweenTrivia, value, postTrivia);
      }

      if (valueStuff.type === "object") {
        // Object value due to bracket
        return astObjectProperty(
          key,
          betweenInlineTrivia,
          valueStuff,
          postTrivia
        );
      }

      // String value
      return astStringProperty(
        key,
        betweenInlineTrivia,
        valueStuff,
        postTrivia
      );
    }
  )
);

// --------------------------------------------------------------------
// Object
// --------------------------------------------------------------------
objectParser.setPattern(
  apply(
    seq(
      lBracketParser,
      rep_sc(alt(propertyParser, commentParser, indentParser, endOfLineParser)),
      opt_sc(rBracketParser)
    ),
    ([lBracket, content, rBracket]) => {
      return astObject(lBracket, content, rBracket);
    }
  )
);

// --------------------------------------------------------------------
// Root
// --------------------------------------------------------------------

// Almost the same as an object, but without the brackets.
rootParser.setPattern(
  apply(
    rep_sc(alt(propertyParser, commentParser, indentParser, endOfLineParser)),
    (children) => {
      return astRoot(children);
    }
  )
);
