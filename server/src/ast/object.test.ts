import { getInlineRange, getRange } from "../parser/utils";
import { astLBracket, astRBracket } from "./bracket";
import { astLf } from "./endOfLine";
import { astIndent } from "./indent";
import { astUnquotedKey } from "./key";
import AstObject, { astObject } from "./object";
import { astStringProperty } from "./property";
import { astUnquotedString } from "./string";

describe("astObject", () => {
  test("should create an object node", () => {
    const lBracket = astLBracket(getInlineRange(0, 0, 1));
    const property = astStringProperty(
      astUnquotedKey("key", getInlineRange(1, 1, 4)),
      astUnquotedString("value", getInlineRange(1, 5, 10)),
      [astIndent("\t", getInlineRange(1, 4, 5))]
    );
    const content = [
      astLf(getRange(0, 1, 1, 0)),
      astIndent("\t", getInlineRange(1, 0, 1)),
      property,
      astLf(getRange(1, 10, 2, 0)),
    ];
    const rBracket = astRBracket(getInlineRange(2, 0, 1));

    const actual = astObject(lBracket, content, rBracket);

    const expected: AstObject = {
      type: "object",
      children: [lBracket, ...content, rBracket],
      properties: [property],
      isTerminated: true,
      range: getRange(0, 0, 2, 1),
    };

    expect(actual).toEqual(expected);
  });
});
