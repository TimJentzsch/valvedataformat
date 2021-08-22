import { getInlineRange } from "../parser/utils";
import AstSpace, { astSpace } from "./space";

describe("astSpace", () => {
  test("should properly create space node", () => {
    const actual = astSpace("  \t  ", getInlineRange(0, 0, 5));
    const expected: AstSpace = {
      type: "space",
      children: [],
      value: "  \t  ",
      range: getInlineRange(0, 0, 5),
    };

    expect(actual).toEqual(expected);
  });
});
