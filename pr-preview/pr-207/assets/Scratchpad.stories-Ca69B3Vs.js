import{j as e}from"./jsx-runtime-u17CrQMm.js";import{S as c}from"./Scratchpad-BTvtT0aK.js";import{u as g}from"./useScratchpad-gfCJ-7w-.js";import{w as u}from"./decorators-DcF3cotd.js";import{m as x}from"./iframe-TsoxqUh8.js";import"./cn-2dOUpm6k.js";import"./useDragReorder-snlZgIts.js";import"./applyMarkdownAction-Ckg9o0C5.js";import"./linkRenderRule-Dj3sTgD-.js";import"./sanitizeHref-a0N9eHv-.js";import"./BottomSheet-Be1Lelfz.js";import"./useFocusTrap-Cav9suxK.js";import"./index-BiR7oTQH.js";import"./index-VensuT2V.js";import"./Popover-D-RKfx9c.js";import"./TicketId-CkucLIvv.js";import"./Badge-CtvJ2Tvp.js";import"./Icon-dW02SXhX.js";import"./MarkdownToolbar-BbW6iJ6K.js";import"./rovingIndex-BLt4otwy.js";import"./IconButton-DRu75JVe.js";import"./Button-oYqon5F1.js";import"./preload-helper-Cv5kynVY.js";const F={title:"Components/Scratchpad",component:c,tags:["autodocs"],parameters:{docs:{description:{component:"A reorderable list of free-form Markdown notes in a monospace aesthetic. Each line's raw text renders as inline Markdown — `#` headings, `**bold**`/`*italic*`/`` `code` ``, and sanitized links — while leading `[ ]`/`[x]` become interactive todo checkboxes. Lines can be dragged to reorder (mouse drag handle or `Alt+ArrowUp`/`Alt+ArrowDown` on the focused handle); clicking a line swaps it to a raw-text editor (auto-growing textarea), and blurring returns it to the rendered view. With `highlightBadges`, inline `[task]`/`[qa]` tokens render as colored chips; `[task]` reveals a task popover on hover/focus when `taskBadgeInfo` is supplied. Every interaction is an optional callback — omit one and that affordance disappears, so a fully read-only scratchpad needs only `aria-label` and `lines`. The component is layout-agnostic and stateless; the consumer owns the line data and the open state."}}},argTypes:{highlightBadges:{control:"boolean",description:"Render inline `[task]`/`[qa]` tokens as colored badges (rendered when blurred, raw text when editing)."}},decorators:[(t,a)=>a.parameters.layout==="fullscreen"?e.jsx("div",{style:{height:"100dvh",display:"flex",flexDirection:"column",overflow:"hidden"},children:e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"16px"},children:e.jsx(t,{})})}):e.jsx("div",{style:{maxWidth:"640px",padding:"24px"},children:e.jsx(t,{})})]},h=[{id:"h1",text:"# Implementation Strategy"},{id:"t1",text:"[ ] Check race condition in cache logic when SNS invalidation fires during a write"},{id:"t2",text:"[ ] Verify **TTL** headers are inherited from origin — see [caching RFC](https://example.com/rfc)"},{id:"t3",text:"Refactor the [task] edge-caching header mutation logic to handle multi-value headers and ensure compatibility with legacy upstream services."},{id:"t4",text:"[x] Initial research on *CloudFront* function limits"},{id:"x1",text:"Debug: [qa] latency spikes observed in `us-west-2` staging environment"},{id:"x2",text:"Note: hand the [task] to **@am** after the header mutation review"}],p={id:"TSK-104",title:"Implement unit tests for cache",status:"Outdated",description:"Ensuring all edge cases for cache invalidation are covered.",createdAgo:"Created 2h ago",href:"#"};function l({initial:t,highlightBadges:a}){const m=g(t);return e.jsx(c,{"aria-label":"Scratchpad notes",title:"Scratchpad / Private Notes",status:"Auto-saving…",placeholder:"Click to add more context…",highlightBadges:a,taskBadgeInfo:p,...m})}function f({initial:t}){const a=g(t);return e.jsx(c,{"aria-label":"Scratchpad notes",title:"Scratchpad / Private Notes",status:"Auto-saving…",highlightBadges:!0,formattingToolbar:!0,taskCardPresentation:"sheet",taskBadgeInfo:p,...a})}const r={args:{highlightBadges:!0},render:t=>e.jsx(l,{initial:h,highlightBadges:t.highlightBadges})},i={decorators:[u("mobile")],parameters:{layout:"fullscreen",viewport:{options:x},docs:{description:{story:'Touch layout: the "add context" affordance is always visible, the task chip opens a bottom sheet, and the formatting toolbar docks above the keyboard while editing a line.'}}},render:()=>e.jsx(f,{initial:h})},o={args:{"aria-label":"Scratchpad notes",title:"Scratchpad / Private Notes",lines:h,highlightBadges:!0,taskBadgeInfo:p}},n={render:()=>e.jsx(l,{initial:[{id:"first",text:""}]})},s={render:()=>e.jsx(l,{initial:[{id:"g1",text:"# Heading 1"},{id:"g2",text:"## Heading 2"},{id:"g3",text:"### Heading 3"},{id:"g4",text:"#### Heading 4"},{id:"gb",text:"Body text for comparison"}]})},d={render:()=>e.jsx(l,{highlightBadges:!0,initial:[{id:"r1",text:"A soft-break row keeps one heading level:"},{id:"r2",text:`# header 1
## header 2
### header 3
#### header 4`},{id:"r3",text:"Only the first marker is stripped; later lines stay literal."}]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    highlightBadges: true
  },
  render: args => <ControlledScratchpad initial={lines} highlightBadges={args.highlightBadges} />
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      options: mobileViewportOptions
    },
    docs: {
      description: {
        story: 'Touch layout: the "add context" affordance is always visible, the task chip opens a bottom sheet, and the formatting toolbar docks above the keyboard while editing a line.'
      }
    }
  },
  render: () => <MobileScratchpad initial={lines} />
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Scratchpad notes',
    title: 'Scratchpad / Private Notes',
    lines,
    highlightBadges: true,
    taskBadgeInfo
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledScratchpad initial={[{
    id: 'first',
    text: ''
  }]} />
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};const W=["Default","Mobile","ReadOnly","Empty","Headings","MultiLineRow"];export{r as Default,n as Empty,s as Headings,i as Mobile,d as MultiLineRow,o as ReadOnly,W as __namedExportsOrder,F as default};
