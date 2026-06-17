# AI reviewer rules

## React conventions

- Components must remain **presentational and stateless**. Do not suggest introducing
  component-local state unless a real bug cannot be fixed otherwise.
- Business logic belongs in hooks, services, or context providers, not in UI components.
- Event handlers passed from parents are intentional. Do not suggest moving them into
  the component.
- Memoization (`useMemo`, `useCallback`, `React.memo`) is not required unless there is
  a demonstrated correctness issue (stale references, infinite loops, etc.).
- Controlled and uncontrolled form patterns are both allowed when implemented correctly.
  Do not suggest converting between them as a refactor.
- Early returns for loading, error, empty, and unauthorized states are intentional.
- Conditional rendering via `null` is preferred over hidden DOM elements.

## Design System conventions

- All visual styling must come from the design system. Flag usages of:
  - Hardcoded colors (`#fff`, `rgb(...)`, etc.)
  - Hardcoded spacing, typography, border radius, shadows, or z-index values
  - Custom CSS values when an equivalent design-system token exists
- Use design-system components whenever an equivalent component exists.
  Flag custom implementations that duplicate existing DS functionality.
- CSS variables prefixed with `--ds-` are the source of truth. Do not suggest replacing
  them with hardcoded values.
- Design-system wrappers may intentionally add abstraction around primitive components.
  Do not flag these abstractions as unnecessary.
- Responsive behavior is handled through design-system breakpoints and tokens.
  Do not suggest custom breakpoint values unless required to fix a bug.

## UI correctness bugs to flag

- Missing loading, error, or empty states when the component can render without data.
- User actions that can be triggered multiple times while a request is already pending.
- Forms that can submit duplicate requests due to missing disabled/loading states.
- State that is lost unexpectedly when navigating, rerendering, or reopening a modal.
- UI showing stale API data after a mutation succeeds.
- Components that render successfully but display incorrect information due to stale props,
  stale closures, or race conditions.
- Missing optimistic rollback when optimistic updates can leave the UI inconsistent.

## Design System accessibility bugs to flag

- Design-system components used without required accessibility props.
- Icon-only buttons missing an accessible name.
- Dialogs, drawers, popovers, and menus that do not restore focus correctly.
- Forms missing labels, descriptions, or error associations required by the design system.
- Flag any async action triggered from the UI that can be executed multiple times before completion unless duplicate execution is explicitly intended.

## Do NOT flag

- Usage of design-system abstractions, wrappers, or composition patterns.
- Lack of memoization unless it causes a correctness issue.
- CSS variable usage through design-system tokens.
- Conditional rendering that intentionally mounts/unmounts components.
- Component decomposition choices, file structure, or architectural preferences.

---

## Always flag (high priority)

- **Security:** `dangerouslySetInnerHTML` with non-constant input, `eval`/`new Function`,
  unsanitized URLs (`href`/`src` from user data), open redirects, prototype pollution,
  hardcoded secrets/tokens/API keys, ReDoS-prone regexes, insecure randomness used for
  anything security-sensitive, leaking sensitive data into the DOM, logs, or analytics.
- **Runtime crashes:** accessing properties on possibly-`undefined`/`null`, unsafe array
  indexing, `JSON.parse` without a guard, missing `await` on a promise whose result is used.
- **React state bugs:** stale closures, missing or wrong `useEffect` dependency arrays,
  missing cleanup for listeners/timers/subscriptions/`AbortController`, conditional hooks,
  duplicate or index-based `key` on dynamic lists, mutating props or state directly,
  derived state that can desync from its source.
- **Logic errors:** inverted conditionals, wrong comparison operator, off-by-one, using the
  wrong variable, broken early returns, switch fallthrough, unreachable branches.
- **Async/concurrency:** race conditions, fire-and-forget effects whose order matters,
  state updates after unmount, ignored cancellation.
- **Accessibility defects that break behavior** (not cosmetic): an interactive control that
  is keyboard-unreachable, a focus trap that never releases, a control with no accessible
  name. Treat these as bugs.

## Project conventions — do NOT flag these as bugs

These are intentional in this codebase (see `CLAUDE.md`):

- **Components are intentionally stateless.** Components under `src/components/` must not use
  `useState`/`useReducer`/mutable `useRef`. Do **not** suggest "add local state" — state lives
  in the consumer, a context, or a hook in `src/hooks/`. (Enforced by ESLint `no-component-state`.)
- **No file-level comments / docstrings.** The absence of a header comment is intentional.
- **No inline styles; styling is via CSS Modules + design tokens** (`--ds-*` CSS variables).
  Components consuming tokens via CSS variables instead of raw values is correct.
- **Overlays/conditional UI unmount when closed** (not hidden via CSS). That is the intended
  pattern, not a bug.
- **Named exports only** (no default exports from component files) — intentional.
- `tokens.css` / `typography.css` are **generated** — never reviewed (already ignored).
- Prettier/ESLint own formatting, import order, and style — never report those.

## Style / taste — never report

- Naming, formatting, import ordering, comment wording, "could be cleaner" refactors.
- Pre-existing issues in code the PR did not touch.
- Anything that is a preference rather than a defect.

## Severity guidance

- **critical** — security hole, data loss, or a guaranteed crash on a common path.
- **high** — a real bug that will misbehave for many users or in a common case.
- **medium** — a bug in an edge case, or a latent issue likely to bite later.
- **low** — minor correctness issue or a defect that only triggers in a rare path.
