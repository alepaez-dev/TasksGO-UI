# Design system requirements

Requirements the reviewer cannot infer from code. A diff that violates one is a finding.

- **Unmount what should not be visible.** Overlays, dropdowns, menus, tooltips and conditional
  regions are removed from the DOM when closed — not hidden with CSS. A surface left mounted or
  left open when it should have closed is a bug, including when the region it belongs to collapses
  or unmounts. A control that is meant to work in both states — one scoped to a header that stays
  put, not to the region being collapsed — is not covered by this.
- **One owner per piece of state.** Children receive state as props and emit changes via callbacks;
  they never mutate shared state. When one component drives two related pieces of visible state,
  changing one must reconcile the other.
- **Interactive elements are keyboard-accessible** and meet WCAG 2.1 AA.
- **Utilities in `src/utils/` are pure** — no side effects, no external state.
