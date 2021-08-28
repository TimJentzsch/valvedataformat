import { getInlineRange, getRange } from "../../parser/utils";
import { astComment } from "../../ast/comment";
import { astLf } from "../../ast/endOfLine";
import { astTabs } from "../../ast/indent";
import { astUnquotedKey } from "../../ast/key";
import { astStringProperty } from "../../ast/property";
import AstRoot, { astRoot } from "../../ast/root";
import { astUnquotedString } from "../../ast/string";
import { NodeType } from "../../ast/baseNode";

describe("astRoot", () => {
  test("should create a root node", () => {
    const property = astStringProperty(
      astUnquotedKey("key", getInlineRange(1, 1, 4)),
      [astTabs(1, getInlineRange(1, 4, 5))],
      astUnquotedString("value", getInlineRange(1, 5, 10))
    );
    const content = [
      astComment(" Comment", getInlineRange(0, 0, 10)),
      astLf(getRange(0, 10, 1, 0)),
      astTabs(1, getInlineRange(1, 0, 1)),
      property,
      astLf(getRange(1, 10, 2, 0)),
    ];

    const actual = astRoot(content);

    const expected: AstRoot = {
      type: NodeType.root,
      children: content,
      properties: [property],
      range: getRange(0, 0, 2, 0),
    };

    expect(actual).toEqual(expected);
  });
});
