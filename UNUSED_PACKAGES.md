# Unused & Redundant Packages Analysis

> **Goal:** Reduce build size (currently ~650 MB) by removing packages that are not imported anywhere in the source code.
> **Scanned:** 527 TypeScript/TSX source files under `src/`

---

## Packages Safe to Remove

These packages appear in `package.json` but are **never imported** in any source file.

| Package | Type | Estimated Size | Reason to Remove |
|---------|------|---------------|-----------------|
| `html-to-png` | dependency | ~small | Zero imports. `html-to-image` is used instead |
| `html2canvas` | dependency | ~1.7 MB | Zero imports. `html-to-image` is used and preferred (handles modern CSS like `oklch` colors) |
| `i18next` | dependency | ~900 KB | Zero imports. Project uses `next-intl` exclusively |
| `next-i18next` | dependency | ~large | Zero imports. Project uses `next-intl` exclusively |
| `react-i18next` | dependency | ~large | Zero imports. Project uses `next-intl` exclusively |
| `credit-card-type` | dependency | ~small | Zero imports anywhere in codebase |
| `js-cookie` | dependency | ~small | Only mentioned in a TODO comment, never imported |
| `@types/axios` | devDependency | — | **Deprecated.** `axios` v1+ ships its own TypeScript types. This package is no longer maintained |

**Commands to remove all at once:**

```bash
npm uninstall html-to-png html2canvas i18next next-i18next react-i18next credit-card-type js-cookie
npm uninstall --save-dev @types/axios
```

---

## Redundant / Consolidation Candidates

These packages are technically used but overlap with others — consolidating them reduces bundle size.

### 1. `lodash` — Used only for `debounce`
- **Used in:** `src/components/modules/discovery/components/GlobalSearch.tsx`
- **Problem:** `lodash` is ~70 KB (minified+gzip) but only `debounce` is used.
- **Fix:** Replace with native debounce or import only `lodash/debounce`:
  ```ts
  // Instead of:
  import { debounce } from 'lodash'

  // Option A — tree-shakeable subpath import:
  import debounce from 'lodash/debounce'

  // Option B — remove lodash entirely, use a small utility:
  function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
    let timer: ReturnType<typeof setTimeout>
    return (...args: Parameters<T>) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay) }
  }
  ```

### 2. `react-icons` vs `lucide-react` — Two icon libraries
- **`lucide-react`** — Used in 205+ files (primary icon system)
- **`react-icons`** — Used in 6 files (`src/components/modules/auth/components/SocialAuthButtons.tsx` etc.)
- **Problem:** Both libraries are bundled. `react-icons` alone can add 10–20 MB to the install footprint.
- **Fix:** Migrate the 6 `react-icons` usages to equivalent `lucide-react` icons, then remove `react-icons`.

### 3. `radix-ui` (root package) alongside individual `@radix-ui/react-*` packages
- **Problem:** The root `radix-ui` package is a meta-package that re-exports everything. All 16 individual `@radix-ui/react-*` packages are already installed and imported directly, so `radix-ui` is redundant.
- **Fix:** Verify nothing imports from `'radix-ui'` directly (the agent found 22 matches — confirm these are actually `@radix-ui/react-*` sub-imports), then remove:
  ```bash
  npm uninstall radix-ui
  ```

---

## i18n Library Audit (3 packages, only 1 needed)

The project has **4 i18n packages** installed but only **1 is used**:

| Package | Status | Imports Found |
|---------|--------|--------------|
| `next-intl` | **ACTIVE** | 154+ files |
| `i18next` | UNUSED | 0 |
| `next-i18next` | UNUSED | 0 |
| `react-i18next` | UNUSED | 0 |

Remove `i18next`, `next-i18next`, and `react-i18next` — they add ~2–3 MB to node_modules and contribute to bundle analysis noise.

---

## HTML-to-PDF Library Audit (3 packages, only 1 needed)

| Package | Status | Note |
|---------|--------|------|
| `html-to-image` | **ACTIVE** | Used in `src/lib/utils/pdfs/pdf-export.ts` with `toPng()` |
| `html2canvas` | UNUSED | Referenced only in a comment explaining why it was replaced |
| `html-to-png` | UNUSED | Never imported |

Remove `html2canvas` and `html-to-png`.

---

## Summary

| Category | Packages to Remove | Action |
|----------|-------------------|--------|
| Truly unused | `html-to-png`, `html2canvas`, `i18next`, `next-i18next`, `react-i18next`, `credit-card-type`, `js-cookie` | `npm uninstall` |
| Deprecated devDep | `@types/axios` | `npm uninstall --save-dev` |
| Redundant (consolidate) | `react-icons` (replace 6 usages with lucide-react) | Migrate then uninstall |
| Possibly redundant | `radix-ui` (root meta-package) | Verify then uninstall |
| Optimizable | `lodash` (only `debounce` used) | Switch to subpath import or inline utility |

### One-liner cleanup (safe removals only)

```bash
npm uninstall html-to-png html2canvas i18next next-i18next react-i18next credit-card-type js-cookie && npm uninstall --save-dev @types/axios
```

---

## Other Build Size Tips

1. **Enable Next.js bundle analyzer** to visualize what's largest:
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```
   Then wrap `next.config.ts` with `withBundleAnalyzer` and run `ANALYZE=true npm run build`.

2. **`jspdf` + `jspdf-autotable`** (~800 KB combined) — consider dynamic import since PDF generation is not on the critical path:
   ```ts
   const { jsPDF } = await import('jspdf')
   ```

3. **`framer-motion`** (~150 KB) — used in 5 files including `not-found.tsx`. Verify all usages are necessary; consider CSS animations for simple cases.

4. **`@react-google-maps/api`** — large SDK. Ensure it's only loaded on pages that need a map, not globally.
