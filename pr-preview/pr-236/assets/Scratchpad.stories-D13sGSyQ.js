import{j as e}from"./jsx-runtime-u17CrQMm.js";import{a as c}from"./Scratchpad-DkoSDdtG.js";import{u as g}from"./useScratchpad-DNqN1oNR.js";import{w as u}from"./decorators-BemuZd_w.js";import{m as f}from"./iframe-DKJIL48K.js";import"./cn-2dOUpm6k.js";import"./useDragReorder-CNwXNKE_.js";import"./applyMarkdownAction-XqptHmkw.js";import"./rovingIndex-BLt4otwy.js";import"./Icon-DoeJAK46.js";import"./IconButton-DMRs0QcD.js";import"./linkRenderRule-Dhjn5gG0.js";import"./sanitizeHref-a0N9eHv-.js";import"./BottomSheet-VxiGFVPE.js";import"./useFocusTrap-B7B27S5-.js";import"./index-dHWRTEIH.js";import"./index-D5t6iIfS.js";import"./Popover-CDwNMmTz.js";import"./TicketId-CQvX5GAB.js";import"./Badge-DaFto_jS.js";import"./preload-helper-B1qkIHa0.js";const L={title:"Components/Scratchpad",component:c,tags:["autodocs"],parameters:{docs:{description:{component:"A reorderable list of free-form Markdown notes in a monospace aesthetic. Each line's raw text renders as inline Markdown — `#` headings, `**bold**`/`*italic*`/`` `code` ``, and sanitized links — while leading `[ ]`/`[x]` become interactive todo checkboxes. Lines can be dragged to reorder (mouse drag handle or `Alt+ArrowUp`/`Alt+ArrowDown` on the focused handle); clicking a line swaps it to a raw-text editor (auto-growing textarea), and blurring returns it to the rendered view. With `highlightBadges`, inline `[task]`/`[qa]` tokens render as colored chips; `[task]` reveals a task popover on hover/focus when `taskBadgeInfo` is supplied. Every interaction is an optional callback — omit one and that affordance disappears, so a fully read-only scratchpad needs only `aria-label` and `lines`. The component is layout-agnostic and stateless; the consumer owns the line data and the open state.\n\n### Positioning the formatting toolbar\n\nWith `formattingToolbar`, the toolbar is `position: sticky` and the page tells it where to stop. Two CSS custom properties are the contract — set them on the `Scratchpad` element (or any ancestor), both defaulting to `0px`:\n\n- `--ds-scratchpad-toolbar-offset` — how far from the top of the scroll container the toolbar parks. Set this to the height of your own sticky header, otherwise the two overlap once the page scrolls.\n- `--ds-scratchpad-toolbar-inset` — your container's horizontal padding. The toolbar bleeds out by this amount and pads its buttons back in, so its background and borders span the full width while the controls stay aligned with the notes.\n\nBoth properties are consumed as CSS lengths — pass design tokens or static values, never user-supplied strings."}}},argTypes:{highlightBadges:{control:"boolean",description:"Render inline `[task]`/`[qa]` tokens as colored badges (rendered when blurred, raw text when editing)."}},decorators:[(t,a)=>a.parameters.layout==="fullscreen"?e.jsx("div",{style:{height:"100dvh",display:"flex",flexDirection:"column",overflow:"hidden"},children:e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"16px"},children:e.jsx(t,{})})}):e.jsx("div",{style:{maxWidth:"640px",padding:"24px"},children:e.jsx(t,{})})]},h=[{id:"h1",text:"# Implementation Strategy"},{id:"t1",text:"[ ] Check race condition in cache logic when SNS invalidation fires during a write"},{id:"t2",text:"[ ] Verify **TTL** headers are inherited from origin — see [caching RFC](https://example.com/rfc)"},{id:"t3",text:"Refactor the [task] edge-caching header mutation logic to handle multi-value headers and ensure compatibility with legacy upstream services."},{id:"t4",text:"[x] Initial research on *CloudFront* function limits"},{id:"x1",text:"Debug: [qa] latency spikes observed in `us-west-2` staging environment"},{id:"x2",text:"Note: hand the [task] to **@am** after the header mutation review"}],p={id:"TSK-104",title:"Implement unit tests for cache",status:"Outdated",description:"Ensuring all edge cases for cache invalidation are covered.",createdAgo:"Created 2h ago",href:"#"};function l({initial:t,highlightBadges:a}){const m=g(t);return e.jsx(c,{"aria-label":"Scratchpad notes",title:"Scratchpad / Private Notes",status:"Auto-saving…",placeholder:"Click to add more context…",highlightBadges:a,formattingToolbar:!0,taskBadgeInfo:p,...m})}function x({initial:t}){const a=g(t);return e.jsx(c,{"aria-label":"Scratchpad notes",title:"Scratchpad / Private Notes",status:"Auto-saving…",highlightBadges:!0,formattingToolbar:!0,toolbarPosition:"above-header",taskCardPresentation:"sheet",taskBadgeInfo:p,...a})}const r={args:{highlightBadges:!0},render:t=>e.jsx(l,{initial:h,highlightBadges:t.highlightBadges})},o={decorators:[u("mobile")],parameters:{layout:"fullscreen",viewport:{options:f},docs:{description:{story:'Touch layout: the "add context" affordance is always visible, the task chip opens a bottom sheet, and the formatting toolbar sits above the header and sticks while the notes scroll.'}}},render:()=>e.jsx(x,{initial:h})},i={args:{"aria-label":"Scratchpad notes",title:"Scratchpad / Private Notes",lines:h,highlightBadges:!0,taskBadgeInfo:p}},n={render:()=>e.jsx(l,{initial:[{id:"first",text:""}]})},s={render:()=>e.jsx(l,{initial:[{id:"g1",text:"# Heading 1"},{id:"g2",text:"## Heading 2"},{id:"g3",text:"### Heading 3"},{id:"g4",text:"#### Heading 4"},{id:"gb",text:"Body text for comparison"}]})},d={render:()=>e.jsx(l,{highlightBadges:!0,initial:[{id:"r1",text:"A soft-break row keeps one heading level:"},{id:"r2",text:`# header 1
## header 2
### header 3
#### header 4`},{id:"r3",text:"Only the first marker is stripped; later lines stay literal."}]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    highlightBadges: true
  },
  render: args => <ControlledScratchpad initial={lines} highlightBadges={args.highlightBadges} />
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      options: mobileViewportOptions
    },
    docs: {
      description: {
        story: 'Touch layout: the "add context" affordance is always visible, the task chip opens a bottom sheet, and the formatting toolbar sits above the header and sticks while the notes scroll.'
      }
    }
  },
  render: () => <MobileScratchpad initial={lines} />
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Scratchpad notes',
    title: 'Scratchpad / Private Notes',
    lines,
    highlightBadges: true,
    taskBadgeInfo
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};const q=["Default","Mobile","ReadOnly","Empty","Headings","MultiLineRow"];export{r as Default,n as Empty,s as Headings,o as Mobile,d as MultiLineRow,i as ReadOnly,q as __namedExportsOrder,L as default};
