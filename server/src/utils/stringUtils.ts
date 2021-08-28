/** Repeat the string the given amount of times. */
export function repeatStr(str: string, count: number): string {
  let res = "";

  for (let i = 0; i < count; i++) {
    res += str;
  }

  return res;
}
