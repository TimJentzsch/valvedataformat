import { astLBracket, astRBracket } from "../ast/bracket";
import { astComment } from "../ast/comment";
import { astLf } from "../ast/endOfLine";
import { astIndent } from "../ast/indent";
import { astQuotedKey, astUnquotedKey } from "../ast/key";
import { astObject } from "../ast/object";
import AstProperty, {
  astObjectProperty,
  astStringProperty,
} from "../ast/property";
import { astQuotedString, astUnquotedString } from "../ast/string";
import { propertyParser } from "./parser";
import { applyParser, getInlineRange, getRange } from "./utils";

// Properties
describe("propertyParser", () => {
  // String properties
  describe("should parse string properties", () => {
    const stringParams: Array<[string, AstProperty]> = [
      [
        "key value",
        astStringProperty(
          astUnquotedKey("key", getInlineRange(0, 0, 3)),
          [astIndent(" ", getInlineRange(0, 3, 4))],
          astUnquotedString("value", getInlineRange(0, 4, 9))
        ),
      ],
      [
        "key\tvalue",
        astStringProperty(
          astUnquotedKey("key", getInlineRange(0, 0, 3)),
          [astIndent("\t", getInlineRange(0, 3, 4))],
          astUnquotedString("value", getInlineRange(0, 4, 9))
        ),
      ],
      [
        '"key" "value"',
        astStringProperty(
          astQuotedKey("key", getInlineRange(0, 0, 5)),
          [astIndent(" ", getInlineRange(0, 5, 6))],
          astQuotedString("value", getInlineRange(0, 6, 13))
        ),
      ],
      [
        '"key""value"',
        astStringProperty(
          astQuotedKey("key", getInlineRange(0, 0, 5)),
          [],
          astQuotedString("value", getInlineRange(0, 5, 12))
        ),
      ],
      [
        '"key" "value',
        astStringProperty(
          astQuotedKey("key", getInlineRange(0, 0, 5)),
          [astIndent(" ", getInlineRange(0, 5, 6))],
          astQuotedString("value", getInlineRange(0, 6, 12), false)
        ),
      ],
      [
        '"key and // stuff',
        astStringProperty(
          astQuotedKey("key and // stuff", getInlineRange(0, 0, 17), false)
        ),
      ],
      [
        '"key" "value" // Comment',
        astStringProperty(
          astQuotedKey("key", getInlineRange(0, 0, 5)),
          [astIndent(" ", getInlineRange(0, 5, 6))],
          astQuotedString("value", getInlineRange(0, 6, 13)),
          [
            astIndent(" ", getInlineRange(0, 13, 14)),
            astComment(" Comment", getInlineRange(0, 14, 24)),
          ]
        ),
      ],
      [
        "key // Comment",
        astStringProperty(astUnquotedKey("key", getInlineRange(0, 0, 3)), [
          astIndent(" ", getInlineRange(0, 3, 4)),
          astComment(" Comment", getInlineRange(0, 4, 14)),
        ]),
      ],
    ];

    for (const [input, expected] of stringParams) {
      test(input, () => {
        const actual = applyParser(propertyParser, input);
        expect(actual).toEqual(expected);
      });
    }
  });

  // Object properties
  describe("should parse object properties", () => {
    const objectParams: Array<[string, AstProperty]> = [
      [
        "key {}",
        astObjectProperty(
          astUnquotedKey("key", getInlineRange(0, 0, 3)),
          [astIndent(" ", getInlineRange(0, 3, 4))],
          astObject(
            astLBracket(getInlineRange(0, 4, 5)),
            [],
            astRBracket(getInlineRange(0, 5, 6))
          )
        ),
      ],
      [
        "key { key value }",
        astObjectProperty(
          astUnquotedKey("key", getInlineRange(0, 0, 3)),
          [astIndent(" ", getInlineRange(0, 3, 4))],
          astObject(
            astLBracket(getInlineRange(0, 4, 5)),
            [
              astIndent(" ", getInlineRange(0, 5, 6)),
              astStringProperty(
                astUnquotedKey("key", getInlineRange(0, 6, 9)),
                [astIndent(" ", getInlineRange(0, 9, 10))],
                astUnquotedString("value", getInlineRange(0, 10, 15)),
                [astIndent(" ", getInlineRange(0, 15, 16))]
              ),
            ],
            astRBracket(getInlineRange(0, 16, 17))
          )
        ),
      ],
      [
        "key\n{ key value }",
        astObjectProperty(
          astUnquotedKey("key", getInlineRange(0, 0, 3)),
          [astLf(getRange(0, 3, 1, 0))],
          astObject(
            astLBracket(getInlineRange(1, 0, 1)),
            [
              astIndent(" ", getInlineRange(1, 1, 2)),
              astStringProperty(
                astUnquotedKey("key", getInlineRange(1, 2, 5)),
                [astIndent(" ", getInlineRange(1, 5, 6))],
                astUnquotedString("value", getInlineRange(1, 6, 11)),
                [astIndent(" ", getInlineRange(1, 11, 12))]
              ),
            ],
            astRBracket(getInlineRange(1, 12, 13))
          )
        ),
      ],
      [
        "key\n// Comment\n{ key value }",
        astObjectProperty(
          astUnquotedKey("key", getInlineRange(0, 0, 3)),
          [
            astLf(getRange(0, 3, 1, 0)),
            astComment(" Comment", getInlineRange(1, 0, 10)),
            astLf(getRange(1, 10, 2, 0)),
          ],
          astObject(
            astLBracket(getInlineRange(2, 0, 1)),
            [
              astIndent(" ", getInlineRange(2, 1, 2)),
              astStringProperty(
                astUnquotedKey("key", getInlineRange(2, 2, 5)),
                [astIndent(" ", getInlineRange(2, 5, 6))],
                astUnquotedString("value", getInlineRange(2, 6, 11)),
                [astIndent(" ", getInlineRange(2, 11, 12))]
              ),
            ],
            astRBracket(getInlineRange(2, 12, 13))
          )
        ),
      ],
      [
        "key\n{\n\tkey\tvalue\n}",
        astObjectProperty(
          astUnquotedKey("key", getInlineRange(0, 0, 3)),
          [astLf(getRange(0, 3, 1, 0))],
          astObject(
            astLBracket(getInlineRange(1, 0, 1)),
            [
              astLf(getRange(1, 1, 2, 0)),
              astIndent("\t", getInlineRange(2, 0, 1)),
              astStringProperty(
                astUnquotedKey("key", getInlineRange(2, 1, 4)),
                [astIndent("\t", getInlineRange(2, 4, 5))],
                astUnquotedString("value", getInlineRange(2, 5, 10))
              ),
              astLf(getRange(2, 10, 3, 0)),
            ],
            astRBracket(getInlineRange(3, 0, 1))
          )
        ),
      ],
      [
        "key\n{\n\tkey\tvalue\n}",
        astObjectProperty(
          astUnquotedKey("key", getInlineRange(0, 0, 3)),
          [astLf(getRange(0, 3, 1, 0))],
          astObject(
            astLBracket(getInlineRange(1, 0, 1)),
            [
              astLf(getRange(1, 1, 2, 0)),
              astIndent("\t", getInlineRange(2, 0, 1)),
              astStringProperty(
                astUnquotedKey("key", getInlineRange(2, 1, 4)),
                [astIndent("\t", getInlineRange(2, 4, 5))],
                astUnquotedString("value", getInlineRange(2, 5, 10))
              ),
              astLf(getRange(2, 10, 3, 0)),
            ],
            astRBracket(getInlineRange(3, 0, 1))
          )
        ),
      ],
      [
        "{}",
        astObjectProperty(
          undefined,
          [],
          astObject(
            astLBracket(getInlineRange(0, 0, 1)),
            [],
            astRBracket(getInlineRange(0, 1, 2))
          )
        ),
      ],
      [
        "{ key value }",
        astObjectProperty(
          undefined,
          [],
          astObject(
            astLBracket(getInlineRange(0, 0, 1)),
            [
              astIndent(" ", getInlineRange(0, 1, 2)),
              astStringProperty(
                astUnquotedKey("key", getInlineRange(0, 2, 5)),
                [astIndent(" ", getInlineRange(0, 5, 6))],
                astUnquotedString("value", getInlineRange(0, 6, 11)),
                [astIndent(" ", getInlineRange(0, 11, 12))]
              ),
            ],
            astRBracket(getInlineRange(0, 12, 13))
          )
        ),
      ],
    ];

    for (const [input, expected] of objectParams) {
      test(input, () => {
        const actual = applyParser(propertyParser, input);
        expect(actual).toEqual(expected);
      });
    }
  });
});
