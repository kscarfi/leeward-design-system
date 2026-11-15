import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import docsMd from "./Fieldset.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { Fieldset } from "./Fieldset.tsx";
import { TextField } from "../TextField/TextField.tsx";

const meta = { title: "Components/Fieldset", component: Fieldset, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { legend: "Card address", hint: "Where we send your new card", children: null }, decorators: [(Story) => <div style={{ maxWidth: "360px" }}><Story /></div>] } satisfies Meta<typeof Fieldset>;
export default meta;
type Story = StoryObj<typeof meta>;

const fields = <><TextField label="Street and number" /><TextField label="City" /><TextField label="Postcode" numeric /></>;
export const Default: Story = {
  args: { children: fields },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("group", { name: "Card address" })).toHaveAccessibleDescription("Where we send your new card");
  },
};
export const WithError: Story = { args: { legend: "Pay to", hint: undefined, error: "Enter either an IBAN or a phone number", children: <><TextField label="IBAN" numeric /><TextField label="Phone number" type="tel" /></> } };
export const HiddenLegend: Story = { args: { hideLegend: true, children: fields } };
