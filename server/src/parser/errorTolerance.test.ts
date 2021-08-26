// Make sure that the parser is error tolerant.
// Every string should be parsed to something.
// The parser should never fail on any input.
import { rootParser } from "./parser";
import { applyParser } from "./utils";

/** Get the set of characters in the given range. */
function charRange(start: string, end: string): string[] {
  const startCode = start.charCodeAt(0);
  const endCode = end.charCodeAt(0);
  return Array(endCode - startCode + 1)
    .fill(0)
    .map((_, i) => {
      return String.fromCharCode(startCode + i);
    });
}

const charSet = charRange("A", "Z")
  .concat(charRange("a", "z"))
  .concat(charRange("0", "9"))
  .concat(["-", "_", '"', "{", "}", " ", "\t", "\n", "\r\n"]);

describe("error tolarance", () => {
  test("should parse any single character", () => {
    for (const char of charSet) {
      expect(() => {
        try {
          applyParser(rootParser, char);
        } catch (error) {
          // Change the error message so that we know which character failed
          throw Error(`Unable to parse '${char}':\n${error}`);
        }
      }).not.toThrow();
    }
  });
});
