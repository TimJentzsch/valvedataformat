/* -----------------------------------------------------------------------------------------
 * Derived from https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-sample.
 * Licensed under the MIT License.
 * ---------------------------------------------------------------------------------------*/
import * as vscode from "vscode";
import * as path from "path";
import { workspace } from "vscode";

export let doc: vscode.TextDocument;
export let editor: vscode.TextEditor;
export let documentEol: string;
export let platformEol: string;

/** Activates the vscode.lsp-sample extension. */
export async function activate(docUri: vscode.Uri) {
  // The extensionId is `publisher.name` from package.json
  const ext = vscode.extensions.getExtension("timjen.valvedataformat")!;
  await ext.activate();
  try {
    doc = await vscode.workspace.openTextDocument(docUri);
    editor = await vscode.window.showTextDocument(doc);
    await sleep(2000); // Wait for server activation
  } catch (e) {
    console.error(e);
  }
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getDocPath = (p: string) => {
  return path.resolve(__dirname, "../../testFixture", p);
};

export const getDocUri = (p: string) => {
  return vscode.Uri.file(getDocPath(p));
};

export async function setDocumentText(content: string): Promise<boolean> {
  const all = new vscode.Range(
    doc.positionAt(0),
    doc.positionAt(doc.getText().length)
  );
  return editor.edit((eb) => eb.replace(all, content));
}

export async function getDocumentText(): Promise<string> {
  return editor.document.getText();
}

export type ConfigValue = string | boolean | number | null;

export function mergeConfigs<T>(
  defaultConfig: Record<string, T>,
  config?: Record<string, T | undefined>
): Record<string, T> {
  if (config === undefined) {
    return defaultConfig;
  }

  const mergedConfig: Record<string, T> = { ...defaultConfig };

  // Override if the value is defined in the config
  for (const key of Object.keys(config)) {
    const value = config[key];
    if (value !== undefined) {
      mergedConfig[key] = value;
    }
  }

  return mergedConfig;
}

export type Config = Record<string, ConfigValue | undefined>;

/** Set the options of the editor. */
export async function setEditorOptions(
  insertSpaces: boolean = false,
  tabSize: number = 4
) {
  editor.options.insertSpaces = insertSpaces;
  editor.options.tabSize = tabSize;
}
