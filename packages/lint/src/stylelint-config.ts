import plugins from "./stylelint-plugin.ts";

export default {
  plugins,
  rules: {
    "leeward/no-raw-color": true,
    "leeward/known-token": true,
    "leeward/spacing-scale": true,
    "leeward/type-scale": true,
    "leeward/composes-single-class": true,
    "color-no-invalid-hex": true,
    "declaration-block-no-duplicate-properties": true,
  },
};
