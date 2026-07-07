import{M as d}from"./Markdown-d1AvNXFa.js";import"./jsx-runtime-u17CrQMm.js";import"./iframe-BAFnnnUe.js";import"./preload-helper-DUht4eG2.js";import"./cn-2dOUpm6k.js";import"./sanitizeHref-a0N9eHv-.js";import"./Card-COoVNFYa.js";const l=["# Edge caching RFC","","Intro with **bold**, *italic*, ~~strikethrough~~, `inline code`, and a [link](https://example.com).","","## Description","","We need a caching layer at the edge for read-heavy routes to cut latency and database load.","","### Goals","","- Lower TTFB in AP-South-1","- Reduce database CPU during sync windows","","1. Measure the baseline","2. Roll out behind a flag","","> Staged behind `edge_cache_v1` for 5% of traffic.","","```ts","const ttl = 60;","cache.set(key, value, ttl);","```","","| Environment | Status |","| --- | --- |","| QA1 | Pass |","| Prod | Idle |","","- [x] Cache hit ratio verified","- [ ] Invalidation latency under 200ms"].join(`
`),T={title:"Components/Markdown",component:d,tags:["autodocs"],argTypes:{source:{control:"text"}},args:{source:l},parameters:{docs:{description:{component:"Renders a markdown string to styled React elements through a stable in-house seam over `markdown-to-jsx`. Output is React elements (never `dangerouslySetInnerHTML`); raw embedded HTML is disabled and link/image URLs are routed through the design system `sanitizeHref`. All styling comes from design tokens — the library ships no CSS. GFM tables and task lists are supported."}}}},e={},r={args:{source:["# Heading level 1","## Heading level 2","### Heading level 3","#### Heading level 4","##### Heading level 5","###### Heading level 6"].join(`

`)}},a={args:{source:"Paragraph with **bold**, *italic*, ~~strikethrough~~, `inline code`, and an [external link](https://example.com)."}},s={args:{source:["- Unordered one","- Unordered two","  - Nested item","","1. Ordered one","2. Ordered two"].join(`
`)}},n={args:{source:["```ts","function add(a: number, b: number) {","  return a + b;","}","```"].join(`
`)}},o={args:{source:["| Method | Path | Cached |","| --- | --- | --- |","| GET | /v1/assets | Yes |","| POST | /v1/assets | No |"].join(`
`)}},t={args:{source:["- [x] Verified cache hit ratio","- [ ] Invalidation latency under 200ms","- [ ] Browser TTL persistence"].join(`
`)}},i={args:{source:["```scope","included:","- GET /v1/assets/*","- GET /v1/metadata/*","- Cache invalidation via SNS","excluded:","- WebSocket streams","- POST/PUT operations","```"].join(`
`)}},c={args:{source:["Raw HTML is rendered as inert text, never live DOM:","","<script>alert(1)<\/script>","",'<img src=x onerror="alert(2)">',"","And a [dangerous link](javascript:alert(3)) is neutralized to `#`."].join(`
`)},parameters:{docs:{description:{story:"Security posture: raw HTML never becomes live DOM and dangerous link protocols are stripped via sanitizeHref."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"{}",...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    source: ['# Heading level 1', '## Heading level 2', '### Heading level 3', '#### Heading level 4', '##### Heading level 5', '###### Heading level 6'].join('\\n\\n')
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    source: 'Paragraph with **bold**, *italic*, ~~strikethrough~~, \`inline code\`, and an [external link](https://example.com).'
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    source: ['- Unordered one', '- Unordered two', '  - Nested item', '', '1. Ordered one', '2. Ordered two'].join('\\n')
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:"{\n  args: {\n    source: ['```ts', 'function add(a: number, b: number) {', '  return a + b;', '}', '```'].join('\\n')\n  }\n}",...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    source: ['| Method | Path | Cached |', '| --- | --- | --- |', '| GET | /v1/assets | Yes |', '| POST | /v1/assets | No |'].join('\\n')
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    source: ['- [x] Verified cache hit ratio', '- [ ] Invalidation latency under 200ms', '- [ ] Browser TTL persistence'].join('\\n')
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:"{\n  args: {\n    source: ['```scope', 'included:', '- GET /v1/assets/*', '- GET /v1/metadata/*', '- Cache invalidation via SNS', 'excluded:', '- WebSocket streams', '- POST/PUT operations', '```'].join('\\n')\n  }\n}",...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};const b=["Default","Headings","InlineFormatting","Lists","CodeBlock","Table","TaskList","Scope","MaliciousInput"];export{n as CodeBlock,e as Default,r as Headings,a as InlineFormatting,s as Lists,c as MaliciousInput,i as Scope,o as Table,t as TaskList,b as __namedExportsOrder,T as default};
