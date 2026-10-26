import{R as a}from"./ReactionBar-F4lLAnOX.js";import"./jsx-runtime-u17CrQMm.js";import"./iframe-BjwBWE1b.js";import"./preload-helper-Cslg37iz.js";import"./cn-2dOUpm6k.js";import"./Icon-DtlgB7Tp.js";import"./Popover-BpxdWXhD.js";import"./index-CRhMKASF.js";import"./index-DCo3AfjR.js";const u={title:"Components/ReactionBar",component:a,tags:["autodocs"],parameters:{docs:{description:{component:"The emoji reactions under an activity comment. Each chip is a toggle button carrying `aria-pressed`, so the viewer’s own reaction is announced and not signalled by colour alone. Pass `onPickerOpenChange` to offer the add-reaction button — its presence is the trigger. The picker itself is a `Popover` the caller opens via `pickerOpen`, so the bar stays stateless. With no reactions and no `onPickerOpenChange`, the bar renders nothing rather than an empty row."}}},argTypes:{onToggleReaction:{action:"react"},onPickerOpenChange:{action:"pickerOpenChange"},onPickReaction:{action:"pick"}},args:{reactions:[{emoji:"👍",count:2,reactedByViewer:!0,actors:[{id:"ap",name:"Ale P."},{id:"sk",name:"Sam K."}]},{emoji:"🎉",count:1,reactedByViewer:!1,actors:[{id:"am",name:"Alex M."}]}]}},e={},n={args:{onPickerOpenChange:()=>{}}},o={args:{reactions:[],onPickerOpenChange:()=>{}},parameters:{docs:{description:{story:"Only the add button shows until someone reacts."}}}},r={args:{reactions:[],onPickerOpenChange:void 0},parameters:{docs:{description:{story:"Nothing to show and no way to add — the bar renders nothing."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"{}",...e.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    onPickerOpenChange: () => {}
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    reactions: [],
    onPickerOpenChange: () => {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Only the add button shows until someone reacts.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    reactions: [],
    onPickerOpenChange: undefined
  },
  parameters: {
    docs: {
      description: {
        story: 'Nothing to show and no way to add — the bar renders nothing.'
      }
    }
  }
}`,...r.parameters?.docs?.source}}};const l=["Default","WithAddButton","NoneYet","Empty"];export{e as Default,r as Empty,o as NoneYet,n as WithAddButton,l as __namedExportsOrder,u as default};
