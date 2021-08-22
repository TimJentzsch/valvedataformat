import AstString from "../ast/string";
import stringParser from "./string";
import { applyParser, getInlineRange } from "./utils";

// Unquoted string parsing
describe("should parse unquoted string", () => {
  const params: Array<[string, AstString]> = [
    [
      "value",
      {
        type: "string",
        children: [],
        isQuoted: false,
        isTerminated: true,
        value: "value",
        range: getInlineRange(0, 0, 5),
      },
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(stringParser, input);
      expect(actual).toEqual(expected);
    });
  }
});

// Quoted string parsing
describe("should parse quoted string", () => {
  const params: Array<[string, AstString]> = [
    [
      '""',
      {
        type: "string",
        children: [],
        isQuoted: true,
        isTerminated: true,
        value: "",
        range: getInlineRange(0, 0, 2),
      },
    ],
    [
      '"',
      {
        type: "string",
        children: [],
        isQuoted: true,
        isTerminated: false,
        value: "",
        range: getInlineRange(0, 0, 1),
      },
    ],
    [
      '"value"',
      {
        type: "string",
        children: [],
        isQuoted: true,
        isTerminated: true,
        value: "value",
        range: getInlineRange(0, 0, 7),
      },
    ],
    [
      '"value',
      {
        type: "string",
        children: [],
        isQuoted: true,
        isTerminated: false,
        value: "value",
        range: getInlineRange(0, 0, 6),
      },
    ],
    [
      '"value with spaces"',
      {
        type: "string",
        children: [],
        isQuoted: true,
        isTerminated: true,
        value: "value with spaces",
        range: getInlineRange(0, 0, 19),
      },
    ],
    [
      '"value with {}"',
      {
        type: "string",
        children: [],
        isQuoted: true,
        isTerminated: true,
        value: "value with {}",
        range: getInlineRange(0, 0, 15),
      },
    ],
    [
      '"value with \\"',
      {
        type: "string",
        children: [],
        isQuoted: true,
        isTerminated: true,
        value: "value with \\",
        range: getInlineRange(0, 0, 14),
      },
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(stringParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
