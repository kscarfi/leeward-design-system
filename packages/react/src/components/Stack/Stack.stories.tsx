import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import docsMd from "./Stack.docs.md?raw";
import { docsDescription } from "../../stories/docs.ts";
import { Stack } from "./Stack.tsx";
import { Button } from "../Button/Button.tsx";
import { TextField } from "../TextField/TextField.tsx";

const meta = { title: "Components/Stack", component: Stack, parameters: { docs: { description: { component: docsDescription(docsMd) } } }, args: { children: null } } satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Form: Story = {
  render: () => (
    <Stack as="form" gap="lg" aria-label="Recipient" style={{ maxWidth: "360px" }}>
      <Stack gap="md">
        <TextField label="Name" />
        <TextField label="IBAN" numeric />
      </Stack>
      <Stack direction="horizontal" gap="sm" justify="end" wrap>
        <Button variant="ghost">Cancel</Button>
        <Button type="submit">Save recipient</Button>
      </Stack>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const form = within(canvasElement).getByRole("form", { name: "Recipient" });
    await expect(getComputedStyle(form).rowGap).not.toBe("normal");
  },
};
export const Horizontal: Story = { render: () => <Stack direction="horizontal" gap="sm" wrap><Button size="sm">One</Button><Button size="sm" variant="secondary">Two</Button><Button size="sm" variant="outline">Three</Button></Stack> };
