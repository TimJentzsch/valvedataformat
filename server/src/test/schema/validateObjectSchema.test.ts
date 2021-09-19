import { Range } from "vscode-languageserver/node";
import { astLBracket, astRBracket } from "../../ast/bracket";
import { astLf } from "../../ast/endOfLine";
import { astTabs } from "../../ast/indent";
import { astQuotedKey } from "../../ast/key";
import AstNode from "../../ast/node";
import { astObject } from "../../ast/object";
import { astStringProperty } from "../../ast/property";
import { astQuotedString, astUnquotedString } from "../../ast/string";
import { getInlineRange, getRange } from "../../parser/utils";
import annotateSchema from "../../schema/schemaAnnotation";
import validateNodeSchema from "../../schema/schemaValidation";

describe("validateObjectSchema", () => {
  // The name of the test, the node to validate, the expected diagnostic ranges
  const params: Array<[string, AstNode, Range[]]> = [
    [
      "should return no errors for valid empty object",
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [],
        astRBracket(getInlineRange(0, 1, 2)),
        { type: "object" }
      ),
      [],
    ],
    [
      "should return no errors for valid complex object",
      annotateSchema(
        astObject(
          astLBracket(getInlineRange(0, 0, 1)),
          [
            astLf(getRange(0, 1, 1, 0)),
            astStringProperty(
              astQuotedKey("foo", getInlineRange(1, 0, 5)),
              [astTabs(1, getInlineRange(1, 5, 6))],
              astQuotedString("123", getInlineRange(1, 6, 11))
            ),
            astLf(getRange(1, 11, 2, 0)),
            astStringProperty(
              astQuotedKey("20", getInlineRange(2, 0, 4)),
              [astTabs(1, getInlineRange(2, 4, 5))],
              astQuotedString("1", getInlineRange(2, 5, 6))
            ),
            astLf(getRange(2, 6, 3, 0)),
            astStringProperty(
              astQuotedKey("bar", getInlineRange(3, 0, 5)),
              [astTabs(1, getInlineRange(3, 5, 6))],
              astQuotedString("content", getInlineRange(3, 6, 15))
            ),
            astLf(getRange(3, 15, 4, 0)),
          ],
          astRBracket(getInlineRange(4, 0, 1))
        ),
        {
          type: "object",
          properties: {
            foo: {
              type: "integer",
            },
          },
          patternProperties: {
            "^\\d+$": {
              type: "boolean",
            },
          },
          additionalProperties: { type: "string" },
        }
      ),
      [],
    ],
    [
      "should return errors for invalid object properties",
      annotateSchema(
        astObject(
          astLBracket(getInlineRange(0, 0, 1)),
          [
            astLf(getRange(0, 1, 1, 0)),
            astStringProperty(
              astQuotedKey("foo", getInlineRange(1, 0, 5)),
              [astTabs(1, getInlineRange(1, 5, 6))],
              astQuotedString("123", getInlineRange(1, 6, 11))
            ),
            astLf(getRange(1, 11, 2, 0)),
            astStringProperty(
              astQuotedKey("20", getInlineRange(2, 0, 4)),
              [astTabs(1, getInlineRange(2, 4, 5))],
              astQuotedString("1", getInlineRange(2, 5, 6))
            ),
            astLf(getRange(2, 6, 3, 0)),
            astStringProperty(
              astQuotedKey("bar", getInlineRange(3, 0, 5)),
              [astTabs(1, getInlineRange(3, 5, 6))],
              astQuotedString("content", getInlineRange(3, 6, 15))
            ),
            astLf(getRange(3, 15, 4, 0)),
          ],
          astRBracket(getInlineRange(4, 0, 1))
        ),
        {
          type: "object",
          properties: {
            foo: {
              type: "boolean",
            },
          },
          patternProperties: {
            "^\\d+$": {
              type: "null",
            },
          },
          additionalProperties: false,
        }
      ),
      [
        getInlineRange(1, 6, 11),
        getInlineRange(2, 5, 6),
        getInlineRange(3, 6, 15),
      ],
    ],
    [
      "should return error for string",
      astUnquotedString("content", getInlineRange(0, 0, 7), { type: "object" }),
      [getInlineRange(0, 0, 7)],
    ],
  ];

  for (const [name, node, expectedRanges] of params) {
    test(name, async () => {
      const diagnostics = await validateNodeSchema(node);
      const actualRanges = diagnostics.map((diag) => diag.range);
      expect(actualRanges).toEqual(expectedRanges);
    });
  }
});
