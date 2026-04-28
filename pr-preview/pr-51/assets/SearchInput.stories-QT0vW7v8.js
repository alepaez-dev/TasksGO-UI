import{j as o}from"./jsx-runtime-u17CrQMm.js";import{S as s}from"./SearchInput-DG9zEQeb.js";import"./iframe-DRR0ge1c.js";import"./preload-helper-BEwTLl-L.js";import"./cn-2dOUpm6k.js";import"./Icon-l85gbPLJ.js";const p={title:"Components/SearchInput",component:s,tags:["autodocs"],argTypes:{placeholder:{control:"text"},shortcutHint:{control:"text"},size:{control:"select",options:["sm","md"]},disabled:{control:"boolean"}},args:{"aria-label":"Search"},decorators:[t=>o.jsx("div",{style:{maxWidth:"320px"},children:o.jsx(t,{})})]},r={args:{placeholder:"Search or command...",shortcutHint:"⌘K"}},e={args:{placeholder:"Filter tasks...",size:"sm"}},a={args:{disabled:!0,placeholder:"Search or command...",shortcutHint:"⌘K"},parameters:{a11y:{config:{rules:[{id:"color-contrast",enabled:!1}]}}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search or command...',
    shortcutHint: '⌘K'
  }
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Filter tasks...',
    size: 'sm'
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    placeholder: 'Search or command...',
    shortcutHint: '⌘K'
  },
  // Disabled components are exempt from WCAG 2.1 SC 1.4.3 contrast requirements:
  // e.g "User Interface Components that are not available for user interaction"
  // https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
  // disabling storybook a11y color contrast rule for this story to avoid false positive accessibility violation
  parameters: {
    a11y: {
      config: {
        rules: [{
          id: 'color-contrast',
          enabled: false
        }]
      }
    }
  }
}`,...a.parameters?.docs?.source}}};const u=["Default","Small","Disabled"];export{r as Default,a as Disabled,e as Small,u as __namedExportsOrder,p as default};
