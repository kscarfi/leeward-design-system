# Tabs

Switch between views of the same object, such as Activity and Statements.

## Do

- Give `label` a name for the tab list.
- Keep labels to one or two words.

## Don't

- Do not use tabs for steps in a flow.
- Do not hide required form fields in other tabs.

## Accessibility

- Radix Tabs: arrow keys move between tabs, Tab moves into the panel.
- Active tab uses weight and an underline, not only color.

## Example

```tsx
<Tabs label="Account views" items={[{ value: "activity", label: "Activity", content: <Activity /> }]} />
```
