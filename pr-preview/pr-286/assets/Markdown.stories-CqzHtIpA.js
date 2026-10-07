import{M as l}from"./Markdown-D2KgTB9J.js";import"./jsx-runtime-u17CrQMm.js";import"./iframe-BsOfj63y.js";import"./preload-helper-BXxMBR1D.js";import"./linkRenderRule-D8bc6Yhp.js";import"./sanitizeHref-Bnrf33AA.js";import"./cn-2dOUpm6k.js";import"./HighlightedText-DlzOHvAo.js";import"./Card-D9bqDQWz.js";const p=["# Edge caching RFC","","Intro with **bold**, *italic*, ~~strikethrough~~, `inline code`, and a [link](https://example.com).","","## Description","","We need a caching layer at the edge for read-heavy routes to cut latency and database load.","","### Goals","","- Lower TTFB in AP-South-1","- Reduce database CPU during sync windows","","1. Measure the baseline","2. Roll out behind a flag","","> Staged behind `edge_cache_v1` for 5% of traffic.","","```ts","const ttl = 60;","cache.set(key, value, ttl);","```","","| Environment | Status |","| --- | --- |","| QA1 | Pass |","| Prod | Idle |","","- [x] Cache hit ratio verified","- [ ] Invalidation latency under 200ms"].join(`
`),T={title:"Components/Markdown",component:l,tags:["autodocs"],argTypes:{source:{control:"text"},query:{control:"text"}},args:{source:p},parameters:{docs:{description:{component:"Renders a markdown string to styled React elements. Raw embedded HTML is disabled and link/image URLs are routed through `sanitizeHref`. All styling comes from design tokens — the library ships no CSS. GFM tables and task lists are supported. Pass `query` to mark matching terms in the body. Fenced code blocks are marked; scope blocks are not. Pass `mentions` with the handles you recognise to render `@handle` as a mention — handles not in the list stay plain text."}}}},e={},r={args:{source:["# Heading level 1","## Heading level 2","### Heading level 3","#### Heading level 4","##### Heading level 5","###### Heading level 6"].join(`

`)}},s={args:{source:"Paragraph with **bold**, *italic*, ~~strikethrough~~, `inline code`, and an [external link](https://example.com)."}},a={args:{source:["- Unordered one","- Unordered two","  - Nested item","","1. Ordered one","2. Ordered two"].join(`
`)}},t={args:{source:["```ts","function add(a: number, b: number) {","  return a + b;","}","```"].join(`
`)}},o={args:{source:["| Method | Path | Cached |","| --- | --- | --- |","| GET | /v1/assets | Yes |","| POST | /v1/assets | No |"].join(`
`)}},n={args:{source:["- [x] Verified cache hit ratio","- [ ] Invalidation latency under 200ms","- [ ] Browser TTL persistence"].join(`
`)}},i={args:{source:["```scope","included:","- GET /v1/assets/*","- GET /v1/metadata/*","- Cache invalidation via SNS","excluded:","- WebSocket streams","- POST/PUT operations","```"].join(`
`)}},c={args:{source:["Raw HTML is rendered as inert text, never live DOM:","","<script>alert(1)<\/script>","",'<img src=x onerror="alert(2)">',"","And a [dangerous link](javascript:alert(3)) is neutralized to `#`."].join(`
`)},parameters:{docs:{description:{story:"Security posture: raw HTML never becomes live DOM and dangerous link protocols are stripped via sanitizeHref."}}}},d={args:{source:["QA **needs** a number before we ship. The edge-**cache** rollout is next.","","Staged behind `edge_cache_v1`, see [the needs doc](https://example.com).","","```ts","const retries = 3;","```"].join(`
`),query:"needs edge-cache retri"},parameters:{docs:{description:{story:"Marks every term of `query` across body text, emphasis, link text and code spans. A term split by formatting, like `edge-**cache**`, is marked on both sides of the boundary."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"{}",...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    source: ['# Heading level 1', '## Heading level 2', '### Heading level 3', '#### Heading level 4', '##### Heading level 5', '###### Heading level 6'].join('\\n\\n')
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    source: 'Paragraph with **bold**, *italic*, ~~strikethrough~~, \`inline code\`, and an [external link](https://example.com).'
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    source: ['- Unordered one', '- Unordered two', '  - Nested item', '', '1. Ordered one', '2. Ordered two'].join('\\n')
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:"{\n  args: {\n    source: ['```ts', 'function add(a: number, b: number) {', '  return a + b;', '}', '```'].join('\\n')\n  }\n}",...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    source: ['| Method | Path | Cached |', '| --- | --- | --- |', '| GET | /v1/assets | Yes |', '| POST | /v1/assets | No |'].join('\\n')
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    source: ['- [x] Verified cache hit ratio', '- [ ] Invalidation latency under 200ms', '- [ ] Browser TTL persistence'].join('\\n')
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:"{\n  args: {\n    source: ['```scope', 'included:', '- GET /v1/assets/*', '- GET /v1/metadata/*', '- Cache invalidation via SNS', 'excluded:', '- WebSocket streams', '- POST/PUT operations', '```'].join('\\n')\n  }\n}",...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    source: ['Raw HTML is rendered as inert text, never live DOM:', '', '<script>alert(1)<\/script>', '', '<img src=x onerror="alert(2)">', '', 'And a [dangerous link](javascript:alert(3)) is neutralized to \`#\`.'].join('\\n')
  },
  parameters: {
    docs: {
      description: {
        story: 'Security posture: raw HTML never becomes live DOM and dangerous link protocols are stripped via sanitizeHref.'
      }
    }
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:"{\n  args: {\n    source: ['QA **needs** a number before we ship. The edge-**cache** rollout is next.', '', 'Staged behind `edge_cache_v1`, see [the needs doc](https://example.com).', '', '```ts', 'const retries = 3;', '```'].join('\\n'),\n    query: 'needs edge-cache retri'\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'Marks every term of `query` across body text, emphasis, link text and code spans. A term split by formatting, like `edge-**cache**`, is marked on both sides of the boundary.'\n      }\n    }\n  }\n}",...d.parameters?.docs?.source}}};const f=["Default","Headings","InlineFormatting","Lists","CodeBlock","Table","TaskList","Scope","MaliciousInput","WithSearchHighlight"];export{t as CodeBlock,e as Default,r as Headings,s as InlineFormatting,a as Lists,c as MaliciousInput,i as Scope,o as Table,n as TaskList,d as WithSearchHighlight,f as __namedExportsOrder,T as default};
