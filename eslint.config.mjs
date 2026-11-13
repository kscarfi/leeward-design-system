import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import { recommended as leeward } from "@leeward/lint/eslint";

export default tseslint.config(
  { ignores: ["**/dist/**", "**/node_modules/**", "**/storybook-static/**", "apps/demo/runs/**"] },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["packages/react/src/**/*.tsx", "apps/**/*.tsx"],
    ...leeward,
  },
  {
    // Stories may build small render functions with hooks.
    files: ["**/*.stories.tsx"],
    rules: { "react-hooks/rules-of-hooks": "off" },
  },
);
