import{R as r}from"./ReactionBar-BdcefWpq.js";import"./jsx-runtime-u17CrQMm.js";import"./iframe-BsOfj63y.js";import"./preload-helper-BXxMBR1D.js";import"./cn-2dOUpm6k.js";import"./Icon-DDE8Bo2Y.js";const m={title:"Components/ReactionBar",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"The emoji reactions under an activity comment. Each chip is a toggle button carrying `aria-pressed`, so the viewer’s own reaction is announced and not signalled by colour alone. Pass `onAddReaction` to offer the add-reaction button — its presence is the trigger. With no reactions and no `onAddReaction`, the bar renders nothing rather than an empty row."}}},argTypes:{onToggleReaction:{action:"react"},onAddReaction:{action:"add"}},args:{reactions:[{emoji:"👍",count:2,reactedByViewer:!0},{emoji:"🎉",count:1,reactedByViewer:!1}]}},e={},o={args:{onAddReaction:()=>{}}},t={args:{reactions:[],onAddReaction:()=>{}},parameters:{docs:{description:{story:"Only the add button shows until someone reacts."}}}},n={args:{reactions:[],onAddReaction:void 0},parameters:{docs:{description:{story:"Nothing to show and no way to add — the bar renders nothing."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"{}",...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    onAddReaction: () => {}
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    reactions: [],
    onAddReaction: () => {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Only the add button shows until someone reacts.'
      }
    }
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    reactions: [],
    onAddReaction: undefined
  },
  parameters: {
    docs: {
      description: {
        story: 'Nothing to show and no way to add — the bar renders nothing.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};const u=["Default","WithAddButton","NoneYet","Empty"];export{e as Default,n as Empty,t as NoneYet,o as WithAddButton,u as __namedExportsOrder,m as default};
