# tasksgo-ui

React design system published as an npm package. Built with TypeScript, CSS Modules, Storybook, and Vitest.
https://alepaez-dev.github.io/TasksGO-UI/

## Monorepo structure
     
```
tasksgo-ui/
├── packages/
│   └── ds/               # the design system library (will b published to npm)
└── apps/
    └── playground/       # Vite + React app to test the DS locally as a client
```

## Prerequisites

- Node.js >= 18
- npm >= 9 (workspaces support)

## Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd tasksgo-ui

# 2. Install all dependencies (root + all workspaces)
# This also sets up git hooks automatically via the `prepare` script
npm install
```

## Commands

Run from the **repo root** — npm workspaces route them to the right package.

| Command | What it does |
|---|---|
| `npm run storybook` | Start Storybook dev server for the DS |
| `npm run dev` | Start the playground Vite app |
| `npm run build` | Build the DS library to `packages/ds/dist/` |
| `npm test` | Run Vitest in watch mode |
| `npm run test:ci` | Run Vitest once (used in CI) |
| `npm run lint` | ESLint + Prettier check |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run changeset` | Create a changeset for a new release |

## Commit conventions

This repo enforces **Conventional Commits** via commitlint on every `git commit`.

```
<type>(<scope>): <description>
```

Allowed types: `feat` `fix` `chore` `docs` `refactor` `test` `style` `perf` `ci` `build` `revert`

```bash
# valid examples
feat(button): add loading state
fix(tokens): correct spacing scale step 4
chore: update vitest to v2
docs: add setup instructions to readme
```

The commit is rejected immediately if the message does not match the pattern. Fix the message and retry — do not use `--no-verify`.

## Local quality gates (Husky)

Two hooks run automatically on every commit — before CI ever sees the code.

**`pre-commit`** — lint-staged
Runs ESLint (auto-fix) and Prettier on staged `*.ts`, `*.tsx`, `*.css`, `*.json`, `*.md` files. Only touches staged files, so it is fast. A failure aborts the commit; fix the errors, re-stage, and commit again.

**`commit-msg`** — commitlint
Validates the commit message format (see Conventional Commits above).

## Design rules

### Stateless components

Every component in `packages/ds/src/components/` must be **stateless**.

- No `useState`, no `useReducer`, no mutable `useRef` values inside component files.
- `useRef` is only allowed for DOM element refs (e.g. `useRef<HTMLButtonElement>(null)`).
- State belongs in the consuming application, a context provider, or a dedicated store.
- Stateful helpers (e.g. `useDisclosure`) go in `packages/ds/src/hooks/`, not in a component file.

The ESLint config enforces this automatically (`no-component-state` rule).

### Composition over inheritance

- Build new components by composing smaller ones (e.g. `IconButton = Button + icon slot`).
- Inheritance is allowed only up to **1 level** (a typed base props interface). Beyond that, refactor to composition.

### Single owner for state

- Every piece of meaningful UI state has exactly one owner.
- Children receive state as props and emit changes via callbacks — they never mutate shared state directly.
- If multiple components need the same state, lift it to their nearest common ancestor.

### TypeScript strictness

- `strict: true` — no exceptions, no `any`, no `!` non-null assertions.
- Use `type` for unions/intersections, `interface` for extendable object shapes.
- Use `as const` for token maps so values narrow to literals.
- Use discriminated unions instead of loose `string` types.

### Design tokens

Tokens in `packages/ds/src/tokens/` are the single source of truth for colors, spacing, and typography. Components consume them via CSS custom properties (`--ds-<category>-<scale>`), never raw values.

### Accessibility

All components must pass `axe` checks. Use semantic HTML; reach for ARIA only when native semantics are insufficient.

## Adding a new component

1. Create `packages/ds/src/components/<Name>/` with:
   - `<Name>.tsx`
   - `<Name>.module.css`
   - `<Name>.stories.tsx`
   - `<Name>.test.tsx`
   - `index.ts`
2. Export from `packages/ds/src/index.ts`.
3. Write tests using RTL queries (`getByRole`, `getByText`) — test behaviour, not implementation.
4. Stage files and commit — Husky lints automatically.
5. Create a changeset: `npm run changeset`.

## Releases

This project uses **Changesets** for versioning.

1. After every PR that changes the public API or fixes a bug, run `npm run changeset` and commit the generated file.
2. On merge to `main`, the `release.yml` CI workflow bumps versions, updates `CHANGELOG.md`, publishes to npm, and creates a GitHub Release.

Version bump guide: `patch` for bug fixes · `minor` for new features · `major` for breaking changes.
# TasksGO-UI
