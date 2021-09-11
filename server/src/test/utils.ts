import { Position, Range, TextEdit } from "vscode-languageserver/node";

/** Apply the text edits on the given input string. */
export function applyEdits(content: string, edits: TextEdit[]): string {
  let res = content;
  let offset = 0;

  for (const edit of edits) {
    const [start, end] = getEdgesFromRange(content, edit.range);
    const pre = res.slice(0, start + offset);
    const post = res.slice(end + offset);
    res = pre + edit.newText + post;
    offset += edit.newText.length - (end - start);
  }

  return res;
}

/** Get the start and end offset in the string for the given range. */
export function getEdgesFromRange(
  content: string,
  range: Range
): [number, number] {
  return [
    getOffsetFromPosition(content, range.start),
    getOffsetFromPosition(content, range.end),
  ];
}

/** Get the character offset in the string for the given position. */
export function getOffsetFromPosition(content: string, pos: Position): number {
  const lineOffset = content
    .split("\n")
    .slice(0, pos.line)
    .reduce((a, b) => a + b.length, 0);
  return lineOffset + pos.character + pos.line;
}
