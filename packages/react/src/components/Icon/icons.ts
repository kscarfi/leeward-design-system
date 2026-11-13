// Icon names. The drawings come from Solar Icons (see icons.generated.ts for attribution).
import { iconData } from "./icons.generated.ts";

export type IconName = keyof typeof iconData;
export type IconWeight = "linear" | "bold" | "duotone";
export const iconNames = Object.keys(iconData).sort() as IconName[];
export const iconWeights: IconWeight[] = ["linear", "bold", "duotone"];
export { iconData };
