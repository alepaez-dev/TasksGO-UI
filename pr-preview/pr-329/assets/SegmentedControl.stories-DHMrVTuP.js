import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as p}from"./iframe-C5rbSSai.js";import{S as c}from"./SegmentedControl-CIOf15r6.js";import"./preload-helper-CEvo-PNf.js";import"./cn-2dOUpm6k.js";import"./useRovingTabList-X6qj3Lde.js";import"./rovingIndex-BLt4otwy.js";const d=[{value:"write",label:"Write"},{value:"preview",label:"Preview"}],t=e=>{const[m,u]=p.useState(e.value);return a.jsx(c,{...e,value:m,onValueChange:u})},C={title:"Components/SegmentedControl",component:c,tags:["autodocs"],argTypes:{size:{control:"inline-radio",options:["sm","md"]},variant:{control:"inline-radio",options:["toggle","filter"]},value:{control:!1},onValueChange:{control:!1}},args:{options:d,value:"write",size:"md",onValueChange:()=>{},"aria-label":"Editor mode"},parameters:{docs:{description:{component:"A controlled pill toggle for switching between two views of the same content (e.g. Write/Preview). Built on the WAI-ARIA tablist pattern with roving tabindex and arrow-key navigation. Pair it with tabpanels via `idPrefix` + `getSegmentPanelId`. The `filter` variant restyles it for a filter bar — sentence-case labels, an optional `count` per option, and one fixed height (`size` applies to the `toggle` variant only)."}}}},r={render:e=>a.jsx(t,{...e})},n={args:{value:"preview"},render:e=>a.jsx(t,{...e})},s={args:{size:"sm"},render:e=>a.jsx(t,{...e})},o={args:{options:[{value:"write",label:"Write"},{value:"preview",label:"Preview",disabled:!0}]},render:e=>a.jsx(t,{...e})},l={args:{variant:"filter",value:"all","aria-label":"Filter activity",options:[{value:"all",label:"All",count:28},{value:"comments",label:"Comments & Asks",count:4},{value:"system",label:"System",count:24}]},render:e=>a.jsx(t,{...e}),parameters:{docs:{description:{story:'The `filter` variant: sentence-case labels with a count per segment. Counts are plain text inside the button, so a segment announces as "All 28".'}}}},i={args:{variant:"filter",value:"all","aria-label":"Filter activity",options:[{value:"all",label:"All",count:0},{value:"comments",label:"Comments & Asks",count:0},{value:"system",label:"System",count:0}]},render:e=>a.jsx(t,{...e}),parameters:{docs:{description:{story:"A zero shows as `0` and stays selectable — choosing an empty filter is how a consumer reaches its empty state."}}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: args => <Controlled {...args} />
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'preview'
  },
  render: args => <Controlled {...args} />
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm'
  },
  render: args => <Controlled {...args} />
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      value: 'write',
      label: 'Write'
    }, {
      value: 'preview',
      label: 'Preview',
      disabled: true
    }]
  },
  render: args => <Controlled {...args} />
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'filter',
    value: 'all',
    'aria-label': 'Filter activity',
    options: [{
      value: 'all',
      label: 'All',
      count: 28
    }, {
      value: 'comments',
      label: 'Comments & Asks',
      count: 4
    }, {
      value: 'system',
      label: 'System',
      count: 24
    }]
  },
  render: args => <Controlled {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'The \`filter\` variant: sentence-case labels with a count per segment. Counts are plain text inside the button, so a segment announces as "All 28".'
      }
    }
  }
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'filter',
    value: 'all',
    'aria-label': 'Filter activity',
    options: [{
      value: 'all',
      label: 'All',
      count: 0
    }, {
      value: 'comments',
      label: 'Comments & Asks',
      count: 0
    }, {
      value: 'system',
      label: 'System',
      count: 0
    }]
  },
  render: args => <Controlled {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'A zero shows as \`0\` and stays selectable — choosing an empty filter is how a consumer reaches its empty state.'
      }
    }
  }
}`,...i.parameters?.docs?.source}}};const A=["Default","PreviewActive","Small","WithDisabledOption","ActivityFilter","EmptyCounts"];export{l as ActivityFilter,r as Default,i as EmptyCounts,n as PreviewActive,s as Small,o as WithDisabledOption,A as __namedExportsOrder,C as default};
