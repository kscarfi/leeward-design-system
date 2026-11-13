// Leeward Design System tokens. Generated, do not edit.
export const themes = ["light","dark"] as const;
export type ThemeName = (typeof themes)[number];
export type TokenName =
  | "color.bg.canvas"
  | "color.surface.default"
  | "color.surface.raised"
  | "color.surface.overlay"
  | "color.surface.sunken"
  | "color.surface.inverse"
  | "color.surface.hover"
  | "color.surface.pressed"
  | "color.surface.brand"
  | "color.scrim"
  | "color.text.primary"
  | "color.text.secondary"
  | "color.text.tertiary"
  | "color.text.disabled"
  | "color.text.inverse"
  | "color.text.link"
  | "color.text.link-hover"
  | "color.text.brand"
  | "color.text.accent"
  | "color.text.success"
  | "color.text.warning"
  | "color.text.danger"
  | "color.icon.primary"
  | "color.icon.secondary"
  | "color.icon.brand"
  | "color.border.subtle"
  | "color.border.default"
  | "color.border.strong"
  | "color.border.focus"
  | "color.border.brand"
  | "color.border.danger"
  | "color.action.primary.bg"
  | "color.action.primary.bg-hover"
  | "color.action.primary.bg-active"
  | "color.action.primary.text"
  | "color.action.secondary.bg"
  | "color.action.secondary.bg-hover"
  | "color.action.secondary.bg-active"
  | "color.action.secondary.text"
  | "color.action.secondary.border"
  | "color.action.ghost.bg-hover"
  | "color.action.ghost.bg-active"
  | "color.action.ghost.text"
  | "color.action.danger.bg"
  | "color.action.danger.bg-hover"
  | "color.action.danger.bg-active"
  | "color.action.danger.text"
  | "color.action.disabled.bg"
  | "color.action.disabled.text"
  | "color.control.bg"
  | "color.control.bg-checked"
  | "color.control.fg-checked"
  | "color.control.track"
  | "color.control.thumb"
  | "color.feedback.info.bg"
  | "color.feedback.info.border"
  | "color.feedback.info.text"
  | "color.feedback.info.icon"
  | "color.feedback.success.bg"
  | "color.feedback.success.border"
  | "color.feedback.success.text"
  | "color.feedback.success.icon"
  | "color.feedback.warning.bg"
  | "color.feedback.warning.border"
  | "color.feedback.warning.text"
  | "color.feedback.warning.icon"
  | "color.feedback.danger.bg"
  | "color.feedback.danger.border"
  | "color.feedback.danger.text"
  | "color.feedback.danger.icon"
  | "color.amount.incoming"
  | "color.amount.outgoing"
  | "color.amount.pending"
  | "color.accent.decorative"
  | "color.accent.decorative-subtle"
  | "color.skeleton.base"
  | "color.skeleton.highlight"
  | "radius.none"
  | "radius.sm"
  | "radius.md"
  | "radius.lg"
  | "radius.xl"
  | "radius.control"
  | "radius.card"
  | "radius.pill"
  | "size.touch-target"
  | "size.control.sm"
  | "size.control.md"
  | "size.control.lg"
  | "size.icon.sm"
  | "size.icon.md"
  | "size.icon.lg"
  | "size.avatar.sm"
  | "size.avatar.md"
  | "size.avatar.lg"
  | "size.focus-ring.width"
  | "size.focus-ring.offset"
  | "size.border.default"
  | "size.border.strong"
  | "size.dialog"
  | "size.tooltip-max"
  | "space.none"
  | "space.3xs"
  | "space.2xs"
  | "space.xs"
  | "space.sm"
  | "space.md"
  | "space.lg"
  | "space.xl"
  | "space.2xl"
  | "space.3xl"
  | "layer.base"
  | "layer.raised"
  | "layer.sticky"
  | "layer.overlay"
  | "layer.toast"
  | "layer.tooltip"
  | "motion.duration.instant"
  | "motion.duration.fast"
  | "motion.duration.base"
  | "motion.duration.slow"
  | "motion.easing.standard"
  | "motion.easing.enter"
  | "motion.easing.exit"
  | "type.display.lg.family"
  | "type.display.lg.size"
  | "type.display.lg.line-height"
  | "type.display.lg.weight"
  | "type.display.lg.tracking"
  | "type.display.md.family"
  | "type.display.md.size"
  | "type.display.md.line-height"
  | "type.display.md.weight"
  | "type.display.md.tracking"
  | "type.heading.xl.family"
  | "type.heading.xl.size"
  | "type.heading.xl.line-height"
  | "type.heading.xl.weight"
  | "type.heading.xl.tracking"
  | "type.heading.lg.family"
  | "type.heading.lg.size"
  | "type.heading.lg.line-height"
  | "type.heading.lg.weight"
  | "type.heading.lg.tracking"
  | "type.heading.md.family"
  | "type.heading.md.size"
  | "type.heading.md.line-height"
  | "type.heading.md.weight"
  | "type.heading.md.tracking"
  | "type.heading.sm.family"
  | "type.heading.sm.size"
  | "type.heading.sm.line-height"
  | "type.heading.sm.weight"
  | "type.heading.sm.tracking"
  | "type.heading.xs.family"
  | "type.heading.xs.size"
  | "type.heading.xs.line-height"
  | "type.heading.xs.weight"
  | "type.heading.xs.tracking"
  | "type.body.md.family"
  | "type.body.md.size"
  | "type.body.md.line-height"
  | "type.body.md.weight"
  | "type.body.md.tracking"
  | "type.body.sm.family"
  | "type.body.sm.size"
  | "type.body.sm.line-height"
  | "type.body.sm.weight"
  | "type.body.sm.tracking"
  | "type.label.md.family"
  | "type.label.md.size"
  | "type.label.md.line-height"
  | "type.label.md.weight"
  | "type.label.md.tracking"
  | "type.label.sm.family"
  | "type.label.sm.size"
  | "type.label.sm.line-height"
  | "type.label.sm.weight"
  | "type.label.sm.tracking"
  | "type.caption.family"
  | "type.caption.size"
  | "type.caption.line-height"
  | "type.caption.weight"
  | "type.caption.tracking"
  | "type.amount.lg.family"
  | "type.amount.lg.size"
  | "type.amount.lg.line-height"
  | "type.amount.lg.weight"
  | "type.amount.lg.tracking"
  | "type.amount.md.family"
  | "type.amount.md.size"
  | "type.amount.md.line-height"
  | "type.amount.md.weight"
  | "type.amount.md.tracking"
  | "type.amount.sm.family"
  | "type.amount.sm.size"
  | "type.amount.sm.line-height"
  | "type.amount.sm.weight"
  | "type.amount.sm.tracking"
  | "shadow.1"
  | "shadow.2"
  | "shadow.3";
export interface TokenEntry { value: string | number; cssVar: string; type?: string; description?: string; ref?: string }
export const tokens: Record<ThemeName, Record<TokenName, TokenEntry>> = {
  "light": {
    "color.bg.canvas": {
      "value": "#f6f6fb",
      "cssVar": "--lw-color-bg-canvas",
      "type": "color",
      "description": "App background behind all surfaces",
      "ref": "color.ink.50"
    },
    "color.surface.default": {
      "value": "#ffffff",
      "cssVar": "--lw-color-surface-default",
      "type": "color",
      "ref": "color.white"
    },
    "color.surface.raised": {
      "value": "#ffffff",
      "cssVar": "--lw-color-surface-raised",
      "type": "color",
      "description": "Cards and menus. Pair with an elevation token.",
      "ref": "color.white"
    },
    "color.surface.overlay": {
      "value": "#ffffff",
      "cssVar": "--lw-color-surface-overlay",
      "type": "color",
      "description": "Dialogs, popovers, toasts",
      "ref": "color.white"
    },
    "color.surface.sunken": {
      "value": "#eeeff4",
      "cssVar": "--lw-color-surface-sunken",
      "type": "color",
      "ref": "color.ink.100"
    },
    "color.surface.inverse": {
      "value": "#16163a",
      "cssVar": "--lw-color-surface-inverse",
      "type": "color",
      "ref": "color.ink.950"
    },
    "color.surface.hover": {
      "value": "#eeeff4",
      "cssVar": "--lw-color-surface-hover",
      "type": "color",
      "ref": "color.ink.100"
    },
    "color.surface.pressed": {
      "value": "#dddde3",
      "cssVar": "--lw-color-surface-pressed",
      "type": "color",
      "ref": "color.ink.200"
    },
    "color.surface.brand": {
      "value": "#f5f9ff",
      "cssVar": "--lw-color-surface-brand",
      "type": "color",
      "description": "Tinted surface for selected or highlighted items",
      "ref": "color.iris.50"
    },
    "color.scrim": {
      "value": "rgba(22, 22, 58, 0.48)",
      "cssVar": "--lw-color-scrim",
      "type": "color",
      "description": "Backdrop behind dialogs"
    },
    "color.text.primary": {
      "value": "#16163a",
      "cssVar": "--lw-color-text-primary",
      "type": "color",
      "ref": "color.ink.950"
    },
    "color.text.secondary": {
      "value": "#5a5b70",
      "cssVar": "--lw-color-text-secondary",
      "type": "color",
      "ref": "color.ink.600"
    },
    "color.text.tertiary": {
      "value": "#6d6f80",
      "cssVar": "--lw-color-text-tertiary",
      "type": "color",
      "description": "Hints, captions, placeholders. Still AA.",
      "ref": "color.ink.500"
    },
    "color.text.disabled": {
      "value": "#8c8d99",
      "cssVar": "--lw-color-text-disabled",
      "type": "color",
      "description": "Exempt from contrast rules. Never the only cue.",
      "ref": "color.ink.400"
    },
    "color.text.inverse": {
      "value": "#f6f6fb",
      "cssVar": "--lw-color-text-inverse",
      "type": "color",
      "ref": "color.ink.50"
    },
    "color.text.link": {
      "value": "#4c3fe0",
      "cssVar": "--lw-color-text-link",
      "type": "color",
      "ref": "color.iris.600"
    },
    "color.text.link-hover": {
      "value": "#3c2dbb",
      "cssVar": "--lw-color-text-link-hover",
      "type": "color",
      "ref": "color.iris.700"
    },
    "color.text.brand": {
      "value": "#4c3fe0",
      "cssVar": "--lw-color-text-brand",
      "type": "color",
      "ref": "color.iris.600"
    },
    "color.text.accent": {
      "value": "#c2410c",
      "cssVar": "--lw-color-text-accent",
      "type": "color",
      "description": "Rare emphasis text in the accent hue",
      "ref": "color.coral.500"
    },
    "color.text.success": {
      "value": "#08745d",
      "cssVar": "--lw-color-text-success",
      "type": "color",
      "ref": "color.teal.500"
    },
    "color.text.warning": {
      "value": "#b45309",
      "cssVar": "--lw-color-text-warning",
      "type": "color",
      "ref": "color.warning.500"
    },
    "color.text.danger": {
      "value": "#c8283e",
      "cssVar": "--lw-color-text-danger",
      "type": "color",
      "ref": "color.danger.500"
    },
    "color.icon.primary": {
      "value": "#16163a",
      "cssVar": "--lw-color-icon-primary",
      "type": "color",
      "ref": "color.ink.950"
    },
    "color.icon.secondary": {
      "value": "#5a5b70",
      "cssVar": "--lw-color-icon-secondary",
      "type": "color",
      "ref": "color.ink.600"
    },
    "color.icon.brand": {
      "value": "#4c3fe0",
      "cssVar": "--lw-color-icon-brand",
      "type": "color",
      "ref": "color.iris.600"
    },
    "color.border.subtle": {
      "value": "#dddde3",
      "cssVar": "--lw-color-border-subtle",
      "type": "color",
      "description": "Dividers and card outlines. Decorative only.",
      "ref": "color.ink.200"
    },
    "color.border.default": {
      "value": "#8c8d99",
      "cssVar": "--lw-color-border-default",
      "type": "color",
      "description": "Input and control boundaries. At least 3:1.",
      "ref": "color.ink.400"
    },
    "color.border.strong": {
      "value": "#5a5b70",
      "cssVar": "--lw-color-border-strong",
      "type": "color",
      "ref": "color.ink.600"
    },
    "color.border.focus": {
      "value": "#4c3fe0",
      "cssVar": "--lw-color-border-focus",
      "type": "color",
      "description": "Focus ring. At least 3:1 against every surface.",
      "ref": "color.iris.600"
    },
    "color.border.brand": {
      "value": "#4c3fe0",
      "cssVar": "--lw-color-border-brand",
      "type": "color",
      "ref": "color.iris.600"
    },
    "color.border.danger": {
      "value": "#c8283e",
      "cssVar": "--lw-color-border-danger",
      "type": "color",
      "ref": "color.danger.500"
    },
    "color.action.primary.bg": {
      "value": "#4c3fe0",
      "cssVar": "--lw-color-action-primary-bg",
      "type": "color",
      "ref": "color.iris.600"
    },
    "color.action.primary.bg-hover": {
      "value": "#3c2dbb",
      "cssVar": "--lw-color-action-primary-bg-hover",
      "type": "color",
      "ref": "color.iris.700"
    },
    "color.action.primary.bg-active": {
      "value": "#2e1d99",
      "cssVar": "--lw-color-action-primary-bg-active",
      "type": "color",
      "ref": "color.iris.800"
    },
    "color.action.primary.text": {
      "value": "#ffffff",
      "cssVar": "--lw-color-action-primary-text",
      "type": "color",
      "ref": "color.white"
    },
    "color.action.secondary.bg": {
      "value": "#f5f9ff",
      "cssVar": "--lw-color-action-secondary-bg",
      "type": "color",
      "ref": "color.iris.50"
    },
    "color.action.secondary.bg-hover": {
      "value": "#e9efff",
      "cssVar": "--lw-color-action-secondary-bg-hover",
      "type": "color",
      "ref": "color.iris.100"
    },
    "color.action.secondary.bg-active": {
      "value": "#d4dcff",
      "cssVar": "--lw-color-action-secondary-bg-active",
      "type": "color",
      "ref": "color.iris.200"
    },
    "color.action.secondary.text": {
      "value": "#3c2dbb",
      "cssVar": "--lw-color-action-secondary-text",
      "type": "color",
      "ref": "color.iris.700"
    },
    "color.action.secondary.border": {
      "value": "#d4dcff",
      "cssVar": "--lw-color-action-secondary-border",
      "type": "color",
      "ref": "color.iris.200"
    },
    "color.action.ghost.bg-hover": {
      "value": "#f5f9ff",
      "cssVar": "--lw-color-action-ghost-bg-hover",
      "type": "color",
      "ref": "color.iris.50"
    },
    "color.action.ghost.bg-active": {
      "value": "#e9efff",
      "cssVar": "--lw-color-action-ghost-bg-active",
      "type": "color",
      "ref": "color.iris.100"
    },
    "color.action.ghost.text": {
      "value": "#4c3fe0",
      "cssVar": "--lw-color-action-ghost-text",
      "type": "color",
      "ref": "color.iris.600"
    },
    "color.action.danger.bg": {
      "value": "#c8283e",
      "cssVar": "--lw-color-action-danger-bg",
      "type": "color",
      "ref": "color.danger.500"
    },
    "color.action.danger.bg-hover": {
      "value": "#b41e35",
      "cssVar": "--lw-color-action-danger-bg-hover",
      "type": "color",
      "ref": "color.danger.600"
    },
    "color.action.danger.bg-active": {
      "value": "#920a25",
      "cssVar": "--lw-color-action-danger-bg-active",
      "type": "color",
      "ref": "color.danger.700"
    },
    "color.action.danger.text": {
      "value": "#ffffff",
      "cssVar": "--lw-color-action-danger-text",
      "type": "color",
      "ref": "color.white"
    },
    "color.action.disabled.bg": {
      "value": "#eeeff4",
      "cssVar": "--lw-color-action-disabled-bg",
      "type": "color",
      "ref": "color.ink.100"
    },
    "color.action.disabled.text": {
      "value": "#8c8d99",
      "cssVar": "--lw-color-action-disabled-text",
      "type": "color",
      "ref": "color.ink.400"
    },
    "color.control.bg": {
      "value": "#ffffff",
      "cssVar": "--lw-color-control-bg",
      "type": "color",
      "ref": "color.white"
    },
    "color.control.bg-checked": {
      "value": "#4c3fe0",
      "cssVar": "--lw-color-control-bg-checked",
      "type": "color",
      "ref": "color.iris.600"
    },
    "color.control.fg-checked": {
      "value": "#ffffff",
      "cssVar": "--lw-color-control-fg-checked",
      "type": "color",
      "ref": "color.white"
    },
    "color.control.track": {
      "value": "#8c8d99",
      "cssVar": "--lw-color-control-track",
      "type": "color",
      "ref": "color.ink.400"
    },
    "color.control.thumb": {
      "value": "#ffffff",
      "cssVar": "--lw-color-control-thumb",
      "type": "color",
      "ref": "color.white"
    },
    "color.feedback.info.bg": {
      "value": "#f5f9ff",
      "cssVar": "--lw-color-feedback-info-bg",
      "type": "color",
      "ref": "color.iris.50"
    },
    "color.feedback.info.border": {
      "value": "#d4dcff",
      "cssVar": "--lw-color-feedback-info-border",
      "type": "color",
      "ref": "color.iris.200"
    },
    "color.feedback.info.text": {
      "value": "#3c2dbb",
      "cssVar": "--lw-color-feedback-info-text",
      "type": "color",
      "ref": "color.iris.700"
    },
    "color.feedback.info.icon": {
      "value": "#4c3fe0",
      "cssVar": "--lw-color-feedback-info-icon",
      "type": "color",
      "ref": "color.iris.600"
    },
    "color.feedback.success.bg": {
      "value": "#ecfbf6",
      "cssVar": "--lw-color-feedback-success-bg",
      "type": "color",
      "ref": "color.teal.50"
    },
    "color.feedback.success.border": {
      "value": "#c0e6d9",
      "cssVar": "--lw-color-feedback-success-border",
      "type": "color",
      "ref": "color.teal.200"
    },
    "color.feedback.success.text": {
      "value": "#005340",
      "cssVar": "--lw-color-feedback-success-text",
      "type": "color",
      "ref": "color.teal.700"
    },
    "color.feedback.success.icon": {
      "value": "#006a54",
      "cssVar": "--lw-color-feedback-success-icon",
      "type": "color",
      "ref": "color.teal.600"
    },
    "color.feedback.warning.bg": {
      "value": "#fff7f0",
      "cssVar": "--lw-color-feedback-warning-bg",
      "type": "color",
      "ref": "color.warning.50"
    },
    "color.feedback.warning.border": {
      "value": "#ffd6bd",
      "cssVar": "--lw-color-feedback-warning-border",
      "type": "color",
      "ref": "color.warning.200"
    },
    "color.feedback.warning.text": {
      "value": "#783300",
      "cssVar": "--lw-color-feedback-warning-text",
      "type": "color",
      "ref": "color.warning.700"
    },
    "color.feedback.warning.icon": {
      "value": "#994500",
      "cssVar": "--lw-color-feedback-warning-icon",
      "type": "color",
      "ref": "color.warning.600"
    },
    "color.feedback.danger.bg": {
      "value": "#fff7f6",
      "cssVar": "--lw-color-feedback-danger-bg",
      "type": "color",
      "ref": "color.danger.50"
    },
    "color.feedback.danger.border": {
      "value": "#ffd4d2",
      "cssVar": "--lw-color-feedback-danger-border",
      "type": "color",
      "ref": "color.danger.200"
    },
    "color.feedback.danger.text": {
      "value": "#920a25",
      "cssVar": "--lw-color-feedback-danger-text",
      "type": "color",
      "ref": "color.danger.700"
    },
    "color.feedback.danger.icon": {
      "value": "#b41e35",
      "cssVar": "--lw-color-feedback-danger-icon",
      "type": "color",
      "ref": "color.danger.600"
    },
    "color.amount.incoming": {
      "value": "#08745d",
      "cssVar": "--lw-color-amount-incoming",
      "type": "color",
      "description": "Money in. Always with a plus sign.",
      "ref": "color.teal.500"
    },
    "color.amount.outgoing": {
      "value": "#16163a",
      "cssVar": "--lw-color-amount-outgoing",
      "type": "color",
      "description": "Money out. Never red. Always with a minus sign.",
      "ref": "color.ink.950"
    },
    "color.amount.pending": {
      "value": "#b45309",
      "cssVar": "--lw-color-amount-pending",
      "type": "color",
      "description": "Not settled yet. Always with a pending label.",
      "ref": "color.warning.500"
    },
    "color.accent.decorative": {
      "value": "#ff7a59",
      "cssVar": "--lw-color-accent-decorative",
      "type": "color",
      "description": "Illustration and highlights only. Never text or the only signal of state.",
      "ref": "color.coral.400"
    },
    "color.accent.decorative-subtle": {
      "value": "#ffece3",
      "cssVar": "--lw-color-accent-decorative-subtle",
      "type": "color",
      "ref": "color.coral.100"
    },
    "color.skeleton.base": {
      "value": "#eeeff4",
      "cssVar": "--lw-color-skeleton-base",
      "type": "color",
      "ref": "color.ink.100"
    },
    "color.skeleton.highlight": {
      "value": "#f6f6fb",
      "cssVar": "--lw-color-skeleton-highlight",
      "type": "color",
      "ref": "color.ink.50"
    },
    "radius.none": {
      "value": "0",
      "cssVar": "--lw-radius-none",
      "type": "dimension",
      "ref": "radius.0"
    },
    "radius.sm": {
      "value": "4px",
      "cssVar": "--lw-radius-sm",
      "type": "dimension",
      "ref": "radius.4"
    },
    "radius.md": {
      "value": "8px",
      "cssVar": "--lw-radius-md",
      "type": "dimension",
      "ref": "radius.8"
    },
    "radius.lg": {
      "value": "12px",
      "cssVar": "--lw-radius-lg",
      "type": "dimension",
      "ref": "radius.12"
    },
    "radius.xl": {
      "value": "16px",
      "cssVar": "--lw-radius-xl",
      "type": "dimension",
      "ref": "radius.16"
    },
    "radius.control": {
      "value": "8px",
      "cssVar": "--lw-radius-control",
      "type": "dimension",
      "description": "Buttons, inputs, selects",
      "ref": "radius.8"
    },
    "radius.card": {
      "value": "16px",
      "cssVar": "--lw-radius-card",
      "type": "dimension",
      "description": "Cards and dialogs",
      "ref": "radius.16"
    },
    "radius.pill": {
      "value": "9999px",
      "cssVar": "--lw-radius-pill",
      "type": "dimension",
      "ref": "radius.full"
    },
    "size.touch-target": {
      "value": "2.75rem",
      "cssVar": "--lw-size-touch-target",
      "type": "dimension",
      "description": "Minimum hit area for any interactive element",
      "ref": "size.44"
    },
    "size.control.sm": {
      "value": "2.25rem",
      "cssVar": "--lw-size-control-sm",
      "type": "dimension",
      "ref": "size.36"
    },
    "size.control.md": {
      "value": "2.75rem",
      "cssVar": "--lw-size-control-md",
      "type": "dimension",
      "ref": "size.44"
    },
    "size.control.lg": {
      "value": "3.25rem",
      "cssVar": "--lw-size-control-lg",
      "type": "dimension",
      "ref": "size.52"
    },
    "size.icon.sm": {
      "value": "1rem",
      "cssVar": "--lw-size-icon-sm",
      "type": "dimension",
      "ref": "size.16"
    },
    "size.icon.md": {
      "value": "1.25rem",
      "cssVar": "--lw-size-icon-md",
      "type": "dimension",
      "ref": "size.20"
    },
    "size.icon.lg": {
      "value": "1.5rem",
      "cssVar": "--lw-size-icon-lg",
      "type": "dimension",
      "ref": "size.24"
    },
    "size.avatar.sm": {
      "value": "2rem",
      "cssVar": "--lw-size-avatar-sm",
      "type": "dimension",
      "ref": "size.32"
    },
    "size.avatar.md": {
      "value": "2.5rem",
      "cssVar": "--lw-size-avatar-md",
      "type": "dimension",
      "ref": "size.40"
    },
    "size.avatar.lg": {
      "value": "3.5rem",
      "cssVar": "--lw-size-avatar-lg",
      "type": "dimension",
      "ref": "size.56"
    },
    "size.focus-ring.width": {
      "value": "0.125rem",
      "cssVar": "--lw-size-focus-ring-width",
      "type": "dimension",
      "ref": "size.2"
    },
    "size.focus-ring.offset": {
      "value": "0.125rem",
      "cssVar": "--lw-size-focus-ring-offset",
      "type": "dimension",
      "ref": "size.2"
    },
    "size.border.default": {
      "value": "0.0625rem",
      "cssVar": "--lw-size-border-default",
      "type": "dimension",
      "ref": "size.1"
    },
    "size.border.strong": {
      "value": "0.125rem",
      "cssVar": "--lw-size-border-strong",
      "type": "dimension",
      "ref": "size.2"
    },
    "size.dialog": {
      "value": "30rem",
      "cssVar": "--lw-size-dialog",
      "type": "dimension"
    },
    "size.tooltip-max": {
      "value": "17.5rem",
      "cssVar": "--lw-size-tooltip-max",
      "type": "dimension"
    },
    "space.none": {
      "value": "0",
      "cssVar": "--lw-space-none",
      "type": "dimension",
      "ref": "space.0"
    },
    "space.3xs": {
      "value": "0.125rem",
      "cssVar": "--lw-space-3xs",
      "type": "dimension",
      "ref": "space.0_5"
    },
    "space.2xs": {
      "value": "0.25rem",
      "cssVar": "--lw-space-2xs",
      "type": "dimension",
      "ref": "space.1"
    },
    "space.xs": {
      "value": "0.5rem",
      "cssVar": "--lw-space-xs",
      "type": "dimension",
      "ref": "space.2"
    },
    "space.sm": {
      "value": "0.75rem",
      "cssVar": "--lw-space-sm",
      "type": "dimension",
      "ref": "space.3"
    },
    "space.md": {
      "value": "1rem",
      "cssVar": "--lw-space-md",
      "type": "dimension",
      "ref": "space.4"
    },
    "space.lg": {
      "value": "1.5rem",
      "cssVar": "--lw-space-lg",
      "type": "dimension",
      "ref": "space.6"
    },
    "space.xl": {
      "value": "2rem",
      "cssVar": "--lw-space-xl",
      "type": "dimension",
      "ref": "space.8"
    },
    "space.2xl": {
      "value": "3rem",
      "cssVar": "--lw-space-2xl",
      "type": "dimension",
      "ref": "space.12"
    },
    "space.3xl": {
      "value": "4rem",
      "cssVar": "--lw-space-3xl",
      "type": "dimension",
      "ref": "space.16"
    },
    "layer.base": {
      "value": 0,
      "cssVar": "--lw-layer-base",
      "type": "number"
    },
    "layer.raised": {
      "value": 10,
      "cssVar": "--lw-layer-raised",
      "type": "number"
    },
    "layer.sticky": {
      "value": 100,
      "cssVar": "--lw-layer-sticky",
      "type": "number"
    },
    "layer.overlay": {
      "value": 1000,
      "cssVar": "--lw-layer-overlay",
      "type": "number"
    },
    "layer.toast": {
      "value": 1100,
      "cssVar": "--lw-layer-toast",
      "type": "number"
    },
    "layer.tooltip": {
      "value": 1200,
      "cssVar": "--lw-layer-tooltip",
      "type": "number"
    },
    "motion.duration.instant": {
      "value": "100ms",
      "cssVar": "--lw-motion-duration-instant",
      "type": "duration",
      "ref": "duration.100"
    },
    "motion.duration.fast": {
      "value": "150ms",
      "cssVar": "--lw-motion-duration-fast",
      "type": "duration",
      "ref": "duration.150"
    },
    "motion.duration.base": {
      "value": "200ms",
      "cssVar": "--lw-motion-duration-base",
      "type": "duration",
      "ref": "duration.200"
    },
    "motion.duration.slow": {
      "value": "300ms",
      "cssVar": "--lw-motion-duration-slow",
      "type": "duration",
      "ref": "duration.300"
    },
    "motion.easing.standard": {
      "value": "cubic-bezier(0.2, 0, 0, 1)",
      "cssVar": "--lw-motion-easing-standard",
      "type": "cubicBezier",
      "ref": "easing.standard"
    },
    "motion.easing.enter": {
      "value": "cubic-bezier(0, 0, 0, 1)",
      "cssVar": "--lw-motion-easing-enter",
      "type": "cubicBezier",
      "ref": "easing.decelerate"
    },
    "motion.easing.exit": {
      "value": "cubic-bezier(0.3, 0, 1, 1)",
      "cssVar": "--lw-motion-easing-exit",
      "type": "cubicBezier",
      "ref": "easing.accelerate"
    },
    "type.display.lg.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-display-lg-family",
      "ref": "font.family.inter"
    },
    "type.display.lg.size": {
      "value": "3rem",
      "cssVar": "--lw-type-display-lg-size",
      "ref": "font.size.48"
    },
    "type.display.lg.line-height": {
      "value": "3.5rem",
      "cssVar": "--lw-type-display-lg-line-height",
      "ref": "font.line-height.56"
    },
    "type.display.lg.weight": {
      "value": 700,
      "cssVar": "--lw-type-display-lg-weight",
      "ref": "font.weight.bold"
    },
    "type.display.lg.tracking": {
      "value": "-0.02em",
      "cssVar": "--lw-type-display-lg-tracking",
      "ref": "font.tracking.tight"
    },
    "type.display.md.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-display-md-family",
      "ref": "font.family.inter"
    },
    "type.display.md.size": {
      "value": "2.5rem",
      "cssVar": "--lw-type-display-md-size",
      "ref": "font.size.40"
    },
    "type.display.md.line-height": {
      "value": "3rem",
      "cssVar": "--lw-type-display-md-line-height",
      "ref": "font.line-height.48"
    },
    "type.display.md.weight": {
      "value": 700,
      "cssVar": "--lw-type-display-md-weight",
      "ref": "font.weight.bold"
    },
    "type.display.md.tracking": {
      "value": "-0.02em",
      "cssVar": "--lw-type-display-md-tracking",
      "ref": "font.tracking.tight"
    },
    "type.heading.xl.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-heading-xl-family",
      "ref": "font.family.inter"
    },
    "type.heading.xl.size": {
      "value": "2rem",
      "cssVar": "--lw-type-heading-xl-size",
      "ref": "font.size.32"
    },
    "type.heading.xl.line-height": {
      "value": "2.5rem",
      "cssVar": "--lw-type-heading-xl-line-height",
      "ref": "font.line-height.40"
    },
    "type.heading.xl.weight": {
      "value": 600,
      "cssVar": "--lw-type-heading-xl-weight",
      "ref": "font.weight.semibold"
    },
    "type.heading.xl.tracking": {
      "value": "-0.02em",
      "cssVar": "--lw-type-heading-xl-tracking",
      "ref": "font.tracking.tight"
    },
    "type.heading.lg.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-heading-lg-family",
      "ref": "font.family.inter"
    },
    "type.heading.lg.size": {
      "value": "1.75rem",
      "cssVar": "--lw-type-heading-lg-size",
      "ref": "font.size.28"
    },
    "type.heading.lg.line-height": {
      "value": "2.25rem",
      "cssVar": "--lw-type-heading-lg-line-height",
      "ref": "font.line-height.36"
    },
    "type.heading.lg.weight": {
      "value": 600,
      "cssVar": "--lw-type-heading-lg-weight",
      "ref": "font.weight.semibold"
    },
    "type.heading.lg.tracking": {
      "value": "-0.02em",
      "cssVar": "--lw-type-heading-lg-tracking",
      "ref": "font.tracking.tight"
    },
    "type.heading.md.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-heading-md-family",
      "ref": "font.family.inter"
    },
    "type.heading.md.size": {
      "value": "1.5rem",
      "cssVar": "--lw-type-heading-md-size",
      "ref": "font.size.24"
    },
    "type.heading.md.line-height": {
      "value": "2rem",
      "cssVar": "--lw-type-heading-md-line-height",
      "ref": "font.line-height.32"
    },
    "type.heading.md.weight": {
      "value": 600,
      "cssVar": "--lw-type-heading-md-weight",
      "ref": "font.weight.semibold"
    },
    "type.heading.md.tracking": {
      "value": "-0.01em",
      "cssVar": "--lw-type-heading-md-tracking",
      "ref": "font.tracking.snug"
    },
    "type.heading.sm.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-heading-sm-family",
      "ref": "font.family.inter"
    },
    "type.heading.sm.size": {
      "value": "1.25rem",
      "cssVar": "--lw-type-heading-sm-size",
      "ref": "font.size.20"
    },
    "type.heading.sm.line-height": {
      "value": "1.75rem",
      "cssVar": "--lw-type-heading-sm-line-height",
      "ref": "font.line-height.28"
    },
    "type.heading.sm.weight": {
      "value": 600,
      "cssVar": "--lw-type-heading-sm-weight",
      "ref": "font.weight.semibold"
    },
    "type.heading.sm.tracking": {
      "value": "-0.01em",
      "cssVar": "--lw-type-heading-sm-tracking",
      "ref": "font.tracking.snug"
    },
    "type.heading.xs.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-heading-xs-family",
      "ref": "font.family.inter"
    },
    "type.heading.xs.size": {
      "value": "1rem",
      "cssVar": "--lw-type-heading-xs-size",
      "ref": "font.size.16"
    },
    "type.heading.xs.line-height": {
      "value": "1.5rem",
      "cssVar": "--lw-type-heading-xs-line-height",
      "ref": "font.line-height.24"
    },
    "type.heading.xs.weight": {
      "value": 600,
      "cssVar": "--lw-type-heading-xs-weight",
      "ref": "font.weight.semibold"
    },
    "type.heading.xs.tracking": {
      "value": "0em",
      "cssVar": "--lw-type-heading-xs-tracking",
      "ref": "font.tracking.normal"
    },
    "type.body.md.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-body-md-family",
      "ref": "font.family.inter"
    },
    "type.body.md.size": {
      "value": "1rem",
      "cssVar": "--lw-type-body-md-size",
      "ref": "font.size.16"
    },
    "type.body.md.line-height": {
      "value": "1.5rem",
      "cssVar": "--lw-type-body-md-line-height",
      "ref": "font.line-height.24"
    },
    "type.body.md.weight": {
      "value": 400,
      "cssVar": "--lw-type-body-md-weight",
      "ref": "font.weight.regular"
    },
    "type.body.md.tracking": {
      "value": "0em",
      "cssVar": "--lw-type-body-md-tracking",
      "ref": "font.tracking.normal"
    },
    "type.body.sm.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-body-sm-family",
      "ref": "font.family.inter"
    },
    "type.body.sm.size": {
      "value": "0.875rem",
      "cssVar": "--lw-type-body-sm-size",
      "ref": "font.size.14"
    },
    "type.body.sm.line-height": {
      "value": "1.25rem",
      "cssVar": "--lw-type-body-sm-line-height",
      "ref": "font.line-height.20"
    },
    "type.body.sm.weight": {
      "value": 400,
      "cssVar": "--lw-type-body-sm-weight",
      "ref": "font.weight.regular"
    },
    "type.body.sm.tracking": {
      "value": "0em",
      "cssVar": "--lw-type-body-sm-tracking",
      "ref": "font.tracking.normal"
    },
    "type.label.md.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-label-md-family",
      "ref": "font.family.inter"
    },
    "type.label.md.size": {
      "value": "1rem",
      "cssVar": "--lw-type-label-md-size",
      "ref": "font.size.16"
    },
    "type.label.md.line-height": {
      "value": "1.5rem",
      "cssVar": "--lw-type-label-md-line-height",
      "ref": "font.line-height.24"
    },
    "type.label.md.weight": {
      "value": 500,
      "cssVar": "--lw-type-label-md-weight",
      "ref": "font.weight.medium"
    },
    "type.label.md.tracking": {
      "value": "0em",
      "cssVar": "--lw-type-label-md-tracking",
      "ref": "font.tracking.normal"
    },
    "type.label.sm.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-label-sm-family",
      "ref": "font.family.inter"
    },
    "type.label.sm.size": {
      "value": "0.875rem",
      "cssVar": "--lw-type-label-sm-size",
      "ref": "font.size.14"
    },
    "type.label.sm.line-height": {
      "value": "1.25rem",
      "cssVar": "--lw-type-label-sm-line-height",
      "ref": "font.line-height.20"
    },
    "type.label.sm.weight": {
      "value": 500,
      "cssVar": "--lw-type-label-sm-weight",
      "ref": "font.weight.medium"
    },
    "type.label.sm.tracking": {
      "value": "0em",
      "cssVar": "--lw-type-label-sm-tracking",
      "ref": "font.tracking.normal"
    },
    "type.caption.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-caption-family",
      "ref": "font.family.inter"
    },
    "type.caption.size": {
      "value": "0.75rem",
      "cssVar": "--lw-type-caption-size",
      "ref": "font.size.12"
    },
    "type.caption.line-height": {
      "value": "1rem",
      "cssVar": "--lw-type-caption-line-height",
      "ref": "font.line-height.16"
    },
    "type.caption.weight": {
      "value": 400,
      "cssVar": "--lw-type-caption-weight",
      "ref": "font.weight.regular"
    },
    "type.caption.tracking": {
      "value": "0.02em",
      "cssVar": "--lw-type-caption-tracking",
      "ref": "font.tracking.wide"
    },
    "type.amount.lg.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-amount-lg-family",
      "ref": "font.family.inter"
    },
    "type.amount.lg.size": {
      "value": "2.5rem",
      "cssVar": "--lw-type-amount-lg-size",
      "ref": "font.size.40"
    },
    "type.amount.lg.line-height": {
      "value": "3rem",
      "cssVar": "--lw-type-amount-lg-line-height",
      "ref": "font.line-height.48"
    },
    "type.amount.lg.weight": {
      "value": 600,
      "cssVar": "--lw-type-amount-lg-weight",
      "ref": "font.weight.semibold"
    },
    "type.amount.lg.tracking": {
      "value": "-0.02em",
      "cssVar": "--lw-type-amount-lg-tracking",
      "ref": "font.tracking.tight"
    },
    "type.amount.md.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-amount-md-family",
      "ref": "font.family.inter"
    },
    "type.amount.md.size": {
      "value": "1.25rem",
      "cssVar": "--lw-type-amount-md-size",
      "ref": "font.size.20"
    },
    "type.amount.md.line-height": {
      "value": "1.75rem",
      "cssVar": "--lw-type-amount-md-line-height",
      "ref": "font.line-height.28"
    },
    "type.amount.md.weight": {
      "value": 600,
      "cssVar": "--lw-type-amount-md-weight",
      "ref": "font.weight.semibold"
    },
    "type.amount.md.tracking": {
      "value": "0em",
      "cssVar": "--lw-type-amount-md-tracking",
      "ref": "font.tracking.normal"
    },
    "type.amount.sm.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-amount-sm-family",
      "ref": "font.family.inter"
    },
    "type.amount.sm.size": {
      "value": "1rem",
      "cssVar": "--lw-type-amount-sm-size",
      "ref": "font.size.16"
    },
    "type.amount.sm.line-height": {
      "value": "1.5rem",
      "cssVar": "--lw-type-amount-sm-line-height",
      "ref": "font.line-height.24"
    },
    "type.amount.sm.weight": {
      "value": 500,
      "cssVar": "--lw-type-amount-sm-weight",
      "ref": "font.weight.medium"
    },
    "type.amount.sm.tracking": {
      "value": "0em",
      "cssVar": "--lw-type-amount-sm-tracking",
      "ref": "font.tracking.normal"
    },
    "shadow.1": {
      "value": "0px 1px 2px 0px #16163a0f, 0px 1px 3px 0px #16163a0a",
      "cssVar": "--lw-shadow-1",
      "type": "shadow"
    },
    "shadow.2": {
      "value": "0px 4px 12px -2px #16163a14, 0px 2px 4px -1px #16163a0a",
      "cssVar": "--lw-shadow-2",
      "type": "shadow"
    },
    "shadow.3": {
      "value": "0px 16px 32px -8px #16163a1f, 0px 4px 8px -2px #16163a0f",
      "cssVar": "--lw-shadow-3",
      "type": "shadow"
    }
  },
  "dark": {
    "color.bg.canvas": {
      "value": "#11131e",
      "cssVar": "--lw-color-bg-canvas",
      "type": "color",
      "description": "App background behind all surfaces",
      "ref": "color.deep.950"
    },
    "color.surface.default": {
      "value": "#191a29",
      "cssVar": "--lw-color-surface-default",
      "type": "color",
      "ref": "color.deep.900"
    },
    "color.surface.raised": {
      "value": "#202131",
      "cssVar": "--lw-color-surface-raised",
      "type": "color",
      "description": "Cards and menus. Pair with an elevation token.",
      "ref": "color.deep.850"
    },
    "color.surface.overlay": {
      "value": "#282a3b",
      "cssVar": "--lw-color-surface-overlay",
      "type": "color",
      "description": "Dialogs, popovers, toasts",
      "ref": "color.deep.800"
    },
    "color.surface.sunken": {
      "value": "#11131e",
      "cssVar": "--lw-color-surface-sunken",
      "type": "color",
      "ref": "color.deep.950"
    },
    "color.surface.inverse": {
      "value": "#f6f6fb",
      "cssVar": "--lw-color-surface-inverse",
      "type": "color",
      "ref": "color.ink.50"
    },
    "color.surface.hover": {
      "value": "#282a3b",
      "cssVar": "--lw-color-surface-hover",
      "type": "color",
      "ref": "color.deep.800"
    },
    "color.surface.pressed": {
      "value": "#3c3e52",
      "cssVar": "--lw-color-surface-pressed",
      "type": "color",
      "ref": "color.deep.700"
    },
    "color.surface.brand": {
      "value": "#282a3b",
      "cssVar": "--lw-color-surface-brand",
      "type": "color",
      "description": "Tinted surface for selected or highlighted items",
      "ref": "color.deep.800"
    },
    "color.scrim": {
      "value": "rgba(0, 0, 0, 0.62)",
      "cssVar": "--lw-color-scrim",
      "type": "color",
      "description": "Backdrop behind dialogs"
    },
    "color.text.primary": {
      "value": "#f6f6fb",
      "cssVar": "--lw-color-text-primary",
      "type": "color",
      "ref": "color.ink.50"
    },
    "color.text.secondary": {
      "value": "#dddde3",
      "cssVar": "--lw-color-text-secondary",
      "type": "color",
      "ref": "color.ink.200"
    },
    "color.text.tertiary": {
      "value": "#c0c1c7",
      "cssVar": "--lw-color-text-tertiary",
      "type": "color",
      "description": "Hints, captions, placeholders. Still AA.",
      "ref": "color.ink.300"
    },
    "color.text.disabled": {
      "value": "#6d6f80",
      "cssVar": "--lw-color-text-disabled",
      "type": "color",
      "description": "Exempt from contrast rules. Never the only cue.",
      "ref": "color.ink.500"
    },
    "color.text.inverse": {
      "value": "#16163a",
      "cssVar": "--lw-color-text-inverse",
      "type": "color",
      "ref": "color.ink.950"
    },
    "color.text.link": {
      "value": "#b2beff",
      "cssVar": "--lw-color-text-link",
      "type": "color",
      "ref": "color.iris.300"
    },
    "color.text.link-hover": {
      "value": "#d4dcff",
      "cssVar": "--lw-color-text-link-hover",
      "type": "color",
      "ref": "color.iris.200"
    },
    "color.text.brand": {
      "value": "#b2beff",
      "cssVar": "--lw-color-text-brand",
      "type": "color",
      "ref": "color.iris.300"
    },
    "color.text.accent": {
      "value": "#ffae95",
      "cssVar": "--lw-color-text-accent",
      "type": "color",
      "description": "Rare emphasis text in the accent hue",
      "ref": "color.coral.300"
    },
    "color.text.success": {
      "value": "#93cdba",
      "cssVar": "--lw-color-text-success",
      "type": "color",
      "ref": "color.teal.300"
    },
    "color.text.warning": {
      "value": "#f9b18a",
      "cssVar": "--lw-color-text-warning",
      "type": "color",
      "ref": "color.warning.300"
    },
    "color.text.danger": {
      "value": "#ffacab",
      "cssVar": "--lw-color-text-danger",
      "type": "color",
      "ref": "color.danger.300"
    },
    "color.icon.primary": {
      "value": "#f6f6fb",
      "cssVar": "--lw-color-icon-primary",
      "type": "color",
      "ref": "color.ink.50"
    },
    "color.icon.secondary": {
      "value": "#dddde3",
      "cssVar": "--lw-color-icon-secondary",
      "type": "color",
      "ref": "color.ink.200"
    },
    "color.icon.brand": {
      "value": "#b2beff",
      "cssVar": "--lw-color-icon-brand",
      "type": "color",
      "ref": "color.iris.300"
    },
    "color.border.subtle": {
      "value": "#3c3e52",
      "cssVar": "--lw-color-border-subtle",
      "type": "color",
      "description": "Dividers and card outlines. Decorative only.",
      "ref": "color.deep.700"
    },
    "color.border.default": {
      "value": "#8c8d99",
      "cssVar": "--lw-color-border-default",
      "type": "color",
      "description": "Input and control boundaries. At least 3:1.",
      "ref": "color.ink.400"
    },
    "color.border.strong": {
      "value": "#c0c1c7",
      "cssVar": "--lw-color-border-strong",
      "type": "color",
      "ref": "color.ink.300"
    },
    "color.border.focus": {
      "value": "#b2beff",
      "cssVar": "--lw-color-border-focus",
      "type": "color",
      "description": "Focus ring. At least 3:1 against every surface.",
      "ref": "color.iris.300"
    },
    "color.border.brand": {
      "value": "#b2beff",
      "cssVar": "--lw-color-border-brand",
      "type": "color",
      "ref": "color.iris.300"
    },
    "color.border.danger": {
      "value": "#ffacab",
      "cssVar": "--lw-color-border-danger",
      "type": "color",
      "ref": "color.danger.300"
    },
    "color.action.primary.bg": {
      "value": "#b2beff",
      "cssVar": "--lw-color-action-primary-bg",
      "type": "color",
      "ref": "color.iris.300"
    },
    "color.action.primary.bg-hover": {
      "value": "#d4dcff",
      "cssVar": "--lw-color-action-primary-bg-hover",
      "type": "color",
      "ref": "color.iris.200"
    },
    "color.action.primary.bg-active": {
      "value": "#e9efff",
      "cssVar": "--lw-color-action-primary-bg-active",
      "type": "color",
      "ref": "color.iris.100"
    },
    "color.action.primary.text": {
      "value": "#16163a",
      "cssVar": "--lw-color-action-primary-text",
      "type": "color",
      "ref": "color.ink.950"
    },
    "color.action.secondary.bg": {
      "value": "#282a3b",
      "cssVar": "--lw-color-action-secondary-bg",
      "type": "color",
      "ref": "color.deep.800"
    },
    "color.action.secondary.bg-hover": {
      "value": "#3c3e52",
      "cssVar": "--lw-color-action-secondary-bg-hover",
      "type": "color",
      "ref": "color.deep.700"
    },
    "color.action.secondary.bg-active": {
      "value": "#3c3e52",
      "cssVar": "--lw-color-action-secondary-bg-active",
      "type": "color",
      "ref": "color.deep.700"
    },
    "color.action.secondary.text": {
      "value": "#d4dcff",
      "cssVar": "--lw-color-action-secondary-text",
      "type": "color",
      "ref": "color.iris.200"
    },
    "color.action.secondary.border": {
      "value": "#3c3e52",
      "cssVar": "--lw-color-action-secondary-border",
      "type": "color",
      "ref": "color.deep.700"
    },
    "color.action.ghost.bg-hover": {
      "value": "#282a3b",
      "cssVar": "--lw-color-action-ghost-bg-hover",
      "type": "color",
      "ref": "color.deep.800"
    },
    "color.action.ghost.bg-active": {
      "value": "#3c3e52",
      "cssVar": "--lw-color-action-ghost-bg-active",
      "type": "color",
      "ref": "color.deep.700"
    },
    "color.action.ghost.text": {
      "value": "#b2beff",
      "cssVar": "--lw-color-action-ghost-text",
      "type": "color",
      "ref": "color.iris.300"
    },
    "color.action.danger.bg": {
      "value": "#ffacab",
      "cssVar": "--lw-color-action-danger-bg",
      "type": "color",
      "ref": "color.danger.300"
    },
    "color.action.danger.bg-hover": {
      "value": "#ffd4d2",
      "cssVar": "--lw-color-action-danger-bg-hover",
      "type": "color",
      "ref": "color.danger.200"
    },
    "color.action.danger.bg-active": {
      "value": "#ffebe9",
      "cssVar": "--lw-color-action-danger-bg-active",
      "type": "color",
      "ref": "color.danger.100"
    },
    "color.action.danger.text": {
      "value": "#16163a",
      "cssVar": "--lw-color-action-danger-text",
      "type": "color",
      "ref": "color.ink.950"
    },
    "color.action.disabled.bg": {
      "value": "#282a3b",
      "cssVar": "--lw-color-action-disabled-bg",
      "type": "color",
      "ref": "color.deep.800"
    },
    "color.action.disabled.text": {
      "value": "#5a5b70",
      "cssVar": "--lw-color-action-disabled-text",
      "type": "color",
      "ref": "color.ink.600"
    },
    "color.control.bg": {
      "value": "#191a29",
      "cssVar": "--lw-color-control-bg",
      "type": "color",
      "ref": "color.deep.900"
    },
    "color.control.bg-checked": {
      "value": "#b2beff",
      "cssVar": "--lw-color-control-bg-checked",
      "type": "color",
      "ref": "color.iris.300"
    },
    "color.control.fg-checked": {
      "value": "#16163a",
      "cssVar": "--lw-color-control-fg-checked",
      "type": "color",
      "ref": "color.ink.950"
    },
    "color.control.track": {
      "value": "#8c8d99",
      "cssVar": "--lw-color-control-track",
      "type": "color",
      "ref": "color.ink.400"
    },
    "color.control.thumb": {
      "value": "#f6f6fb",
      "cssVar": "--lw-color-control-thumb",
      "type": "color",
      "ref": "color.ink.50"
    },
    "color.feedback.info.bg": {
      "value": "#252944",
      "cssVar": "--lw-color-feedback-info-bg",
      "type": "color",
      "ref": "color.tint.info"
    },
    "color.feedback.info.border": {
      "value": "#424878",
      "cssVar": "--lw-color-feedback-info-border",
      "type": "color",
      "ref": "color.tint.info-border"
    },
    "color.feedback.info.text": {
      "value": "#d4dcff",
      "cssVar": "--lw-color-feedback-info-text",
      "type": "color",
      "ref": "color.iris.200"
    },
    "color.feedback.info.icon": {
      "value": "#b2beff",
      "cssVar": "--lw-color-feedback-info-icon",
      "type": "color",
      "ref": "color.iris.300"
    },
    "color.feedback.success.bg": {
      "value": "#083329",
      "cssVar": "--lw-color-feedback-success-bg",
      "type": "color",
      "ref": "color.tint.success"
    },
    "color.feedback.success.border": {
      "value": "#035b48",
      "cssVar": "--lw-color-feedback-success-border",
      "type": "color",
      "ref": "color.tint.success-border"
    },
    "color.feedback.success.text": {
      "value": "#c0e6d9",
      "cssVar": "--lw-color-feedback-success-text",
      "type": "color",
      "ref": "color.teal.200"
    },
    "color.feedback.success.icon": {
      "value": "#93cdba",
      "cssVar": "--lw-color-feedback-success-icon",
      "type": "color",
      "ref": "color.teal.300"
    },
    "color.feedback.warning.bg": {
      "value": "#3a270b",
      "cssVar": "--lw-color-feedback-warning-bg",
      "type": "color",
      "ref": "color.tint.warning"
    },
    "color.feedback.warning.border": {
      "value": "#674611",
      "cssVar": "--lw-color-feedback-warning-border",
      "type": "color",
      "ref": "color.tint.warning-border"
    },
    "color.feedback.warning.text": {
      "value": "#ffd6bd",
      "cssVar": "--lw-color-feedback-warning-text",
      "type": "color",
      "ref": "color.warning.200"
    },
    "color.feedback.warning.icon": {
      "value": "#f9b18a",
      "cssVar": "--lw-color-feedback-warning-icon",
      "type": "color",
      "ref": "color.warning.300"
    },
    "color.feedback.danger.bg": {
      "value": "#412121",
      "cssVar": "--lw-color-feedback-danger-bg",
      "type": "color",
      "ref": "color.tint.danger"
    },
    "color.feedback.danger.border": {
      "value": "#723a3b",
      "cssVar": "--lw-color-feedback-danger-border",
      "type": "color",
      "ref": "color.tint.danger-border"
    },
    "color.feedback.danger.text": {
      "value": "#ffd4d2",
      "cssVar": "--lw-color-feedback-danger-text",
      "type": "color",
      "ref": "color.danger.200"
    },
    "color.feedback.danger.icon": {
      "value": "#ffacab",
      "cssVar": "--lw-color-feedback-danger-icon",
      "type": "color",
      "ref": "color.danger.300"
    },
    "color.amount.incoming": {
      "value": "#93cdba",
      "cssVar": "--lw-color-amount-incoming",
      "type": "color",
      "description": "Money in. Always with a plus sign.",
      "ref": "color.teal.300"
    },
    "color.amount.outgoing": {
      "value": "#f6f6fb",
      "cssVar": "--lw-color-amount-outgoing",
      "type": "color",
      "description": "Money out. Never red. Always with a minus sign.",
      "ref": "color.ink.50"
    },
    "color.amount.pending": {
      "value": "#f9b18a",
      "cssVar": "--lw-color-amount-pending",
      "type": "color",
      "description": "Not settled yet. Always with a pending label.",
      "ref": "color.warning.300"
    },
    "color.accent.decorative": {
      "value": "#ff7a59",
      "cssVar": "--lw-color-accent-decorative",
      "type": "color",
      "description": "Illustration and highlights only. Never text or the only signal of state.",
      "ref": "color.coral.400"
    },
    "color.accent.decorative-subtle": {
      "value": "#3e0000",
      "cssVar": "--lw-color-accent-decorative-subtle",
      "type": "color",
      "ref": "color.coral.950"
    },
    "color.skeleton.base": {
      "value": "#282a3b",
      "cssVar": "--lw-color-skeleton-base",
      "type": "color",
      "ref": "color.deep.800"
    },
    "color.skeleton.highlight": {
      "value": "#3c3e52",
      "cssVar": "--lw-color-skeleton-highlight",
      "type": "color",
      "ref": "color.deep.700"
    },
    "radius.none": {
      "value": "0",
      "cssVar": "--lw-radius-none",
      "type": "dimension",
      "ref": "radius.0"
    },
    "radius.sm": {
      "value": "4px",
      "cssVar": "--lw-radius-sm",
      "type": "dimension",
      "ref": "radius.4"
    },
    "radius.md": {
      "value": "8px",
      "cssVar": "--lw-radius-md",
      "type": "dimension",
      "ref": "radius.8"
    },
    "radius.lg": {
      "value": "12px",
      "cssVar": "--lw-radius-lg",
      "type": "dimension",
      "ref": "radius.12"
    },
    "radius.xl": {
      "value": "16px",
      "cssVar": "--lw-radius-xl",
      "type": "dimension",
      "ref": "radius.16"
    },
    "radius.control": {
      "value": "8px",
      "cssVar": "--lw-radius-control",
      "type": "dimension",
      "description": "Buttons, inputs, selects",
      "ref": "radius.8"
    },
    "radius.card": {
      "value": "16px",
      "cssVar": "--lw-radius-card",
      "type": "dimension",
      "description": "Cards and dialogs",
      "ref": "radius.16"
    },
    "radius.pill": {
      "value": "9999px",
      "cssVar": "--lw-radius-pill",
      "type": "dimension",
      "ref": "radius.full"
    },
    "size.touch-target": {
      "value": "2.75rem",
      "cssVar": "--lw-size-touch-target",
      "type": "dimension",
      "description": "Minimum hit area for any interactive element",
      "ref": "size.44"
    },
    "size.control.sm": {
      "value": "2.25rem",
      "cssVar": "--lw-size-control-sm",
      "type": "dimension",
      "ref": "size.36"
    },
    "size.control.md": {
      "value": "2.75rem",
      "cssVar": "--lw-size-control-md",
      "type": "dimension",
      "ref": "size.44"
    },
    "size.control.lg": {
      "value": "3.25rem",
      "cssVar": "--lw-size-control-lg",
      "type": "dimension",
      "ref": "size.52"
    },
    "size.icon.sm": {
      "value": "1rem",
      "cssVar": "--lw-size-icon-sm",
      "type": "dimension",
      "ref": "size.16"
    },
    "size.icon.md": {
      "value": "1.25rem",
      "cssVar": "--lw-size-icon-md",
      "type": "dimension",
      "ref": "size.20"
    },
    "size.icon.lg": {
      "value": "1.5rem",
      "cssVar": "--lw-size-icon-lg",
      "type": "dimension",
      "ref": "size.24"
    },
    "size.avatar.sm": {
      "value": "2rem",
      "cssVar": "--lw-size-avatar-sm",
      "type": "dimension",
      "ref": "size.32"
    },
    "size.avatar.md": {
      "value": "2.5rem",
      "cssVar": "--lw-size-avatar-md",
      "type": "dimension",
      "ref": "size.40"
    },
    "size.avatar.lg": {
      "value": "3.5rem",
      "cssVar": "--lw-size-avatar-lg",
      "type": "dimension",
      "ref": "size.56"
    },
    "size.focus-ring.width": {
      "value": "0.125rem",
      "cssVar": "--lw-size-focus-ring-width",
      "type": "dimension",
      "ref": "size.2"
    },
    "size.focus-ring.offset": {
      "value": "0.125rem",
      "cssVar": "--lw-size-focus-ring-offset",
      "type": "dimension",
      "ref": "size.2"
    },
    "size.border.default": {
      "value": "0.0625rem",
      "cssVar": "--lw-size-border-default",
      "type": "dimension",
      "ref": "size.1"
    },
    "size.border.strong": {
      "value": "0.125rem",
      "cssVar": "--lw-size-border-strong",
      "type": "dimension",
      "ref": "size.2"
    },
    "size.dialog": {
      "value": "30rem",
      "cssVar": "--lw-size-dialog",
      "type": "dimension"
    },
    "size.tooltip-max": {
      "value": "17.5rem",
      "cssVar": "--lw-size-tooltip-max",
      "type": "dimension"
    },
    "space.none": {
      "value": "0",
      "cssVar": "--lw-space-none",
      "type": "dimension",
      "ref": "space.0"
    },
    "space.3xs": {
      "value": "0.125rem",
      "cssVar": "--lw-space-3xs",
      "type": "dimension",
      "ref": "space.0_5"
    },
    "space.2xs": {
      "value": "0.25rem",
      "cssVar": "--lw-space-2xs",
      "type": "dimension",
      "ref": "space.1"
    },
    "space.xs": {
      "value": "0.5rem",
      "cssVar": "--lw-space-xs",
      "type": "dimension",
      "ref": "space.2"
    },
    "space.sm": {
      "value": "0.75rem",
      "cssVar": "--lw-space-sm",
      "type": "dimension",
      "ref": "space.3"
    },
    "space.md": {
      "value": "1rem",
      "cssVar": "--lw-space-md",
      "type": "dimension",
      "ref": "space.4"
    },
    "space.lg": {
      "value": "1.5rem",
      "cssVar": "--lw-space-lg",
      "type": "dimension",
      "ref": "space.6"
    },
    "space.xl": {
      "value": "2rem",
      "cssVar": "--lw-space-xl",
      "type": "dimension",
      "ref": "space.8"
    },
    "space.2xl": {
      "value": "3rem",
      "cssVar": "--lw-space-2xl",
      "type": "dimension",
      "ref": "space.12"
    },
    "space.3xl": {
      "value": "4rem",
      "cssVar": "--lw-space-3xl",
      "type": "dimension",
      "ref": "space.16"
    },
    "layer.base": {
      "value": 0,
      "cssVar": "--lw-layer-base",
      "type": "number"
    },
    "layer.raised": {
      "value": 10,
      "cssVar": "--lw-layer-raised",
      "type": "number"
    },
    "layer.sticky": {
      "value": 100,
      "cssVar": "--lw-layer-sticky",
      "type": "number"
    },
    "layer.overlay": {
      "value": 1000,
      "cssVar": "--lw-layer-overlay",
      "type": "number"
    },
    "layer.toast": {
      "value": 1100,
      "cssVar": "--lw-layer-toast",
      "type": "number"
    },
    "layer.tooltip": {
      "value": 1200,
      "cssVar": "--lw-layer-tooltip",
      "type": "number"
    },
    "motion.duration.instant": {
      "value": "100ms",
      "cssVar": "--lw-motion-duration-instant",
      "type": "duration",
      "ref": "duration.100"
    },
    "motion.duration.fast": {
      "value": "150ms",
      "cssVar": "--lw-motion-duration-fast",
      "type": "duration",
      "ref": "duration.150"
    },
    "motion.duration.base": {
      "value": "200ms",
      "cssVar": "--lw-motion-duration-base",
      "type": "duration",
      "ref": "duration.200"
    },
    "motion.duration.slow": {
      "value": "300ms",
      "cssVar": "--lw-motion-duration-slow",
      "type": "duration",
      "ref": "duration.300"
    },
    "motion.easing.standard": {
      "value": "cubic-bezier(0.2, 0, 0, 1)",
      "cssVar": "--lw-motion-easing-standard",
      "type": "cubicBezier",
      "ref": "easing.standard"
    },
    "motion.easing.enter": {
      "value": "cubic-bezier(0, 0, 0, 1)",
      "cssVar": "--lw-motion-easing-enter",
      "type": "cubicBezier",
      "ref": "easing.decelerate"
    },
    "motion.easing.exit": {
      "value": "cubic-bezier(0.3, 0, 1, 1)",
      "cssVar": "--lw-motion-easing-exit",
      "type": "cubicBezier",
      "ref": "easing.accelerate"
    },
    "type.display.lg.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-display-lg-family",
      "ref": "font.family.inter"
    },
    "type.display.lg.size": {
      "value": "3rem",
      "cssVar": "--lw-type-display-lg-size",
      "ref": "font.size.48"
    },
    "type.display.lg.line-height": {
      "value": "3.5rem",
      "cssVar": "--lw-type-display-lg-line-height",
      "ref": "font.line-height.56"
    },
    "type.display.lg.weight": {
      "value": 700,
      "cssVar": "--lw-type-display-lg-weight",
      "ref": "font.weight.bold"
    },
    "type.display.lg.tracking": {
      "value": "-0.02em",
      "cssVar": "--lw-type-display-lg-tracking",
      "ref": "font.tracking.tight"
    },
    "type.display.md.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-display-md-family",
      "ref": "font.family.inter"
    },
    "type.display.md.size": {
      "value": "2.5rem",
      "cssVar": "--lw-type-display-md-size",
      "ref": "font.size.40"
    },
    "type.display.md.line-height": {
      "value": "3rem",
      "cssVar": "--lw-type-display-md-line-height",
      "ref": "font.line-height.48"
    },
    "type.display.md.weight": {
      "value": 700,
      "cssVar": "--lw-type-display-md-weight",
      "ref": "font.weight.bold"
    },
    "type.display.md.tracking": {
      "value": "-0.02em",
      "cssVar": "--lw-type-display-md-tracking",
      "ref": "font.tracking.tight"
    },
    "type.heading.xl.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-heading-xl-family",
      "ref": "font.family.inter"
    },
    "type.heading.xl.size": {
      "value": "2rem",
      "cssVar": "--lw-type-heading-xl-size",
      "ref": "font.size.32"
    },
    "type.heading.xl.line-height": {
      "value": "2.5rem",
      "cssVar": "--lw-type-heading-xl-line-height",
      "ref": "font.line-height.40"
    },
    "type.heading.xl.weight": {
      "value": 600,
      "cssVar": "--lw-type-heading-xl-weight",
      "ref": "font.weight.semibold"
    },
    "type.heading.xl.tracking": {
      "value": "-0.02em",
      "cssVar": "--lw-type-heading-xl-tracking",
      "ref": "font.tracking.tight"
    },
    "type.heading.lg.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-heading-lg-family",
      "ref": "font.family.inter"
    },
    "type.heading.lg.size": {
      "value": "1.75rem",
      "cssVar": "--lw-type-heading-lg-size",
      "ref": "font.size.28"
    },
    "type.heading.lg.line-height": {
      "value": "2.25rem",
      "cssVar": "--lw-type-heading-lg-line-height",
      "ref": "font.line-height.36"
    },
    "type.heading.lg.weight": {
      "value": 600,
      "cssVar": "--lw-type-heading-lg-weight",
      "ref": "font.weight.semibold"
    },
    "type.heading.lg.tracking": {
      "value": "-0.02em",
      "cssVar": "--lw-type-heading-lg-tracking",
      "ref": "font.tracking.tight"
    },
    "type.heading.md.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-heading-md-family",
      "ref": "font.family.inter"
    },
    "type.heading.md.size": {
      "value": "1.5rem",
      "cssVar": "--lw-type-heading-md-size",
      "ref": "font.size.24"
    },
    "type.heading.md.line-height": {
      "value": "2rem",
      "cssVar": "--lw-type-heading-md-line-height",
      "ref": "font.line-height.32"
    },
    "type.heading.md.weight": {
      "value": 600,
      "cssVar": "--lw-type-heading-md-weight",
      "ref": "font.weight.semibold"
    },
    "type.heading.md.tracking": {
      "value": "-0.01em",
      "cssVar": "--lw-type-heading-md-tracking",
      "ref": "font.tracking.snug"
    },
    "type.heading.sm.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-heading-sm-family",
      "ref": "font.family.inter"
    },
    "type.heading.sm.size": {
      "value": "1.25rem",
      "cssVar": "--lw-type-heading-sm-size",
      "ref": "font.size.20"
    },
    "type.heading.sm.line-height": {
      "value": "1.75rem",
      "cssVar": "--lw-type-heading-sm-line-height",
      "ref": "font.line-height.28"
    },
    "type.heading.sm.weight": {
      "value": 600,
      "cssVar": "--lw-type-heading-sm-weight",
      "ref": "font.weight.semibold"
    },
    "type.heading.sm.tracking": {
      "value": "-0.01em",
      "cssVar": "--lw-type-heading-sm-tracking",
      "ref": "font.tracking.snug"
    },
    "type.heading.xs.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-heading-xs-family",
      "ref": "font.family.inter"
    },
    "type.heading.xs.size": {
      "value": "1rem",
      "cssVar": "--lw-type-heading-xs-size",
      "ref": "font.size.16"
    },
    "type.heading.xs.line-height": {
      "value": "1.5rem",
      "cssVar": "--lw-type-heading-xs-line-height",
      "ref": "font.line-height.24"
    },
    "type.heading.xs.weight": {
      "value": 600,
      "cssVar": "--lw-type-heading-xs-weight",
      "ref": "font.weight.semibold"
    },
    "type.heading.xs.tracking": {
      "value": "0em",
      "cssVar": "--lw-type-heading-xs-tracking",
      "ref": "font.tracking.normal"
    },
    "type.body.md.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-body-md-family",
      "ref": "font.family.inter"
    },
    "type.body.md.size": {
      "value": "1rem",
      "cssVar": "--lw-type-body-md-size",
      "ref": "font.size.16"
    },
    "type.body.md.line-height": {
      "value": "1.5rem",
      "cssVar": "--lw-type-body-md-line-height",
      "ref": "font.line-height.24"
    },
    "type.body.md.weight": {
      "value": 400,
      "cssVar": "--lw-type-body-md-weight",
      "ref": "font.weight.regular"
    },
    "type.body.md.tracking": {
      "value": "0em",
      "cssVar": "--lw-type-body-md-tracking",
      "ref": "font.tracking.normal"
    },
    "type.body.sm.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-body-sm-family",
      "ref": "font.family.inter"
    },
    "type.body.sm.size": {
      "value": "0.875rem",
      "cssVar": "--lw-type-body-sm-size",
      "ref": "font.size.14"
    },
    "type.body.sm.line-height": {
      "value": "1.25rem",
      "cssVar": "--lw-type-body-sm-line-height",
      "ref": "font.line-height.20"
    },
    "type.body.sm.weight": {
      "value": 400,
      "cssVar": "--lw-type-body-sm-weight",
      "ref": "font.weight.regular"
    },
    "type.body.sm.tracking": {
      "value": "0em",
      "cssVar": "--lw-type-body-sm-tracking",
      "ref": "font.tracking.normal"
    },
    "type.label.md.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-label-md-family",
      "ref": "font.family.inter"
    },
    "type.label.md.size": {
      "value": "1rem",
      "cssVar": "--lw-type-label-md-size",
      "ref": "font.size.16"
    },
    "type.label.md.line-height": {
      "value": "1.5rem",
      "cssVar": "--lw-type-label-md-line-height",
      "ref": "font.line-height.24"
    },
    "type.label.md.weight": {
      "value": 500,
      "cssVar": "--lw-type-label-md-weight",
      "ref": "font.weight.medium"
    },
    "type.label.md.tracking": {
      "value": "0em",
      "cssVar": "--lw-type-label-md-tracking",
      "ref": "font.tracking.normal"
    },
    "type.label.sm.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-label-sm-family",
      "ref": "font.family.inter"
    },
    "type.label.sm.size": {
      "value": "0.875rem",
      "cssVar": "--lw-type-label-sm-size",
      "ref": "font.size.14"
    },
    "type.label.sm.line-height": {
      "value": "1.25rem",
      "cssVar": "--lw-type-label-sm-line-height",
      "ref": "font.line-height.20"
    },
    "type.label.sm.weight": {
      "value": 500,
      "cssVar": "--lw-type-label-sm-weight",
      "ref": "font.weight.medium"
    },
    "type.label.sm.tracking": {
      "value": "0em",
      "cssVar": "--lw-type-label-sm-tracking",
      "ref": "font.tracking.normal"
    },
    "type.caption.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-caption-family",
      "ref": "font.family.inter"
    },
    "type.caption.size": {
      "value": "0.75rem",
      "cssVar": "--lw-type-caption-size",
      "ref": "font.size.12"
    },
    "type.caption.line-height": {
      "value": "1rem",
      "cssVar": "--lw-type-caption-line-height",
      "ref": "font.line-height.16"
    },
    "type.caption.weight": {
      "value": 400,
      "cssVar": "--lw-type-caption-weight",
      "ref": "font.weight.regular"
    },
    "type.caption.tracking": {
      "value": "0.02em",
      "cssVar": "--lw-type-caption-tracking",
      "ref": "font.tracking.wide"
    },
    "type.amount.lg.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-amount-lg-family",
      "ref": "font.family.inter"
    },
    "type.amount.lg.size": {
      "value": "2.5rem",
      "cssVar": "--lw-type-amount-lg-size",
      "ref": "font.size.40"
    },
    "type.amount.lg.line-height": {
      "value": "3rem",
      "cssVar": "--lw-type-amount-lg-line-height",
      "ref": "font.line-height.48"
    },
    "type.amount.lg.weight": {
      "value": 600,
      "cssVar": "--lw-type-amount-lg-weight",
      "ref": "font.weight.semibold"
    },
    "type.amount.lg.tracking": {
      "value": "-0.02em",
      "cssVar": "--lw-type-amount-lg-tracking",
      "ref": "font.tracking.tight"
    },
    "type.amount.md.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-amount-md-family",
      "ref": "font.family.inter"
    },
    "type.amount.md.size": {
      "value": "1.25rem",
      "cssVar": "--lw-type-amount-md-size",
      "ref": "font.size.20"
    },
    "type.amount.md.line-height": {
      "value": "1.75rem",
      "cssVar": "--lw-type-amount-md-line-height",
      "ref": "font.line-height.28"
    },
    "type.amount.md.weight": {
      "value": 600,
      "cssVar": "--lw-type-amount-md-weight",
      "ref": "font.weight.semibold"
    },
    "type.amount.md.tracking": {
      "value": "0em",
      "cssVar": "--lw-type-amount-md-tracking",
      "ref": "font.tracking.normal"
    },
    "type.amount.sm.family": {
      "value": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "cssVar": "--lw-type-amount-sm-family",
      "ref": "font.family.inter"
    },
    "type.amount.sm.size": {
      "value": "1rem",
      "cssVar": "--lw-type-amount-sm-size",
      "ref": "font.size.16"
    },
    "type.amount.sm.line-height": {
      "value": "1.5rem",
      "cssVar": "--lw-type-amount-sm-line-height",
      "ref": "font.line-height.24"
    },
    "type.amount.sm.weight": {
      "value": 500,
      "cssVar": "--lw-type-amount-sm-weight",
      "ref": "font.weight.medium"
    },
    "type.amount.sm.tracking": {
      "value": "0em",
      "cssVar": "--lw-type-amount-sm-tracking",
      "ref": "font.tracking.normal"
    },
    "shadow.1": {
      "value": "0px 1px 2px 0px #00000052, 0px 1px 3px 0px #00000033",
      "cssVar": "--lw-shadow-1",
      "type": "shadow"
    },
    "shadow.2": {
      "value": "0px 4px 12px -2px #0000005c, 0px 2px 4px -1px #00000033",
      "cssVar": "--lw-shadow-2",
      "type": "shadow"
    },
    "shadow.3": {
      "value": "0px 16px 32px -8px #0000007a, 0px 4px 8px -2px #00000040",
      "cssVar": "--lw-shadow-3",
      "type": "shadow"
    }
  }
} as never;
/** CSS custom property reference for a token, for example cssVar("color.text.primary"). */
export function cssVar(name: TokenName): string {
  return `var(${tokens.light[name].cssVar})`;
}
