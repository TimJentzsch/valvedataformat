import { astLBracket, astRBracket } from "../../ast/bracket";
import { astLf } from "../../ast/endOfLine";
import { astSpaces, astTabs } from "../../ast/indent";
import { astUnquotedKey, astQuotedKey } from "../../ast/key";
import { astObject } from "../../ast/object";
import { astStringProperty, astObjectProperty } from "../../ast/property";
import AstRoot, { astRoot } from "../../ast/root";
import { astUnquotedString, astQuotedString } from "../../ast/string";
import { getInlineRange, getRange } from "../../parser/utils";
import { astNodeToString } from "../../utils/nodeToString";

// Converting an AST node to a string
// Should be the reverse of parsing
describe("astNodeToString", () => {
  // First argument is expected output and second argument is AST node input
  // (I copied it over from the root parsing test and was too lazy to switch them)
  const params: Array<[string, AstRoot]> = [
    ["", astRoot([])],
    [
      "key value",
      astRoot([
        astStringProperty(
          astUnquotedKey("key", getInlineRange(0, 0, 3)),
          [astSpaces(1, getInlineRange(0, 3, 4))],
          astUnquotedString("value", getInlineRange(0, 4, 9))
        ),
      ]),
    ],
    [
      '"key" "value"',
      astRoot([
        astStringProperty(
          astQuotedKey("key", getInlineRange(0, 0, 5)),
          [astSpaces(1, getInlineRange(0, 5, 6))],
          astQuotedString("value", getInlineRange(0, 6, 13))
        ),
      ]),
    ],
    [
      '"key"\t"value"',
      astRoot([
        astStringProperty(
          astQuotedKey("key", getInlineRange(0, 0, 5)),
          [astTabs(1, getInlineRange(0, 5, 6))],
          astQuotedString("value", getInlineRange(0, 6, 13))
        ),
      ]),
    ],
    [
      '\n"key"\t"value"\n',
      astRoot([
        astLf(getRange(0, 0, 1, 0)),
        astStringProperty(
          astQuotedKey("key", getInlineRange(1, 0, 5)),
          [astTabs(1, getInlineRange(1, 5, 6))],
          astQuotedString("value", getInlineRange(1, 6, 13))
        ),
        astLf(getRange(1, 13, 2, 0)),
      ]),
    ],
    [
      "key1\tvalue1\nkey2\tvalue2\n",
      astRoot([
        astStringProperty(
          astUnquotedKey("key1", getInlineRange(0, 0, 4)),
          [astTabs(1, getInlineRange(0, 4, 5))],
          astUnquotedString("value1", getInlineRange(0, 5, 11))
        ),
        astLf(getRange(0, 11, 1, 0)),
        astStringProperty(
          astUnquotedKey("key2", getInlineRange(1, 0, 4)),
          [astTabs(1, getInlineRange(1, 4, 5))],
          astUnquotedString("value2", getInlineRange(1, 5, 11))
        ),
        astLf(getRange(1, 11, 2, 0)),
      ]),
    ],
    [
      "{",
      astRoot([
        astObjectProperty(
          undefined,
          [],
          astObject(astLBracket(getInlineRange(0, 0, 1)), [])
        ),
      ]),
    ],
    [
      "{{",
      astRoot([
        astObjectProperty(
          undefined,
          [],
          astObject(astLBracket(getInlineRange(0, 0, 1)), [
            astObjectProperty(
              undefined,
              [],
              astObject(astLBracket(getInlineRange(0, 1, 2)), [])
            ),
          ])
        ),
      ]),
    ],
    [
      "{ key value",
      astRoot([
        astObjectProperty(
          undefined,
          [],
          astObject(astLBracket(getInlineRange(0, 0, 1)), [
            astSpaces(1, getInlineRange(0, 1, 2)),
            astStringProperty(
              astUnquotedKey("key", getInlineRange(0, 2, 5)),
              [astSpaces(1, getInlineRange(0, 5, 6))],
              astUnquotedString("value", getInlineRange(0, 6, 11))
            ),
          ])
        ),
      ]),
    ],
    [
      "}",
      astRoot([
        astObjectProperty(
          undefined,
          [],
          astObject(undefined, [], astRBracket(getInlineRange(0, 0, 1)))
        ),
      ]),
    ],
    [
      "{}",
      astRoot([
        astObjectProperty(
          undefined,
          [],
          astObject(
            astLBracket(getInlineRange(0, 0, 1)),
            [],
            astRBracket(getInlineRange(0, 1, 2))
          )
        ),
      ]),
    ],
    [
      "key {}",
      astRoot([
        astObjectProperty(
          astUnquotedKey("key", getInlineRange(0, 0, 3)),
          [astSpaces(1, getInlineRange(0, 3, 4))],
          astObject(
            astLBracket(getInlineRange(0, 4, 5)),
            [],
            astRBracket(getInlineRange(0, 5, 6))
          )
        ),
      ]),
    ],
    [
      "key {",
      astRoot([
        astObjectProperty(
          astUnquotedKey("key", getInlineRange(0, 0, 3)),
          [astSpaces(1, getInlineRange(0, 3, 4))],
          astObject(astLBracket(getInlineRange(0, 4, 5)), [])
        ),
      ]),
    ],
    [
      "key }",
      astRoot([
        astStringProperty(astUnquotedKey("key", getInlineRange(0, 0, 3)), [
          astSpaces(1, getInlineRange(0, 3, 4)),
        ]),
        astObjectProperty(
          undefined,
          [],
          astObject(undefined, [], astRBracket(getInlineRange(0, 4, 5)))
        ),
      ]),
    ],
    [
      '"object"\t{\n\t"string"\t"value"\n}',
      astRoot([
        astObjectProperty(
          astQuotedKey("object", getInlineRange(0, 0, 8)),
          [astTabs(1, getInlineRange(0, 8, 9))],
          astObject(
            astLBracket(getInlineRange(0, 9, 10)),
            [
              astLf(getRange(0, 10, 1, 0)),
              astTabs(1, getInlineRange(1, 0, 1)),
              astStringProperty(
                astQuotedKey("string", getInlineRange(1, 1, 9)),
                [astTabs(1, getInlineRange(1, 9, 10))],
                astQuotedString("value", getInlineRange(1, 10, 17))
              ),
              astLf(getRange(1, 17, 2, 0)),
            ],
            astRBracket(getInlineRange(2, 0, 1))
          )
        ),
      ]),
    ],
    [
      '"object"\t{\n\t"nested"\t{}\n}',
      astRoot([
        astObjectProperty(
          astQuotedKey("object", getInlineRange(0, 0, 8)),
          [astTabs(1, getInlineRange(0, 8, 9))],
          astObject(
            astLBracket(getInlineRange(0, 9, 10)),
            [
              astLf(getRange(0, 10, 1, 0)),
              astTabs(1, getInlineRange(1, 0, 1)),
              astObjectProperty(
                astQuotedKey("nested", getInlineRange(1, 1, 9)),
                [astTabs(1, getInlineRange(1, 9, 10))],
                astObject(
                  astLBracket(getInlineRange(1, 10, 11)),
                  [],
                  astRBracket(getInlineRange(1, 11, 12))
                )
              ),
              astLf(getRange(1, 12, 2, 0)),
            ],
            astRBracket(getInlineRange(2, 0, 1))
          )
        ),
      ]),
    ],
  ];

  for (const [expected, input] of params) {
    test(expected, () => {
      const actual = astNodeToString(input);
      expect(actual).toEqual(expected);
    });
  }
});
