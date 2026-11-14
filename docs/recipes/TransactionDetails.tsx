// Recipe: transaction details in a sheet, with secondary actions in a menu. Type-checked in CI.
import { AmountDisplay, Avatar, Badge, Button, DropdownMenu, IconButton, Sheet, SheetClose, Text } from "@leeward/react";

export function TransactionDetails({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet
      title="Coffee Lab"
      description="12 November 2026, 10:30"
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <>
          <Button variant="outline" iconStart="download">Download receipt</Button>
          <SheetClose asChild>
            <Button>Done</Button>
          </SheetClose>
        </>
      }
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--lw-space-sm)" }}>
        <Avatar name="Coffee Lab" icon="coffee" size="lg" decorative />
        <div style={{ flex: 1 }}>
          <AmountDisplay value={85} currency="TRY" locale="tr-TR" direction="outgoing" size="lg" />
          <Text tone="secondary">Eating out</Text>
        </div>
        <DropdownMenu
          trigger={<IconButton icon="more-vertical" label="More actions" />}
          actions={[
            { label: "Split the bill", icon: "users", onSelect: () => {} },
            { label: "Report a problem", icon: "alert-circle", onSelect: () => {}, destructive: true },
          ]}
        />
      </div>
      <Badge tone="success">Completed</Badge>
      <Text variant="code" tone="secondary">Reference LW-2026-11-12-0042</Text>
    </Sheet>
  );
}
