import { astLBracket, astRBracket } from "../../ast/bracket";
import { lBracketParser, rBracketParser } from "../../parser/parser";
import { applyParser, getInlineRange } from "../../parser/utils";

describe("lBracketParser", () => {
  test("should parse opening bracket", () => {
    const actual = applyParser(lBracketParser, "{");
    const expected = astLBracket(getInlineRange(0, 0, 1));

    expect(actual).toEqual(expected);
  });
});

describe("rBracketParser", () => {
  test("should parse closing bracket", () => {
    const actual = applyParser(rBracketParser, "}");
    const expected = astRBracket(getInlineRange(0, 0, 1));

    expect(actual).toEqual(expected);
  });
});
