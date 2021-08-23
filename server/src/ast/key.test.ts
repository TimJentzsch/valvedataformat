import { getInlineRange } from "../parser/utils";
import AstKey, { astKey, astKeyFromString, astQuotedKey, astUnquotedKey } from "./key";
import AstString from "./string";

describe("astKey", () => {
  test("should properly create quoted key", () => {
    const actual = astKey(true, true, "value", getInlineRange(0, 0, 7));
    const expected: AstKey = {
      type: "key",
      children: [],
      isQuoted: true,
      isTerminated: true,
      value: "value",
      range: getInlineRange(0, 0, 7),
    };

    expect(actual).toEqual(expected);
  });

  test("should properly create unquoted key", () => {
    const actual = astKey(false, true, "value", getInlineRange(0, 0, 5));
    const expected: AstKey = {
      type: "key",
      children: [],
      isQuoted: false,
      isTerminated: true,
      value: "value",
      range: getInlineRange(0, 0, 5),
    };

    expect(actual).toEqual(expected);
  });
});

describe("astQuotedKey", () => {
  test("should properly create quoted terminated key", () => {
    const actual = astQuotedKey(true, "value", getInlineRange(0, 0, 7));
    const expected: AstKey = {
      type: "key",
      children: [],
      isQuoted: true,
      isTerminated: true,
      value: "value",
      range: getInlineRange(0, 0, 7),
    };

    expect(actual).toEqual(expected);
  });

  test("should properly create quoted unterminated key", () => {
    const actual = astQuotedKey(false, "value", getInlineRange(0, 0, 6));
    const expected: AstKey = {
      type: "key",
      children: [],
      isQuoted: true,
      isTerminated: false,
      value: "value",
      range: getInlineRange(0, 0, 6),
    };

    expect(actual).toEqual(expected);
  });
});

describe("astUnquotedKey", () => {
  test("should properly create unquoted key", () => {
    const actual = astUnquotedKey("value", getInlineRange(0, 0, 5));
    const expected: AstKey = {
      type: "key",
      children: [],
      isQuoted: false,
      isTerminated: true,
      value: "value",
      range: getInlineRange(0, 0, 5),
    };

    expect(actual).toEqual(expected);
  });
});

describe("astKeyFromString", () => {
  test("should properly convert unquoted string node to key node", () => {
    const astString: AstString = {
      type: "string",
      children: [],
      isQuoted: false,
      isTerminated: true,
      value: "value",
      range: getInlineRange(0, 0, 5),
    };
    const actual = astKeyFromString(astString);
    const expected: AstKey = {
      type: "key",
      children: [],
      isQuoted: false,
      isTerminated: true,
      value: "value",
      range: getInlineRange(0, 0, 5),
    };

    expect(actual).toEqual(expected);
  });

  test("should properly convert quoted string node to key node", () => {
    const astString: AstString = {
      type: "string",
      children: [],
      isQuoted: true,
      isTerminated: true,
      value: "value",
      range: getInlineRange(0, 0, 7),
    };
    const actual = astKeyFromString(astString);
    const expected: AstKey = {
      type: "key",
      children: [],
      isQuoted: true,
      isTerminated: true,
      value: "value",
      range: getInlineRange(0, 0, 7),
    };

    expect(actual).toEqual(expected);
  });
});
