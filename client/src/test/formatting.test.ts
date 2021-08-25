import { FormattingOptions, commands } from "vscode";
import * as assert from "assert";
import {
  getDocUri,
  activate,
  getDocumentText,
  setDocumentText,
  sleep,
  mergeConfigs,
  setEditorOptions,
} from "./helper";

const docUri = getDocUri("formatting.vdf");

suite("formatting", () => {
  // List of test values.
  // Test name, test input and expected output.
  // Optional editor options: Insert spaces? Tab size?
  const params: Array<[string, string, string, boolean?, number?]> = [
    [
      "should align string property values with tabs",
      "abc def\nabcdefgh ij\n",
      "abc\t\tdef\nabcdefgh\tij\n",
    ],
    [
      "should align string property values with spaces",
      "abc def\nabcdefgh ij\n",
      "abc       def\nabcdefgh  ij\n",
      true
    ],
  ];

  for (const [name, input, expected, insertSpaces, tabSize] of params) {
    test(name, async () => {
      await testFormatting(input, expected, insertSpaces, tabSize);
    });
  }
});

/** Test the formatting of the given input string. */
async function testFormatting(
  input: string,
  expected: string,
  insertSpaces?: boolean,
  tabSize?: number,
) {
  await activate(docUri);
  console.info("asdoiansd");
  // Update the settings
  setEditorOptions(insertSpaces, tabSize);
  // Set the text
  await setDocumentText(input);
  // Format the document
  await commands.executeCommand("editor.action.formatDocument", docUri);
  // Get the formatted text
  const actual = await getDocumentText();
  await sleep(2000);
  // Compare the results
  assert.strictEqual(actual, expected);
}
