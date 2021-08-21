import { getTokenStream, VDFToken } from "./lexer";

/** Makes the whitespace in the input visible to display the test names. */
function showWhitespace(input: string): string {
  return (
    input
      // Spaces
      .replace(/ /g, "\u00B7")
      // Tabs
      .replace(/\t/g, "\\t")
      // LF
      .replace(/\n/g, "\\n")
      // CR
      .replace(/\r/g, "\\r")
  );
}

// Comment
describe("should tokenize single comment", () => {
  const params = ["//", "// Comment", "//========", "// with spaces and stuff"];

  for (const input of params) {
    test(showWhitespace(input), () => {
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
    test(showWhitespace(input), () => {
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
    test(showWhitespace(input), () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VDFToken.quotedString]);
    });
  }
});

// Left bracket
describe("should tokenize single left bracket", () => {
  const params = ["{"];

  for (const input of params) {
    test(showWhitespace(input), () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VDFToken.lBracket]);
    });
  }
});

// Right bracket
describe("should tokenize single right bracket", () => {
  const params = ["}"];

  for (const input of params) {
    test(showWhitespace(input), () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VDFToken.rBracket]);
    });
  }
});

// Line break
describe("should tokenize single line break", () => {
  const params = ["\n", "\n\r"];

  for (const input of params) {
    test(showWhitespace(input), () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VDFToken.lineBreak]);
    });
  }
});

// Whitespace
describe("should tokenize single whitespace", () => {
  const params = [" ", "\t", "    ", "\t\t", "\t  \t  ", "  \t  \t"];

  for (const input of params) {
    test(showWhitespace(input), () => {
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
    test(showWhitespace(input), () => {
      const actual = getTokenStream(input).map((token) => [
        token.kind,
        token.text,
      ]);
      expect(actual).toEqual(expected);
    });
  }
});

// Objects
describe("should tokenize objects", () => {
  // An array of the input strings and expected output
  // The output is a list of token kinds and matched string
  const params: Array<[string, Array<[VDFToken, string]>]> = [
    [
      "{}",
      [
        [VDFToken.lBracket, "{"],
        [VDFToken.rBracket, "}"],
      ],
    ],
    [
      "{ }",
      [
        [VDFToken.lBracket, "{"],
        [VDFToken.space, " "],
        [VDFToken.rBracket, "}"],
      ],
    ],
    [
      '{\n\t"key"\t"value"\n}',
      [
        [VDFToken.lBracket, "{"],
        [VDFToken.lineBreak, "\n"],
        [VDFToken.space, "\t"],
        [VDFToken.quotedString, '"key"'],
        [VDFToken.space, "\t"],
        [VDFToken.quotedString, '"value"'],
        [VDFToken.lineBreak, "\n"],
        [VDFToken.rBracket, "}"],
      ],
    ],
  ];

  for (const [input, expected] of params) {
    test(showWhitespace(input), () => {
      const actual = getTokenStream(input).map((token) => [
        token.kind,
        token.text,
      ]);
      expect(actual).toEqual(expected);
    });
  }
});

// Comments interacting with others
describe("should tokenize comments before others", () => {
  // An array of the input strings and expected output
  // The output is a list of token kinds and matched string
  const params: Array<[string, Array<[VDFToken, string]>]> = [
    [
      '// Comment "key" "value"',
      [[VDFToken.comment, '// Comment "key" "value"']],
    ],
    [
      '"key" // "value"',
      [
        [VDFToken.quotedString, '"key"'],
        [VDFToken.space, " "],
        [VDFToken.comment, '// "value"'],
      ],
    ],
    [
      "// Comment\n",
      [
        [VDFToken.comment, "// Comment"],
        [VDFToken.lineBreak, "\n"],
      ],
    ],
    [
      '"open string // Comment',
      [
        [VDFToken.quotedString, '"open string // Comment'],
      ],
    ],
  ];

  for (const [input, expected] of params) {
    test(showWhitespace(input), () => {
      const actual = getTokenStream(input).map((token) => [
        token.kind,
        token.text,
      ]);
      expect(actual).toEqual(expected);
    });
  }
});
