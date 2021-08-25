import { DocumentSymbol, SymbolKind } from "vscode-languageserver/node";
import { astLBracket, astRBracket } from "../ast/bracket";
import { astIndent } from "../ast/indent";
import { astUnquotedKey } from "../ast/key";
import AstNode from "../ast/node";
import { astObject } from "../ast/object";
import { astObjectProperty, astStringProperty } from "../ast/property";
import { astQuotedString, astUnquotedString } from "../ast/string";
import { getInlineRange } from "../parser/utils";
import getNodeSymbols from "./symbols";

describe("getNodeSymbols", () => {
  // Test name, input AST node and the expected document symbols.
  const params: Array<[string, AstNode, DocumentSymbol[]]> = [
    [
      "should give string value for string node",
      astUnquotedString("key", getInlineRange(0, 0, 3)),
      [
        {
          name: "key",
          kind: SymbolKind.String,
          range: getInlineRange(0, 0, 3),
          selectionRange: getInlineRange(0, 0, 3),
          children: [],
        },
      ],
    ],
    [
      "should give key name for string property node",
      astStringProperty(
        astUnquotedKey("key", getInlineRange(0, 0, 3)),
        [astIndent("\t", getInlineRange(0, 3, 4))],
        astUnquotedString("value", getInlineRange(0, 4, 9))
      ),
      [
        {
          name: "key",
          kind: SymbolKind.Property,
          range: getInlineRange(0, 0, 9),
          selectionRange: getInlineRange(0, 0, 9),
          children: [
            {
              name: "value",
              kind: SymbolKind.String,
              range: getInlineRange(0, 4, 9),
              selectionRange: getInlineRange(0, 4, 9),
              children: [],
            },
          ],
        },
      ],
    ],
    [
      "should give key name for object property node",
      astObjectProperty(
        astUnquotedKey("key", getInlineRange(0, 0, 3)),
        [astIndent("\t", getInlineRange(0, 3, 4))],
        astObject(
          astLBracket(getInlineRange(0, 4, 5)),
          [],
          astRBracket(getInlineRange(0, 5, 6))
        )
      ),
      [
        {
          name: "key",
          kind: SymbolKind.Object,
          range: getInlineRange(0, 0, 6),
          selectionRange: getInlineRange(0, 0, 6),
          children: [],
        },
      ],
    ],
    [
      "should give key name for object property node",
      astObjectProperty(
        astUnquotedKey("key", getInlineRange(0, 0, 3)),
        [astIndent("\t", getInlineRange(0, 3, 4))],
        astObject(
          astLBracket(getInlineRange(0, 4, 5)),
          [],
          astRBracket(getInlineRange(0, 5, 6))
        )
      ),
      [
        {
          name: "key",
          kind: SymbolKind.Object,
          range: getInlineRange(0, 0, 6),
          selectionRange: getInlineRange(0, 0, 6),
          children: [],
        },
      ],
    ],
    [
      "should give child symbols for object node",
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [
          astStringProperty(
            astUnquotedKey("key", getInlineRange(0, 1, 4)),
            [astIndent("\t", getInlineRange(0, 4, 5))],
            astQuotedString("value", getInlineRange(0, 5, 12))
          ),
        ],
        astRBracket(getInlineRange(0, 12, 13))
      ),
      [
        {
          name: "key",
          kind: SymbolKind.Property,
          range: getInlineRange(0, 1, 12),
          selectionRange: getInlineRange(0, 1, 12),
          children: [
            {
              name: "value",
              kind: SymbolKind.String,
              range: getInlineRange(0, 5, 12),
              selectionRange: getInlineRange(0, 5, 12),
              children: [],
            },
          ],
        },
      ],
    ],
  ];

  for (const [name, node, expectedSymbols] of params) {
    test(name, () => {
      return getNodeSymbols(node).then((symbols) => {
        expect(symbols).toEqual(expectedSymbols);
      });
    });
  }
});
