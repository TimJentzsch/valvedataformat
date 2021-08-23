import { getInlineRange, getRange } from "../parser/utils";
import { astComment } from "./comment";
import { astLf } from "./endOfLine";
import { astIndent } from "./indent";
import { astUnquotedKey } from "./key";
import { astStringProperty } from "./property";
import AstRoot, { astRoot } from "./root";
import { astUnquotedString } from "./string";

describe("astRoot", () => {
  test("should create a root node", () => {
    const property = astStringProperty(
      astUnquotedKey("key", getInlineRange(1, 1, 4)),
      [astIndent("\t", getInlineRange(1, 4, 5))],
      astUnquotedString("value", getInlineRange(1, 5, 10))
    );
    const content = [
      astComment(" Comment", getInlineRange(0, 0, 10)),
      astLf(getRange(0, 10, 1, 0)),
      astIndent("\t", getInlineRange(1, 0, 1)),
      property,
      astLf(getRange(1, 10, 2, 0)),
    ];

    const actual = astRoot(content);

    const expected: AstRoot = {
      type: "root",
      children: content,
      properties: [property],
      range: getRange(0, 0, 2, 0),
    };

    expect(actual).toEqual(expected);
  });
});
