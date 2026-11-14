import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Leeward Design System by Kemal Salih Carfi",
    brandImage: "./assets/brand/lockup-light.png",
    brandUrl: "https://github.com/kscarfi/leeward-design-system",
    fontBase: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  }),
});
