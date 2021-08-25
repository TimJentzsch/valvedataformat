import { FormattingOptions, commands, workspace } from "vscode";
import * as assert from "assert";
import {
  getDocUri,
  activate,
  getDocumentText,
  setDocumentText,
} from "./helper";

const docUri = getDocUri("formatting.vdf");

interface FormattingConfig {
  insertSpaces?: boolean;
  tabSize?: boolean;
}

suite("formatting", () => {
  // List of test values.
  // Test name, test input and expected output.
  const params: Array<[string, string, string, FormattingConfig?]> = [
    [
      "should align string property values with tabs",
      "abc def\nabcdefgh ij\n",
      "abc\t\tdef\nabcdefgh\tij\n",
    ],
    [
      "should align string property values with spaces",
      "abc def\nabcdefgh ij\n",
      "abc       def\nabcdefgh  ij\n",
      { insertSpaces: true },
    ],
  ];

  for (const [name, input, expected] of params) {
    test(name, async () => {
      await testFormatting(input, expected);
    });
  }
});

/** Test the formatting of the given input string. */
async function testFormatting(
  input: string,
  expected: string,
  config?: FormattingConfig
) {
  await activate(docUri);
  // Update the settings
  const settings = getMergedOptions(config);
  const configuration = workspace.getConfiguration();
  await configuration.update("editor.insertSpaces", settings.insertSpaces);
  await configuration.update("editor.tabSize", settings.tabSize);
  // Set the text
  await setDocumentText(input);
  // Format the document
  await commands.executeCommand("editor.action.formatDocument", docUri);
  // Get the formatted text
  const actual = await getDocumentText();
  // Compare the results
  assert.strictEqual(actual, expected);
}

/** Merge the options with the default options. */
function getMergedOptions(config?: FormattingConfig): FormattingOptions {
  const defaultOptions: FormattingOptions = {
    insertSpaces: false,
    tabSize: 4,
  };

  if (config === undefined) {
    return defaultOptions;
  }

  const mergedOptions: FormattingOptions = {
    ...defaultOptions,
  };

  for (const key in Object.keys(config)) {
    const value = config[key];
    if (value !== undefined) {
      mergedOptions[key] = value;
    }
  }

  return mergedOptions;
}
