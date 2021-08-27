import { getInlineRange } from "../../parser/utils";
import AstComment, { astComment } from "../../ast/comment";
import { NodeType } from "../../ast/baseNode";

describe("astComment", () => {
  test("should properly create quoted string", () => {
    const actual = astComment(" Comment", getInlineRange(0, 0, 10));
    const expected: AstComment = {
      type: NodeType.comment,
      children: [],
      value: " Comment",
      range: getInlineRange(0, 0, 10),
    };

    expect(actual).toEqual(expected);
  });
});
