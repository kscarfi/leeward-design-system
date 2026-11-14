import { recommended as leeward } from "@leeward/lint/eslint";
export default [{ files: ["lintcase/**/*.tsx"], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } }, { ...leeward, files: ["lintcase/**/*.tsx"] }];
