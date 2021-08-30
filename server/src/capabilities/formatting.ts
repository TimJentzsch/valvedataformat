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

export interface NodeFormattingOptions extends FormattingOptions {
  /** The current level of indent. */
  indent?: number;
  /** The current column.
   * Columns differ from the character in a position when tabs are used.
   * One tab is always one character, but has as many columns as the tab size used.
   */
  column?: number;
}

export interface PropertyFormattingOptions extends NodeFormattingOptions {
  /** The maximum length of the keys in the current object. */
  maxKeyLength?: number;
  /** The maximum length of the values in the current object. */
  maxValueLength?: number;
}

/** Format the given node. */
export default async function formatNode(
  node: AstNode,
  options: NodeFormattingOptions
): Promise<TextEdit[]> {
  switch (node.type) {
    case NodeType.root:
      return formatRoot(node, options);
    case NodeType.object:
      return formatObject(node, options);
    case NodeType.property:
      return formatProperty(node, options);
    default:
      return [];
  }
}

/** Format the given string node. */
export async function formatStringProperty(
  property: AstStringProperty,
  options: PropertyFormattingOptions
): Promise<TextEdit[]> {
  const edits: TextEdit[] = [];

  const key = property.key;
  const value = property.value;

  if (value === undefined) {
    return [];
  }

  // Line up all property values
  const keyLength = getStringLikeLength(property.key);
  const neededBetweenIndent =
    1 + ((options.maxKeyLength ?? keyLength) - keyLength);
  const keyEndColumn = (options.indent ?? 0) * options.tabSize + keyLength;
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
  options: PropertyFormattingOptions
): Promise<TextEdit[]> {
  if (property.propertyType === PropertyType.string) {
    return formatStringProperty(property, options);
  }

  return formatNode(property.value, options);
}

/** Format the given object node. */
export async function formatObject(
  obj: AstObject,
  options: NodeFormattingOptions
): Promise<TextEdit[]> {
  const maxKeyLength = getMaxKeyLength(obj);
  const maxValueLength = getMaxValueLength(obj);

  const propOptions: PropertyFormattingOptions = {
    ...options,
    maxKeyLength,
    maxValueLength,
    indent: (options.indent ?? 0) + 1,
    column: (options.column ?? 0) + options.tabSize,
  };

  const propertyEditsCollection = await Promise.all(
    obj.properties.map((property) => formatProperty(property, propOptions))
  );

  const propertyEdits = ([] as TextEdit[]).concat(...propertyEditsCollection);

  return propertyEdits;
}

/** Format the given root node. */
export async function formatRoot(
  root: AstRoot,
  options: FormattingOptions
): Promise<TextEdit[]> {
  const maxKeyLength = getMaxKeyLength(root);
  const maxValueLength = getMaxValueLength(root);

  const propOptions: PropertyFormattingOptions = {
    ...options,
    maxKeyLength,
    maxValueLength,
  };

  const propertyEditsCollection = await Promise.all(
    root.properties.map((property) => formatProperty(property, propOptions))
  );

  const propertyEdits = ([] as TextEdit[]).concat(...propertyEditsCollection);

  return propertyEdits;
}
