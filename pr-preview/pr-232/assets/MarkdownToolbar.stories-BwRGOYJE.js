import{M as s}from"./MarkdownToolbar-DLX_ywaM.js";import"./jsx-runtime-u17CrQMm.js";import"./iframe-BvcEy6zz.js";import"./preload-helper-CZDhsGh7.js";import"./index-D1nFl-sN.js";import"./index-BOB_mKKk.js";import"./rovingIndex-BLt4otwy.js";import"./cn-2dOUpm6k.js";import"./IconButton-BTD5TA55.js";import"./Icon-CnMveSWX.js";import"./Button-TrPFxjK9.js";const w={title:"Components/MarkdownToolbar",component:s,tags:["autodocs"],argTypes:{size:{control:"inline-radio",options:["sm","md"]},disabled:{control:"boolean"},variant:{control:"inline-radio",options:["inline","accessory"]},onAction:{control:!1},onDone:{control:!1}},args:{onAction:()=>{},size:"sm",disabled:!1},parameters:{docs:{description:{component:'A stateless formatting toolbar for the markdown editor. Renders a `role="toolbar"` row of icon buttons (heading, bold, italic, list, quote, code, link, image, checklist item) and emits `onAction(action)` — it never mutates text itself; the owning editor hook applies the transform to the textarea selection.'}}}},o={},e={args:{size:"md"}},t={args:{disabled:!0}},r={args:{variant:"accessory",onDone:()=>{}},parameters:{docs:{description:{story:"Keyboard-docked variant: portals to the bottom of the viewport with a trailing Done button. It tracks `visualViewport`, so it rides above the on-screen keyboard when one is open and rests at the viewport bottom otherwise (as shown here, with no keyboard)."}}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:"{}",...o.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'md'
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'accessory',
    onDone: () => {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Keyboard-docked variant: portals to the bottom of the viewport with a trailing Done button. It tracks \`visualViewport\`, so it rides above the on-screen keyboard when one is open and rests at the viewport bottom otherwise (as shown here, with no keyboard).'
      }
    }
  }
}`,...r.parameters?.docs?.source}}};const g=["Default","Medium","Disabled","Accessory"];export{r as Accessory,o as Default,t as Disabled,e as Medium,g as __namedExportsOrder,w as default};
