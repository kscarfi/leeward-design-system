# Spinner

Short wait indicator when the shape of the result is unknown.

## Do

- Give it a label when it is the only thing on screen.

## Don't

- Do not use for page content: use Skeleton.
- Do not use inside buttons: use Button loading.

## Accessibility

- With a label it is a status region. It keeps turning slowly under reduced motion so it never looks frozen.

## Example

```tsx
<Spinner label="Loading your accounts" />
```
