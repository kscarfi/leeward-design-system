import leeward from "@leeward/lint/stylelint";

export default {
  ...leeward,
  ignoreFiles: ["**/dist/**", "**/node_modules/**", "**/storybook-static/**", "apps/docs/.storybook/**", "apps/demo/runs/**"],
};
