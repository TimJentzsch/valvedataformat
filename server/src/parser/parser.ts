import { alt, apply, opt_sc, rep_sc, rule, seq, tok } from "typescript-parsec";
import AstComment, { astComment } from "../ast/comment";
import AstEndOfLine, { astEndOfLine, EolType } from "../ast/endOfLine";
import AstKey, { astKeyFromString } from "../ast/key";
import AstIndent, { astSpaces, astTabs } from "../ast/indent";
import AstString, { astQuotedString, astUnquotedString } from "../ast/string";
import { VdfToken } from "../lexer/lexer";
import { getRangeFromToken } from "./utils";
import { InlineTrivia, MultilineTrivia } from "../ast/trivia";
import AstProperty, {
  astObjectProperty,
  astStringProperty,
} from "../ast/property";
import AstBracket, { astLBracket, astRBracket } from "../ast/bracket";
import AstObject, { astObject } from "../ast/object";
import AstRoot, { astRoot } from "../ast/root";
import { NodeType } from "../ast/baseNode";

// To avoid circular imports, all parsers are defined in a single file

// ====================================================================
// DECLARATIONS
// ====================================================================

/** Parse a comment. */
export const commentParser = rule<VdfToken, AstComment>();

/** Parse an opening bracket. */
export const lBracketParser = rule<VdfToken, AstBracket>();

/** Parse a closing bracket. */
export const rBracketParser = rule<VdfToken, AstBracket>();

/** Parse a string literal value. */
export const stringParser = rule<VdfToken, AstString>();

/** Parse a property key. */
export const keyParser = rule<VdfToken, AstKey>();

/** Parse spaces and tabs (no line endings). */
export const indentParser = rule<VdfToken, AstIndent>();

/** Parse line endings. */
export const endOfLineParser = rule<VdfToken, AstEndOfLine>();

/** Parse inline trivia (spaces, tabs and comments). */
export const inlineTriviaParser = rule<VdfToken, InlineTrivia[]>();

/** Parse multiline trivia (spaces, tabs, comments and line endings). */
export const multilineTriviaParser = rule<VdfToken, MultilineTrivia[]>();

/** Parse properties of an object. */
export const propertyParser = rule<VdfToken, AstProperty>();

/** Parse an object. */
export const objectParser = rule<VdfToken, AstObject>();

/** Parse the root, i.e. a VDF document. */
export const rootParser = rule<VdfToken, AstRoot>();

// ====================================================================
// DEFINITIONS
// ====================================================================

// --------------------------------------------------------------------
// Comment
// --------------------------------------------------------------------
commentParser.setPattern(
  apply(tok(VdfToken.comment), (token) => {
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
  apply(tok(VdfToken.lBracket), (token) => {
    const range = getRangeFromToken(token);

    return astLBracket(range);
  })
);

// Closing bracket
rBracketParser.setPattern(
  apply(tok(VdfToken.rBracket), (token) => {
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
    apply(tok(VdfToken.quotedString), (token) => {
      const text = token.text;
      const isTerminated = text.length >= 2 && text[text.length - 1] === '"';
      const value = isTerminated
        ? text.slice(1, text.length - 1)
        : text.slice(1);
      const range = getRangeFromToken(token);

      return astQuotedString(value, range, isTerminated);
    }),
    // Unquoted string
    apply(tok(VdfToken.unquotedString), (token) => {
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
  alt(
    apply(tok(VdfToken.spaces), (token) => {
      const range = getRangeFromToken(token);
  
      return astSpaces(token.text.length, range);
    }),
    apply(tok(VdfToken.tabs), (token) => {
      const range = getRangeFromToken(token);
  
      return astTabs(token.text.length, range);
    }),
  )
);

// --------------------------------------------------------------------
// End of line
// --------------------------------------------------------------------
endOfLineParser.setPattern(
  apply(tok(VdfToken.endOfLine), (token) => {
    const eolType = token.text === "\n" ? EolType.lf : EolType.crlf;
    const range = getRangeFromToken(token);

    return astEndOfLine(eolType, range);
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
  // It's either a key with optional value or an object without key.
  alt(
    // Key with optional value
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
          return astStringProperty(
            key,
            betweenInlineTrivia,
            undefined,
            postTrivia
          );
        }

        if (Array.isArray(valueStuff)) {
          // Object value due to line break
          const [endOfLine, multiTrivia, value] = valueStuff;
          const betweenTrivia = (betweenInlineTrivia as MultilineTrivia[])
            .concat([endOfLine])
            .concat(multiTrivia);

          return astObjectProperty(key, betweenTrivia, value, postTrivia);
        }

        if (valueStuff.type === NodeType.object) {
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
    ),
    // Object without key
    apply(seq(objectParser, inlineTriviaParser), ([value, postTrivia]) => {
      return astObjectProperty(undefined, [], value, postTrivia);
    })
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
    rep_sc(
      alt(
        propertyParser,
        commentParser,
        indentParser,
        endOfLineParser,
        apply(rBracketParser, (rBracket) => {
          return astObjectProperty(
            undefined,
            [],
            astObject(undefined, [], rBracket)
          );
        })
      )
    ),
    (children) => {
      return astRoot(children);
    }
  )
);
