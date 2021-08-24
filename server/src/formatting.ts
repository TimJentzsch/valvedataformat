import { TextEdit, FormattingOptions } from "vscode-languageserver";
import AstNode from "./ast/node";
import AstObject from "./ast/object";

/** Format the given node. */
export default async function formatNode(node: AstNode, options: FormattingOptions): Promise<TextEdit[]> {
  switch (node.type) {
    case "object":
      return formatObject(node, options);
    default:
      return [];
  }
}

/** Format the given object node. */
export async function formatObject(obj: AstObject, options: FormattingOptions): Promise<TextEdit[]> {
  const edits: TextEdit[] = [];

  return edits;
}
