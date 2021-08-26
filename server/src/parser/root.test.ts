import { astLBracket, astRBracket } from "../ast/bracket";
import { astLf } from "../ast/endOfLine";
import { astIndent } from "../ast/indent";
import { astQuotedKey, astUnquotedKey } from "../ast/key";
import { astObject } from "../ast/object";
import { astObjectProperty, astStringProperty } from "../ast/property";
import AstRoot, { astRoot } from "../ast/root";
import { astQuotedString, astUnquotedString } from "../ast/string";
import { rootParser } from "./parser";
import { applyParser, getInlineRange, getRange } from "./utils";

// Root parsing, i.e. parsing a VDF document
describe("rootParser", () => {
  const params: Array<[string, AstRoot]> = [
    ["", astRoot([])],
    [
      "key value",
      astRoot([
        astStringProperty(
          astUnquotedKey("key", getInlineRange(0, 0, 3)),
          [astIndent(" ", getInlineRange(0, 3, 4))],
          astUnquotedString("value", getInlineRange(0, 4, 9))
        ),
      ]),
    ],
    [
      '"key" "value"',
      astRoot([
        astStringProperty(
          astQuotedKey("key", getInlineRange(0, 0, 5)),
          [astIndent(" ", getInlineRange(0, 5, 6))],
          astQuotedString("value", getInlineRange(0, 6, 13))
        ),
      ]),
    ],
    [
      '"key"\t"value"',
      astRoot([
        astStringProperty(
          astQuotedKey("key", getInlineRange(0, 0, 5)),
          [astIndent("\t", getInlineRange(0, 5, 6))],
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
          [astIndent("\t", getInlineRange(1, 5, 6))],
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
          [astIndent("\t", getInlineRange(0, 4, 5))],
          astUnquotedString("value1", getInlineRange(0, 5, 11))
        ),
        astLf(getRange(0, 11, 1, 0)),
        astStringProperty(
          astUnquotedKey("key2", getInlineRange(1, 0, 4)),
          [astIndent("\t", getInlineRange(1, 4, 5))],
          astUnquotedString("value2", getInlineRange(1, 5, 11))
        ),
        astLf(getRange(1, 11, 2, 0)),
      ]),
    ],
    [
      "}",
      astRoot([astObjectProperty(undefined, [], astObject(undefined, [], astRBracket(getInlineRange(0, 0, 1))))]),
    ],
    [
      "key {}",
      astRoot([
        astObjectProperty(
          astUnquotedKey("key", getInlineRange(0, 0, 3)),
          [astIndent(" ", getInlineRange(0, 3, 4))],
          astObject(
            astLBracket(getInlineRange(0, 4, 5)),
            [],
            astRBracket(getInlineRange(0, 5, 6))
          )
        ),
      ]),
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(rootParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
