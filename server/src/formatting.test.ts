import { FormattingOptions, TextEdit } from "vscode-languageserver/node";
import { astLf } from "./ast/endOfLine";
import { astIndent } from "./ast/indent";
import { astQuotedKey } from "./ast/key";
import AstNode from "./ast/node";
import { astStringProperty } from "./ast/property";
import { astRoot } from "./ast/root";
import { astQuotedString } from "./ast/string";
import formatNode from "./formatting";
import { getInlineRange, getRange } from "./parser/utils";

describe("formatNode", () => {
  // Test name, input AST node and the expected document symbols.
  const params: Array<[string, AstNode, TextEdit[]]> = [
    [
      "should not edit sequence of string properties",
      astRoot([
        astStringProperty(
          astQuotedKey("key1", getInlineRange(0, 0, 6)),
          [astIndent("\t", getInlineRange(0, 6, 7))],
          astQuotedString("value1", getInlineRange(0, 7, 15))
        ),
        astLf(getRange(0, 15, 1, 0)),
        astStringProperty(
          astQuotedKey("key2", getInlineRange(1, 0, 6)),
          [astIndent("\t", getInlineRange(1, 6, 7))],
          astQuotedString("value2", getInlineRange(1, 7, 15))
        ),
        astLf(getRange(1, 15, 2, 0)),
      ]),
      [],
    ],
  ];

  const options: FormattingOptions = {
    insertSpaces: false,
    tabSize: 4,
  };

  for (const [name, node, expectedEdits] of params) {
    test(name, () => {
      return formatNode(node, options).then((symbols) => {
        expect(symbols).toEqual(expectedEdits);
      });
    });
  }
});
