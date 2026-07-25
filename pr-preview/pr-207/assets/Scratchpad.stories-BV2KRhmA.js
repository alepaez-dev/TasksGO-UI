import{j as e}from"./jsx-runtime-u17CrQMm.js";import{S as d}from"./Scratchpad-DDq0L0yl.js";import{u as p}from"./useScratchpad-93MNS06a.js";import"./iframe-BlVMUn67.js";import"./preload-helper-Cv5kynVY.js";import"./cn-2dOUpm6k.js";import"./useDragReorder-B_alJGDe.js";import"./linkRenderRule-D5Xf4g33.js";import"./sanitizeHref-a0N9eHv-.js";import"./Popover-CW6o5G9Y.js";import"./index-IJ1PcgWd.js";import"./index-2qxscepD.js";import"./TicketId-DZC7twph.js";import"./Badge-C2SUtXHq.js";import"./Icon-DlLMXf6H.js";const R={title:"Components/Scratchpad",component:d,tags:["autodocs"],parameters:{docs:{description:{component:"A reorderable list of free-form Markdown notes in a monospace aesthetic. Each line's raw text renders as inline Markdown — `#` headings, `**bold**`/`*italic*`/`` `code` ``, and sanitized links — while leading `[ ]`/`[x]` become interactive todo checkboxes. Lines can be dragged to reorder (mouse drag handle or `Alt+ArrowUp`/`Alt+ArrowDown` on the focused handle); clicking a line swaps it to a raw-text editor (auto-growing textarea), and blurring returns it to the rendered view. With `highlightBadges`, inline `[task]`/`[qa]` tokens render as colored chips; `[task]` reveals a task popover on hover/focus when `taskBadgeInfo` is supplied. Every interaction is an optional callback — omit one and that affordance disappears, so a fully read-only scratchpad needs only `aria-label` and `lines`. The component is layout-agnostic and stateless; the consumer owns the line data and the open state."}}},argTypes:{highlightBadges:{control:"boolean",description:"Render inline `[task]`/`[qa]` tokens as colored badges (rendered when blurred, raw text when editing)."}},decorators:[t=>e.jsx("div",{style:{maxWidth:"640px",padding:"24px"},children:e.jsx(t,{})})]},c=[{id:"h1",text:"# Implementation Strategy"},{id:"t1",text:"[ ] Check race condition in cache logic when SNS invalidation fires during a write"},{id:"t2",text:"[ ] Verify **TTL** headers are inherited from origin — see [caching RFC](https://example.com/rfc)"},{id:"t3",text:"Refactor the [task] edge-caching header mutation logic to handle multi-value headers and ensure compatibility with legacy upstream services."},{id:"t4",text:"[x] Initial research on *CloudFront* function limits"},{id:"x1",text:"Debug: [qa] latency spikes observed in `us-west-2` staging environment"},{id:"x2",text:"Note: hand the [task] to **@am** after the header mutation review"}],l={id:"TSK-104",title:"Implement unit tests for cache",status:"Outdated",description:"Ensuring all edge cases for cache invalidation are covered.",createdAgo:"Created 2h ago",href:"#"};function s({initial:t,highlightBadges:h}){const g=p(t);return e.jsx(d,{"aria-label":"Scratchpad notes",title:"Scratchpad / Private Notes",status:"Auto-saving…",placeholder:"Click to add more context…",highlightBadges:h,taskBadgeInfo:l,...g})}const a={args:{highlightBadges:!0},render:t=>e.jsx(s,{initial:c,highlightBadges:t.highlightBadges})},r={args:{"aria-label":"Scratchpad notes",title:"Scratchpad / Private Notes",lines:c,highlightBadges:!0,taskBadgeInfo:l}},i={render:()=>e.jsx(s,{initial:[{id:"first",text:""}]})},n={render:()=>e.jsx(s,{initial:[{id:"g1",text:"# Heading 1"},{id:"g2",text:"## Heading 2"},{id:"g3",text:"### Heading 3"},{id:"g4",text:"#### Heading 4"},{id:"gb",text:"Body text for comparison"}]})},o={render:()=>e.jsx(s,{highlightBadges:!0,initial:[{id:"r1",text:"A soft-break row keeps one heading level:"},{id:"r2",text:`# header 1
## header 2
### header 3
#### header 4`},{id:"r3",text:"Only the first marker is stripped; later lines stay literal."}]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    highlightBadges: true
  },
  render: args => <ControlledScratchpad initial={lines} highlightBadges={args.highlightBadges} />
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Scratchpad notes',
    title: 'Scratchpad / Private Notes',
    lines,
    highlightBadges: true,
    taskBadgeInfo
  }
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledScratchpad initial={[{
    id: 'first',
    text: ''
  }]} />
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledScratchpad initial={[{
    id: 'g1',
    text: '# Heading 1'
  }, {
    id: 'g2',
    text: '## Heading 2'
  }, {
    id: 'g3',
    text: '### Heading 3'
  }, {
    id: 'g4',
    text: '#### Heading 4'
  }, {
    id: 'gb',
    text: 'Body text for comparison'
  }]} />
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledScratchpad highlightBadges initial={[{
    id: 'r1',
    text: 'A soft-break row keeps one heading level:'
  }, {
    id: 'r2',
    text: '# header 1\\n## header 2\\n### header 3\\n#### header 4'
  }, {
    id: 'r3',
    text: 'Only the first marker is stripped; later lines stay literal.'
  }]} />
}`,...o.parameters?.docs?.source}}};const E=["Default","ReadOnly","Empty","Headings","MultiLineRow"];export{a as Default,i as Empty,n as Headings,o as MultiLineRow,r as ReadOnly,E as __namedExportsOrder,R as default};
