# UI Package Design

**Date:** 2026-06-02
**Status:** Approved

## Summary

Add `packages/ui` — a shared React component library built on shadcn/ui (Radix UI + Tailwind CSS 4). Components are scaffolded via the shadcn CLI, committed to the repo, and exported as compiled JS for consumption by `apps/web` and any future frontend apps.

---

## Package Structure

```
packages/ui/
  src/
    components/
      button.tsx
      input.tsx
      label.tsx
      textarea.tsx
      select.tsx
      checkbox.tsx
      card.tsx
      badge.tsx
      alert.tsx
      separator.tsx
      skeleton.tsx
      dialog.tsx
      sheet.tsx
      tooltip.tsx
      popover.tsx
      sonner.tsx
      tabs.tsx
      breadcrumb.tsx
      dropdown-menu.tsx
    lib/
      utils.ts          ← cn() = clsx + tailwind-merge
    index.ts            ← re-exports all components + cn
  components.json       ← shadcn CLI config
  package.json
  tsconfig.json
  tsdown.config.ts
  biome.json
```

**Package name:** `@monorepo-template/ui`

**Exports in `package.json`:**

| Export path | Source | Use |
|---|---|---|
| `"."` | `src/index.ts` | All components (client-side bundle) |

---

## Components

| Category | Components |
|---|---|
| Core inputs | Button, Input, Label, Textarea, Select, Checkbox |
| Layout/feedback | Card, Badge, Alert, Separator, Skeleton |
| Overlays | Dialog, Sheet, Tooltip, Popover, Sonner (toast) |
| Navigation | Tabs, Breadcrumb, DropdownMenu |

Scaffolded via:
```bash
pnpm dlx shadcn@latest add button input label textarea select checkbox \
  card badge alert separator skeleton \
  dialog sheet tooltip popover sonner \
  tabs breadcrumb dropdown-menu
```

---

## `cn()` Utility

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Build

`tsdown.config.ts` — JSX transform via tsdown's built-in React JSX support:

```ts
export default defineConfig({
  entry: { index: './src/index.ts' },
  format: ['esm'],
  dts: { sourcemap: true },
  sourcemap: true,
  clean: true,
  jsx: 'react-jsx',
})
```

---

## `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "css": "../../apps/web/src/styles.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@monorepo-template/ui/src/components",
    "utils": "@monorepo-template/ui/src/lib/utils",
    "ui": "@monorepo-template/ui/src/components",
    "lib": "@monorepo-template/ui/src/lib"
  }
}
```

---

## `apps/web` Integration

**`apps/web/package.json`** — add dep:
```json
"@monorepo-template/ui": "workspace:*"
```

**`apps/web/src/styles.css`** — add source scan so Tailwind detects classes from the package:
```css
@source "../../packages/ui/src";
```

CSS variables (color tokens, border radius, etc.) are defined in `apps/web/src/styles.css` (already exists). The UI components reference these variables via Tailwind utilities (`bg-primary`, `text-foreground`, etc.).

---

## Dependencies

### Runtime
```
@radix-ui/react-dialog
@radix-ui/react-dropdown-menu
@radix-ui/react-label
@radix-ui/react-popover
@radix-ui/react-select
@radix-ui/react-separator
@radix-ui/react-slot
@radix-ui/react-tabs
@radix-ui/react-toast
@radix-ui/react-tooltip
@radix-ui/react-checkbox
class-variance-authority
clsx
lucide-react
sonner
tailwind-merge
```

### Peer
```
react: >=19.0.0
react-dom: >=19.0.0
```

### Dev
```
@types/react
@types/react-dom
tailwindcss
```

---

## Testing

- Unit test: each component renders without throwing (smoke test via vitest + happy-dom).
- No visual regression tests in scope — Playwright/Storybook is a future concern.

---

## Out of Scope

- Storybook — separate session.
- Dark mode toggle component — app concern, not package.
- Theming beyond CSS variables — apps override `styles.css` variables.
- Community shadcn components beyond the listed set — add via `shadcn add` post-scaffold.
