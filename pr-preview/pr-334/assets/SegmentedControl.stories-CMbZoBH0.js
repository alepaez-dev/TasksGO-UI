import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as p}from"./iframe-BjwBWE1b.js";import{S as m}from"./SegmentedControl-DVDryqOH.js";import"./preload-helper-Cslg37iz.js";import"./cn-2dOUpm6k.js";import"./useRovingTabList-BDC-j9OS.js";import"./rovingIndex-BLt4otwy.js";const v=[{value:"write",label:"Write"},{value:"preview",label:"Preview"}],a=e=>{const[d,u]=p.useState(e.value);return t.jsx(m,{...e,value:d,onValueChange:u})},A={title:"Components/SegmentedControl",component:m,tags:["autodocs"],argTypes:{size:{control:"inline-radio",options:["sm","md"]},variant:{control:"inline-radio",options:["toggle","filter","filter-compact"]},value:{control:!1},onValueChange:{control:!1}},args:{options:v,value:"write",size:"md",onValueChange:()=>{},"aria-label":"Editor mode"},parameters:{docs:{description:{component:"A controlled pill toggle for switching between two views of the same content (e.g. Write/Preview). Built on the WAI-ARIA tablist pattern with roving tabindex and arrow-key navigation. Pair it with tabpanels via `idPrefix` + `getSegmentPanelId`. The `filter` variant restyles it for a filter bar — sentence-case labels, an optional `count` per option, and one fixed height. The `filter-compact` variant is that same filter sized for a narrow screen — separate bordered chips that scroll horizontally instead of sitting on one track (`size` applies to the `toggle` variant only)."}}}},n={render:e=>t.jsx(a,{...e})},r={args:{value:"preview"},render:e=>t.jsx(a,{...e})},s={args:{size:"sm"},render:e=>t.jsx(a,{...e})},o={args:{options:[{value:"write",label:"Write"},{value:"preview",label:"Preview",disabled:!0}]},render:e=>t.jsx(a,{...e})},l={args:{variant:"filter",value:"all","aria-label":"Filter activity",options:[{value:"all",label:"All",count:28},{value:"comments",label:"Comments & Asks",count:4},{value:"system",label:"System",count:24}]},render:e=>t.jsx(a,{...e}),parameters:{docs:{description:{story:'The `filter` variant: sentence-case labels with a count per segment. Counts are plain text inside the button, so a segment announces as "All 28".'}}}},i={args:{variant:"filter",value:"all","aria-label":"Filter activity",options:[{value:"all",label:"All",count:0},{value:"comments",label:"Comments & Asks",count:0},{value:"system",label:"System",count:0}]},render:e=>t.jsx(a,{...e}),parameters:{docs:{description:{story:"A zero shows as `0` and stays selectable — choosing an empty filter is how a consumer reaches its empty state."}}}},c={args:{variant:"filter-compact",value:"all","aria-label":"Filter activity",options:[{value:"all",label:"All",count:28},{value:"comments",label:"Comments",count:4},{value:"system",label:"System",count:24}]},render:e=>t.jsx("div",{style:{width:280},children:t.jsx(a,{...e})}),parameters:{docs:{description:{story:"The mobile filter row — the same filter as `filter`, not a different control: same tablist semantics, same counts, same single selection. Each chip carries its own border instead of sitting on a shared track, the selection inverts to a solid fill, and the row scrolls horizontally with a fade when the chips outrun the screen."}}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <Controlled {...args} />
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'preview'
  },
  render: args => <Controlled {...args} />
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'filter-compact',
    value: 'all',
    'aria-label': 'Filter activity',
    options: [{
      value: 'all',
      label: 'All',
      count: 28
    }, {
      value: 'comments',
      label: 'Comments',
      count: 4
    }, {
      value: 'system',
      label: 'System',
      count: 24
    }]
  },
  render: args => <div style={{
    width: 280
  }}>
      <Controlled {...args} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'The mobile filter row — the same filter as \`filter\`, not a different control: same tablist semantics, same counts, same single selection. Each chip carries its own border instead of sitting on a shared track, the selection inverts to a solid fill, and the row scrolls horizontally with a fade when the chips outrun the screen.'
      }
    }
  }
}`,...c.parameters?.docs?.source}}};const S=["Default","PreviewActive","Small","WithDisabledOption","ActivityFilter","EmptyCounts","ActivityChips"];export{c as ActivityChips,l as ActivityFilter,n as Default,i as EmptyCounts,r as PreviewActive,s as Small,o as WithDisabledOption,S as __namedExportsOrder,A as default};
