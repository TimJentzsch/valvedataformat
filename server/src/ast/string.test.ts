import { getInlineRange } from "../parser/utils";
import AstString, {
  astQuotedString,
  astString,
  astUnquotedString,
} from "./string";

describe("astString", () => {
  test("should properly create quoted string", () => {
    const actual = astString(true, true, "value", getInlineRange(0, 0, 7));
    const expected: AstString = {
      type: "string",
      children: [],
      isQuoted: true,
      isTerminated: true,
      value: "value",
      range: getInlineRange(0, 0, 7),
    };

    expect(actual).toEqual(expected);
  });

  test("should properly create unquoted string", () => {
    const actual = astString(false, true, "value", getInlineRange(0, 0, 5));
    const expected: AstString = {
      type: "string",
      children: [],
      isQuoted: false,
      isTerminated: true,
      value: "value",
      range: getInlineRange(0, 0, 5),
    };

    expect(actual).toEqual(expected);
  });
});

describe("astQuotedString", () => {
  test("should properly create quoted terminated string", () => {
    const actual = astQuotedString(true, "value", getInlineRange(0, 0, 7));
    const expected: AstString = {
      type: "string",
      children: [],
      isQuoted: true,
      isTerminated: true,
      value: "value",
      range: getInlineRange(0, 0, 7),
    };

    expect(actual).toEqual(expected);
  });

  test("should properly create quoted unterminated string", () => {
    const actual = astQuotedString(false, "value", getInlineRange(0, 0, 6));
    const expected: AstString = {
      type: "string",
      children: [],
      isQuoted: true,
      isTerminated: false,
      value: "value",
      range: getInlineRange(0, 0, 6),
    };

    expect(actual).toEqual(expected);
  });
});

describe("astUnquotedString", () => {
  test("should properly create unquoted string", () => {
    const actual = astUnquotedString("value", getInlineRange(0, 0, 5));
    const expected: AstString = {
      type: "string",
      children: [],
      isQuoted: false,
      isTerminated: true,
      value: "value",
      range: getInlineRange(0, 0, 5),
    };

    expect(actual).toEqual(expected);
  });
});
