import { TextEdit, FormattingOptions, Range } from "vscode-languageserver/node";
import { NodeType } from "../ast/baseNode";
import { IndentType } from "../ast/indent";
import AstNode from "../ast/node";
import AstObject from "../ast/object";
import AstProperty, { AstStringProperty, PropertyType } from "../ast/property";
import AstRoot from "../ast/root";
import { repeatStr } from "../utils/stringUtils";
import {
  getStringLikeLength,
  getNeededIndentlength,
  getMaxKeyLength,
  getMaxValueLength,
} from "./utils";

/** Format the given node. */
export default async function formatNode(
  node: AstNode,
  options: FormattingOptions,
  curIndent: number = 0
): Promise<TextEdit[]> {
  switch (node.type) {
    case NodeType.root:
      return formatRoot(node, options, curIndent);
    case NodeType.object:
      return formatObject(node, options, curIndent);
    case NodeType.property:
      return formatProperty(node, options, curIndent);
    default:
      return [];
  }
}

/** Format the given string node. */
export async function formatStringProperty(
  property: AstStringProperty,
  options: FormattingOptions,
  curIndent: number = 0,
  maxKeyLength: number = 0,
  maxValueLength: number = 0
): Promise<TextEdit[]> {
  const edits: TextEdit[] = [];

  const key = property.key;
  const value = property.value;

  if (value === undefined) {
    return [];
  }

  // Line up all property values
  const keyLength = getStringLikeLength(property.key);
  const neededBetweenIndent = 1 + (maxKeyLength - keyLength);
  const keyEndColumn = curIndent * options.tabSize + keyLength;
  let indentNeeded = getNeededIndentlength(
    options,
    keyEndColumn,
    neededBetweenIndent
  );
  const wantedIndentType = options.insertSpaces
    ? IndentType.spaces
    : IndentType.tabs;

  for (const indent of property.betweenIndent) {
    if (indent.indentType === wantedIndentType) {
      const startChar = indent.range.start.character;
      // There is already some indent that we can use
      const length =
        indent.indentType === IndentType.spaces
          ? indent.count
          : Math.ceil(startChar / options.tabSize) * options.tabSize -
            startChar +
            (indent.count - 1) * options.tabSize;

      if (length <= indentNeeded) {
        // Keep the indent and decrease needed indent
        indentNeeded -= length;
      } else {
        // There is too much indent, we need to delete some
        const range: Range = {
          start: {
            line: indent.range.end.line,
            character: indent.range.end.character - (length - indentNeeded),
          },
          // Also delete the rest of the indent items
          end: value.range.start,
        };
        edits.push({
          range,
          newText: "",
        });
        indentNeeded = 0;
        break;
      }
    } else {
      // The indent is of the wrong type, delete it
      edits.push({
        range: indent.range,
        newText: "",
      });
    }
  }

  if (indentNeeded > 0) {
    // There isn't enough indent, we need to add some
    const count = options.insertSpaces
      ? indentNeeded
      : Math.ceil(indentNeeded / options.tabSize);
    const newText = repeatStr(options.insertSpaces ? " " : "\t", count);
    const range: Range = {
      start: value.range.start,
      end: value.range.start,
    };
    edits.push({
      range,
      newText,
    });
  }

  return edits;
}

/** Format the given property node. */
export async function formatProperty(
  property: AstProperty,
  options: FormattingOptions,
  curIndent: number = 0,
  maxKeyLength: number = 0,
  maxValueLength: number = 0
): Promise<TextEdit[]> {
  if (property.propertyType === PropertyType.string) {
    return formatStringProperty(
      property,
      options,
      curIndent,
      maxKeyLength,
      maxValueLength
    );
  }

  return formatNode(property.value, options, curIndent);
}

/** Format the given object node. */
export async function formatObject(
  obj: AstObject,
  options: FormattingOptions,
  curIndent: number = 0
): Promise<TextEdit[]> {
  const maxKeyLength = getMaxKeyLength(obj);
  const maxValueLength = getMaxValueLength(obj);

  const propertyEditsCollection = await Promise.all(
    obj.properties.map((property) =>
      formatProperty(
        property,
        options,
        curIndent + 1,
        maxKeyLength,
        maxValueLength
      )
    )
  );

  const propertyEdits = ([] as TextEdit[]).concat(...propertyEditsCollection);

  return propertyEdits;
}

/** Format the given root node. */
export async function formatRoot(
  root: AstRoot,
  options: FormattingOptions,
  curIndent: number = 0
): Promise<TextEdit[]> {
  const maxKeyLength = getMaxKeyLength(root);
  const maxValueLength = getMaxValueLength(root);

  const propertyEditsCollection = await Promise.all(
    root.properties.map((property) =>
      formatProperty(property, options, curIndent, maxKeyLength, maxValueLength)
    )
  );

  const propertyEdits = ([] as TextEdit[]).concat(...propertyEditsCollection);

  return propertyEdits;
}
