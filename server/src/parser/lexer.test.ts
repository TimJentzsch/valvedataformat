import { getTokenStream, VDFToken } from "./lexer";

// Comment
describe("should tokenize single comment", () => {
  const params = ["//", "// Comment", "//========", "// with spaces and stuff"];

  for (const input of params) {
    test(input, () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VDFToken.comment]);
    });
  }
});

// Quoted string
describe("should tokenize single quoted string", () => {
  const params = [
    '""',
    '"word"',
    '"number 1234 and_-stuff"',
    '"missing end quote',
    '"{}"',
  ];

  for (const input of params) {
    test(input, () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VDFToken.quotedString]);
    });
  }
});

// Unquoted string
describe("should tokenize single unquoted string", () => {
  const params = [
    '""',
    '"word"',
    '"number 1234 and_-stuff"',
    '"missing end quote',
    '"{}"',
    '"\\"',
  ];

  for (const input of params) {
    test(input, () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VDFToken.quotedString]);
    });
  }
});

// Left bracket
describe("should tokenize single left bracket", () => {
  const params = ["{"];

  for (const input of params) {
    test(input, () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VDFToken.lBracket]);
    });
  }
});

// Right bracket
describe("should tokenize single right bracket", () => {
  const params = ["}"];

  for (const input of params) {
    test(input, () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VDFToken.rBracket]);
    });
  }
});

// Line break
describe("should tokenize single line break", () => {
  const params = ["\n", "\n\r"];

  for (const input of params) {
    test(input.replace(/\n/g, "\\n").replace(/\r/g, "\\r"), () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VDFToken.lineBreak]);
    });
  }
});

// Whitespace
describe("should tokenize single whitespace", () => {
  const params = [" ", "\t", "    ", "\t\t", "\t  \t  ", "  \t  \t"];

  for (const input of params) {
    test(input.replace(/ /g, "\u00B7").replace(/\t/g, "\\t"), () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VDFToken.space]);
    });
  }
});

// Key Value pairs
describe("should tokenize key-value pairs", () => {
  // An array of the input strings and expected output
  // The output is a list of token kinds and matched string
  const params: Array<[string, Array<[VDFToken, string]>]> = [
    [
      "key value",
      [
        [VDFToken.unquotedString, "key"],
        [VDFToken.space, " "],
        [VDFToken.unquotedString, "value"],
      ],
    ],
    [
      '"key" "value"',
      [
        [VDFToken.quotedString, '"key"'],
        [VDFToken.space, " "],
        [VDFToken.quotedString, '"value"'],
      ],
    ],
    [
      'key "value"',
      [
        [VDFToken.unquotedString, "key"],
        [VDFToken.space, " "],
        [VDFToken.quotedString, '"value"'],
      ],
    ],
    [
      '"key" value',
      [
        [VDFToken.quotedString, '"key"'],
        [VDFToken.space, " "],
        [VDFToken.unquotedString, "value"],
      ],
    ],
    [
      '"key""value"',
      [
        [VDFToken.quotedString, '"key"'],
        [VDFToken.quotedString, '"value"'],
      ],
    ],
    [
      'key"value"',
      [
        [VDFToken.unquotedString, "key"],
        [VDFToken.quotedString, '"value"'],
      ],
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = getTokenStream(input).map((token) => [
        token.kind,
        token.text,
      ]);
      expect(actual).toEqual(expected);
    });
  }
});
