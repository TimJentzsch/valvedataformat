import { mergeConfigs } from "./helper";
import * as assert from "assert";

suite("mergeConfigs", () => {
	test("should merge override defaults", () => {
		const defaultConfig = {
			insertSpaces: false,
			tabSize: 4,
		};
		const config = {
			insertSpaces: true,
			tabSize: 2,
		};
		const expected = {
			insertSpaces: true,
			tabSize: 2,
		};
		const actual = mergeConfigs(defaultConfig, config);
		assert.deepStrictEqual(actual, expected);
	});

	test("should take default values", () => {
		const defaultConfig = {
			insertSpaces: false,
			tabSize: 4,
		};
		const config = {
			insertSpaces: true,
		};
		const expected = {
			insertSpaces: true,
			tabSize: 4,
		};
		const actual = mergeConfigs(defaultConfig, config);
		assert.deepStrictEqual(actual, expected);
	});

	test("should take default if no config provided", () => {
		const defaultConfig = {
			insertSpaces: false,
			tabSize: 4,
		};
		const config = undefined;
		const expected = {
			insertSpaces: false,
			tabSize: 4,
		};
		const actual = mergeConfigs(defaultConfig, config);
		assert.deepStrictEqual(actual, expected);
	});
});
