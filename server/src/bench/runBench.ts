import { glob } from "glob";
import * as path from "path";
import { readFileSync } from "fs";
import { parseContent } from "../parser/utils";
import validateNode from "../capabilities/validation";
import getNodeSymbols from "../capabilities/symbols";
import formatNode from "../capabilities/formatting";
import { FormattingOptions } from "vscode-languageserver";

const benchmarkFolder = path.resolve(__dirname, "../../benchFixture");

function getDurationStr(duration: number): string {
  const ms = Math.round(duration);

  if (ms < 9999) {
    return `${ms.toString().padStart(4, " ")} ms`;
  }

  const seconds = ms / 1000;

  if (seconds < 99) {
    return `${seconds.toFixed(1).padStart(2, " ")} s `;
  }

  return `${seconds.toFixed(0).padStart(4, " ")} s `;
}

function getPerformanceString(
  name: string,
  times: number[],
  lines: number
): string {
  const nameStr = name.padEnd(10, " ");
  const total = times.reduce((a, b) => a + b, 0);
  const totalStr = getDurationStr(total);
  const minStr = getDurationStr(Math.min(...times));
  const maxStr = getDurationStr(Math.max(...times));
  const avg = total / times.length;
  const avgStr = getDurationStr(avg);
  const normAvg = (avg / lines) * 100000;
  const normAvgStr = getDurationStr(normAvg);

  return `${nameStr} | ${totalStr} | ${avgStr} | ${normAvgStr} | ${minStr} - ${maxStr}`;
}

async function benchmarkFunction<I, T>(
  input: I,
  count: number,
  fn: (input: I) => Promise<T>
): Promise<number[]> {
  let times: number[] = [];

  for (let i = 0; i < count; i++) {
    const start = Date.now();
    await fn(input);
    const duration = Date.now() - start;
    times.push(duration);
  }

  return times;
}

async function benchmarkFile(fileName: string) {
  const filePath = path.resolve(benchmarkFolder, fileName);
  const content = readFileSync(filePath, "utf8");
  const lines = content.split("\n").length;
  const iterations = 20;

  console.info(`${fileName}, ${lines} lines\n`);
  console.info("NAME       | SUM     | AVG     | 100kAVG | MIN/MAX");
  console.info("-------------------------------------------------------------");

  const parseTimes = await benchmarkFunction(
    content,
    iterations,
    async (content) => parseContent(content)
  );
  console.info(getPerformanceString("Parsing", parseTimes, lines));

  const rootNode = await parseContent(content);

  const validateTimes = await benchmarkFunction(
    rootNode,
    iterations,
    validateNode
  );
  console.info(getPerformanceString("Validation", validateTimes, lines));

  const symbolTimes = await benchmarkFunction(
    rootNode,
    iterations,
    getNodeSymbols
  );
  console.info(getPerformanceString("Symbols", symbolTimes, lines));

  const formattingOptions: FormattingOptions = {
    insertSpaces: false,
    tabSize: 4,
  };
  const formattingTimes = await benchmarkFunction(
    rootNode,
    iterations,
    async (node) => formatNode(node, formattingOptions)
  );
  console.info(getPerformanceString("Formatting", formattingTimes, lines));

  const edits = await formatNode(rootNode, formattingOptions);
  const edits100k = (edits.length / lines) * 100000;
  console.info(`\n${edits.length} formatting edits, ${edits100k.toFixed(2)}/100k lines`);

  console.info("\n\n");
}

async function main() {
  console.info("====================================");
  console.info("          VDF Benchmarks");
  console.info("====================================\n");

  glob("**.vdf", { cwd: benchmarkFolder }, async (err, files) => {
    if (err) {
      console.error(`Failed to run the benchmarks:\n${err}`);
      return;
    }

    // Benchmark each file
    for (const file of files) {
      await benchmarkFile(file);
    }
  });
}

main();
