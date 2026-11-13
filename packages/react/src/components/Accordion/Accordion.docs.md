# Accordion

Expandable sections for fees, FAQs and account details.

## Do

- Write the trigger as a question or a clear topic.
- Set headingLevel so triggers fit the page outline.

## Don't

- Do not hide information people need to make a decision, such as the fee of a transfer.

## Accessibility

- Triggers are buttons inside headings with aria-expanded.
- Arrow keys move between triggers. Behavior from Radix Accordion.

## Example

```tsx
<Accordion items={[{ value: "fees", title: "What does a transfer cost?", content: "Free between Leeward accounts." }]} />
```
