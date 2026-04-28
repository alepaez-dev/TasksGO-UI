# @all3hp/tasksgo-ui

React design system for TasksGo.

## Fonts

Fonts are self-hosted via `@fontsource`. This package ships Inter and IBM Plex Mono in latin + latin-ext subsets, weights 400/500/600/700 (~250 kB of woff2 assets). If your app needs additional subsets or weights, override the `@font-face` declarations in your own CSS.

A single import gives you tokens, components, and fonts — no network calls, no second import:

```ts
import '@all3hp/tasksgo-ui/styles.css';
```
