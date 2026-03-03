import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
	{
		ignores: ["dist"],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...reactHooks.configs["recommended-latest"],
	reactRefresh.configs.vite,
	...eslintPluginUnicorn.configs.recommended,
	{
		files: ["**/*.{ts,tsx}"],
		plugins: {
			prettier: eslintPluginPrettier,
		},
		rules: {
			"prettier/prettier": "error",
			// quotes: ['error', 'single'],
		},
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
	},
];
