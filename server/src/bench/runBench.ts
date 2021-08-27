import { glob } from "glob";
import * as path from "path";
import { readFileSync } from "fs";
import { applyParser } from "../parser/utils";
import { rootParser } from "../parser/parser";
import AstRoot from "../ast/root";
import validateNode from "../capabilities/validation";
import AstNode from "../ast/node";
import getNodeSymbols from "../capabilities/symbols";

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

function getPerformanceString(name: string, times: number[], lines: number): string {
  const nameStr = name.padEnd(10, " ");
  const total = times.reduce((a, b) => a + b, 0);
  const totalStr = getDurationStr(total);
  const minStr = getDurationStr(Math.min(...times));
  const maxStr = getDurationStr(Math.max(...times));
  const avg = total / times.length;
  const avgStr = getDurationStr(avg);
  const normAvg = avg / lines * 100000;
  const normAvgStr = getDurationStr(normAvg);

  return `${nameStr} | ${totalStr} | ${avgStr} | ${normAvgStr} | ${minStr} - ${maxStr}`;
}

async function benchmarkFunction<I, T>(input: I, count: number, fn: (input: I) => Promise<T>): Promise<number[]> {
  let times: number[] = [];

  for (let i = 0; i < count; i++) {
    const start = Date.now();
    await fn(input);
    const duration = Date.now() - start;
    times.push(duration);
  }

  return times;
}

async function benchmarkParsing(content: string, count: number): Promise<number[]> {
  return benchmarkFunction(content, count, async (input) => applyParser(rootParser, input));
}

async function benchmarkValidation(rootNode: AstRoot, count: number): Promise<number[]> {
  return benchmarkFunction(rootNode, count, validateNode);
}

async function benchmarkSymbols(rootNode: AstNode, count: number): Promise<number[]> {
  return benchmarkFunction(rootNode, count, getNodeSymbols);
}

async function benchmarkFile(fileName: string) {
  const filePath = path.resolve(benchmarkFolder, fileName);
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split("\n").length;
  const iterations = 20;

  console.info(`${fileName}, ${lines} lines\n`);
  console.info("NAME       | SUM     | AVG     | 100kAVG | MIN/MAX");
  console.info("-------------------------------------------------------------");

  const parseTimes = await benchmarkParsing(content, iterations);
  console.info(getPerformanceString("Parsing", parseTimes, lines));

  const astRoot = await applyParser(rootParser, content);
  
  const validateTimes = await benchmarkValidation(astRoot, iterations);
  console.info(getPerformanceString("Validation", validateTimes, lines));
  
  const symbolTimes = await benchmarkSymbols(astRoot, iterations);
  console.info(getPerformanceString("Symbols", symbolTimes, lines));

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
