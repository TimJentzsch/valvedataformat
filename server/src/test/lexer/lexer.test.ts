import { getTokenStream, VdfToken } from "../../lexer/lexer";

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
      expect(actual).toEqual([VdfToken.comment]);
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
      expect(actual).toEqual([VdfToken.quotedString]);
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
      expect(actual).toEqual([VdfToken.quotedString]);
    });
  }
});

// Left bracket
describe("should tokenize single left bracket", () => {
  const params = ["{"];

  for (const input of params) {
    test(showWhitespace(input), () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VdfToken.lBracket]);
    });
  }
});

// Right bracket
describe("should tokenize single right bracket", () => {
  const params = ["}"];

  for (const input of params) {
    test(showWhitespace(input), () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VdfToken.rBracket]);
    });
  }
});

// Line break
describe("should tokenize single line break", () => {
  const params = ["\n", "\r\n"];

  for (const input of params) {
    test(showWhitespace(input), () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VdfToken.endOfLine]);
    });
  }
});

// Spaces
describe("should tokenize single spaces", () => {
  const params = [" ", "  ", "    "];

  for (const input of params) {
    test(showWhitespace(input), () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VdfToken.spaces]);
    });
  }
});

// Tabs
describe("should tokenize single tabs", () => {
  const params = ["\t", "\t\t", "\t\t\t\t"];

  for (const input of params) {
    test(showWhitespace(input), () => {
      const actual = getTokenStream(input).map((token) => token.kind);
      expect(actual).toEqual([VdfToken.tabs]);
    });
  }
});

// Key Value pairs
describe("should tokenize key-value pairs", () => {
  // An array of the input strings and expected output
  // The output is a list of token kinds and matched string
  const params: Array<[string, Array<[VdfToken, string]>]> = [
    [
      "key value",
      [
        [VdfToken.unquotedString, "key"],
        [VdfToken.spaces, " "],
        [VdfToken.unquotedString, "value"],
      ],
    ],
    [
      '"key" "value"',
      [
        [VdfToken.quotedString, '"key"'],
        [VdfToken.spaces, " "],
        [VdfToken.quotedString, '"value"'],
      ],
    ],
    [
      'key "value"',
      [
        [VdfToken.unquotedString, "key"],
        [VdfToken.spaces, " "],
        [VdfToken.quotedString, '"value"'],
      ],
    ],
    [
      '"key" value',
      [
        [VdfToken.quotedString, '"key"'],
        [VdfToken.spaces, " "],
        [VdfToken.unquotedString, "value"],
      ],
    ],
    [
      '"key""value"',
      [
        [VdfToken.quotedString, '"key"'],
        [VdfToken.quotedString, '"value"'],
      ],
    ],
    [
      'key"value"',
      [
        [VdfToken.unquotedString, "key"],
        [VdfToken.quotedString, '"value"'],
      ],
    ],
    [
      '"key\n',
      [
        [VdfToken.quotedString, '"key'],
        [VdfToken.endOfLine, "\n"],
      ],
    ],
    [
      '"key" "value\n',
      [
        [VdfToken.quotedString, '"key"'],
        [VdfToken.spaces, " "],
        [VdfToken.quotedString, '"value'],
        [VdfToken.endOfLine, "\n"],
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
  const params: Array<[string, Array<[VdfToken, string]>]> = [
    [
      "{}",
      [
        [VdfToken.lBracket, "{"],
        [VdfToken.rBracket, "}"],
      ],
    ],
    [
      "{ }",
      [
        [VdfToken.lBracket, "{"],
        [VdfToken.spaces, " "],
        [VdfToken.rBracket, "}"],
      ],
    ],
    [
      '{\n\t"key"\t"value"\n}',
      [
        [VdfToken.lBracket, "{"],
        [VdfToken.endOfLine, "\n"],
        [VdfToken.tabs, "\t"],
        [VdfToken.quotedString, '"key"'],
        [VdfToken.tabs, "\t"],
        [VdfToken.quotedString, '"value"'],
        [VdfToken.endOfLine, "\n"],
        [VdfToken.rBracket, "}"],
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
  const params: Array<[string, Array<[VdfToken, string]>]> = [
    [
      '// Comment "key" "value"',
      [[VdfToken.comment, '// Comment "key" "value"']],
    ],
    [
      '"key" // "value"',
      [
        [VdfToken.quotedString, '"key"'],
        [VdfToken.spaces, " "],
        [VdfToken.comment, '// "value"'],
      ],
    ],
    [
      "// Comment\n",
      [
        [VdfToken.comment, "// Comment"],
        [VdfToken.endOfLine, "\n"],
      ],
    ],
    [
      '"open string // Comment',
      [[VdfToken.quotedString, '"open string // Comment']],
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
