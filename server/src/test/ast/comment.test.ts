import { getInlineRange } from "../../parser/utils";
import AstComment, { astComment } from "../../ast/comment";

describe("astComment", () => {
  test("should properly create quoted string", () => {
    const actual = astComment(" Comment", getInlineRange(0, 0, 10));
    const expected: AstComment = {
      type: "comment",
      children: [],
      value: " Comment",
      range: getInlineRange(0, 0, 10),
    };

    expect(actual).toEqual(expected);
  });
});
