import { getInlineRange } from "../../parser/utils";
import AstIndent, { astIndent } from "../../ast/indent";

describe("astIndent", () => {
  test("should properly create indent node", () => {
    const actual = astIndent("  \t  ", getInlineRange(0, 0, 5));
    const expected: AstIndent = {
      type: "indent",
      children: [],
      value: "  \t  ",
      range: getInlineRange(0, 0, 5),
    };

    expect(actual).toEqual(expected);
  });
});
