import { getInlineRange, getRange } from "../../parser/utils";
import { astLBracket, astRBracket } from "../../ast/bracket";
import { astLf } from "../../ast/endOfLine";
import { astIndent } from "../../ast/indent";
import { astUnquotedKey } from "../../ast/key";
import AstObject, { astObject } from "../../ast/object";
import { astStringProperty } from "../../ast/property";
import { astUnquotedString } from "../../ast/string";
import { NodeType } from "../../ast/baseNode";

describe("astObject", () => {
  test("should create an object node", () => {
    const lBracket = astLBracket(getInlineRange(0, 0, 1));
    const property = astStringProperty(
      astUnquotedKey("key", getInlineRange(1, 1, 4)),
      [astIndent("\t", getInlineRange(1, 4, 5))],
      astUnquotedString("value", getInlineRange(1, 5, 10))
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
      type: NodeType.object,
      children: [lBracket, ...content, rBracket],
      properties: [property],
      lBracket,
      rBracket,
      range: getRange(0, 0, 2, 1),
    };

    expect(actual).toEqual(expected);
  });
});
