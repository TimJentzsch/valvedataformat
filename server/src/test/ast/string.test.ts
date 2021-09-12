import { getInlineRange } from "../../parser/utils";
import AstString, {
  astQuotedString,
  astString,
  astUnquotedString,
} from "../../ast/string";
import { NodeType } from "../../ast/baseNode";

describe("astString", () => {
  test("should properly create quoted string", () => {
    const actual = astString(true, "value", getInlineRange(0, 0, 7));
    const expected: AstString = {
      type: NodeType.string,
      children: [],
      isQuoted: true,
      isTerminated: true,
      content: "value",
      range: getInlineRange(0, 0, 7),
    };

    expect(actual).toEqual(expected);
  });

  test("should properly create unquoted string", () => {
    const actual = astString(false, "value", getInlineRange(0, 0, 5));
    const expected: AstString = {
      type: NodeType.string,
      children: [],
      isQuoted: false,
      isTerminated: true,
      content: "value",
      range: getInlineRange(0, 0, 5),
    };

    expect(actual).toEqual(expected);
  });
});

describe("astQuotedString", () => {
  test("should properly create quoted terminated string", () => {
    const actual = astQuotedString("value", getInlineRange(0, 0, 7));
    const expected: AstString = {
      type: NodeType.string,
      children: [],
      isQuoted: true,
      isTerminated: true,
      content: "value",
      range: getInlineRange(0, 0, 7),
    };

    expect(actual).toEqual(expected);
  });

  test("should properly create quoted unterminated string", () => {
    const actual = astQuotedString("value", getInlineRange(0, 0, 6), false);
    const expected: AstString = {
      type: NodeType.string,
      children: [],
      isQuoted: true,
      isTerminated: false,
      content: "value",
      range: getInlineRange(0, 0, 6),
    };

    expect(actual).toEqual(expected);
  });
});

describe("astUnquotedString", () => {
  test("should properly create unquoted string", () => {
    const actual = astUnquotedString("value", getInlineRange(0, 0, 5));
    const expected: AstString = {
      type: NodeType.string,
      children: [],
      isQuoted: false,
      isTerminated: true,
      content: "value",
      range: getInlineRange(0, 0, 5),
    };

    expect(actual).toEqual(expected);
  });
});
