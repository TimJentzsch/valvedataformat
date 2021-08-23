import { astLBracket, astRBracket } from "../ast/bracket";
import { astLf } from "../ast/endOfLine";
import { astIndent } from "../ast/indent";
import { astUnquotedKey } from "../ast/key";
import AstObject, { astObject } from "../ast/object";
import { astStringProperty } from "../ast/property";
import { astUnquotedString } from "../ast/string";
import { objectParser } from "./parser";
import { applyParser, getInlineRange, getRange } from "./utils";

// Object parsing
describe("objectParser", () => {
  const params: Array<[string, AstObject]> = [
    [
      "{\n\tkey\tvalue\n}",
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [
          astLf(getRange(0, 1, 1, 0)),
          astIndent("\t", getInlineRange(1, 0, 1)),
          astStringProperty(
            astUnquotedKey("key", getInlineRange(1, 1, 4)),
            astUnquotedString("value", getInlineRange(1, 5, 10)),
            [astIndent("\t", getInlineRange(1, 4, 5))]
          ),
          astLf(getRange(1, 10, 2, 0)),
        ],
        astRBracket(getInlineRange(2, 0, 1))
      ),
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(objectParser, input);
      console.debug(JSON.stringify(actual, undefined, 2));
      expect(actual).toEqual(expected);
    });
  }
});
