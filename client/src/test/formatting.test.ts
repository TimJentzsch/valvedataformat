import * as vscode from "vscode";
import * as assert from "assert";
import {
  getDocUri,
  activate,
  getDocumentText,
  setDocumentText,
} from "./helper";

suite("formatting", () => {
  const docUri = getDocUri("formatting.txt");

  test("should align property values", async () => {
    await testFormatting(
      docUri,
      "abc def\nabcdefgh ij\n",
      "abc       def\nabcdefgh  ij\n"
    );
  });
});

async function testFormatting(
  docUri: vscode.Uri,
  content: string,
  expected: string
) {
  await activate(docUri);

  // Set the text
  await setDocumentText(content);
  // Format the document
  await vscode.commands.executeCommand("editor.action.formatDocument", docUri);
  // Get the formatted text
  const actual = await getDocumentText();

  console.debug(`Before:\n${content}\n\nAfter:\n${actual}`);

  assert.notStrictEqual(actual, expected);
}
