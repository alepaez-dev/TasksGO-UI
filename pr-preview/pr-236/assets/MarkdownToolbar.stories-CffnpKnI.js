import{M as n}from"./applyMarkdownAction-BOdyur_P.js";import{S as a}from"./Scratchpad-D0fb4tqj.js";import"./jsx-runtime-u17CrQMm.js";import"./iframe-0CAbWPJ9.js";import"./preload-helper-B1qkIHa0.js";import"./rovingIndex-BLt4otwy.js";import"./cn-2dOUpm6k.js";import"./Icon-B20RIF0I.js";import"./IconButton-CXpSeTzc.js";import"./useDragReorder-BX4Pu2Eb.js";import"./linkRenderRule-Cldot8XZ.js";import"./sanitizeHref-a0N9eHv-.js";import"./BottomSheet-ppLoAz_J.js";import"./useFocusTrap-BZBqNgXl.js";import"./index-CqOh744j.js";import"./index-Dt2XZHX_.js";import"./Popover-DppOFs7U.js";import"./TicketId-DR8MWaQf.js";import"./Badge-CUW0KL-W.js";const M={title:"Components/MarkdownToolbar",component:n,tags:["autodocs"],argTypes:{size:{control:"inline-radio",options:["sm","md"]},disabled:{control:"boolean"},onAction:{control:!1}},args:{onAction:()=>{},size:"sm",disabled:!1},parameters:{docs:{description:{component:'A stateless formatting toolbar for the markdown editor. Renders a `role="toolbar"` row of icon buttons (heading, bold, italic, list, quote, code, link, image, checklist item) and emits `onAction(action)` — it never mutates text itself; the owning editor hook applies the transform to the textarea selection.'}}}},e={},o={args:{size:"md"}},t={args:{disabled:!0}},r={args:{groups:a,hint:"Markdown supported"},parameters:{docs:{description:{story:"The grouping the Scratchpad uses: text formatting, then block and insert actions, then the token pills, with a divider between each group and a trailing hint. On narrow screens the pill labels and the hint collapse to leave the icons, and the dividers drop once the row can no longer keep everything on one line."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"{}",...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'md'
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    groups: SCRATCHPAD_TOOLBAR_GROUPS,
    hint: 'Markdown supported'
  },
  parameters: {
    docs: {
      description: {
        story: 'The grouping the Scratchpad uses: text formatting, then block and insert actions, then the token pills, with a divider between each group and a trailing hint. On narrow screens the pill labels and the hint collapse to leave the icons, and the dividers drop once the row can no longer keep everything on one line.'
      }
    }
  }
}`,...r.parameters?.docs?.source}}};const R=["Default","Medium","Disabled","Grouped"];export{e as Default,t as Disabled,r as Grouped,o as Medium,R as __namedExportsOrder,M as default};
