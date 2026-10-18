import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as w}from"./iframe-DQzDOA3N.js";import{c as _}from"./cn-2dOUpm6k.js";import{u as P}from"./useRovingTabList-CxNCwHHS.js";import"./preload-helper-B-j5Cm3y.js";import"./rovingIndex-BLt4otwy.js";const z="_segmented_acbr0_1",L="_toggleList_acbr0_6",q="_filterList_acbr0_13",I="_segment_acbr0_1",V="_toggle_acbr0_6",W="_md_acbr0_47",k="_sm_acbr0_52",E="_toggleSelected_acbr0_57",F="_filter_acbr0_13",N="_filterSelected_acbr0_72",D="_disabled_acbr0_79",O="_selected_acbr0_79",R="_count_acbr0_87",t={segmented:z,toggleList:L,filterList:q,segment:I,toggle:V,md:W,sm:k,toggleSelected:E,filter:F,filterSelected:N,disabled:D,selected:O,count:R},f={toggle:{list:t.toggleList,segment:t.toggle,selected:t.toggleSelected},filter:{list:t.filterList,segment:t.filter,selected:t.filterSelected}};function $(e,s){return`${e}-segment-${s}`}function B(e,s){return`${e}-panel-${s}`}const p=w.forwardRef(({options:e,value:s,onValueChange:v,size:h="md",variant:l="toggle",idPrefix:o,"aria-label":S,className:C,...A},x)=>{const{selectedIndex:T,getTabProps:j}=P(e,s,v);return a.jsx("div",{ref:x,role:"tablist","aria-label":S,"aria-orientation":"horizontal",className:_(t.segmented,l==="toggle"&&t[h],f[l].list,C),...A,children:e.map((n,y)=>{const b=y===T;return a.jsxs("button",{type:"button",role:"tab",id:o?$(o,n.value):void 0,"aria-controls":b&&o?B(o,n.value):void 0,className:_(t.segment,f[l].segment,b&&t.selected,b&&f[l].selected,n.disabled&&t.disabled),...j(y),children:[n.label,n.count!==void 0&&a.jsx("span",{className:t.count,children:n.count})]},n.value)})})});p.displayName="SegmentedControl";p.__docgenInfo={description:"",methods:[],displayName:"SegmentedControl",props:{options:{required:!0,tsType:{name:"unknown"},description:""},value:{required:!0,tsType:{name:"string"},description:""},onValueChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'toggle' | 'filter'",elements:[{name:"literal",value:"'toggle'"},{name:"literal",value:"'filter'"}]},description:"",defaultValue:{value:"'toggle'",computed:!1}},idPrefix:{required:!1,tsType:{name:"string"},description:""},"aria-label":{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const G=[{value:"write",label:"Write"},{value:"preview",label:"Preview"}],r=e=>{const[s,v]=w.useState(e.value);return a.jsx(p,{...e,value:s,onValueChange:v})},X={title:"Components/SegmentedControl",component:p,tags:["autodocs"],argTypes:{size:{control:"inline-radio",options:["sm","md"]},variant:{control:"inline-radio",options:["toggle","filter"]},value:{control:!1},onValueChange:{control:!1}},args:{options:G,value:"write",size:"md",onValueChange:()=>{},"aria-label":"Editor mode"},parameters:{docs:{description:{component:"A controlled pill toggle for switching between two views of the same content (e.g. Write/Preview). Built on the WAI-ARIA tablist pattern with roving tabindex and arrow-key navigation. Pair it with tabpanels via `idPrefix` + `getSegmentPanelId`. The `filter` variant restyles it for a filter bar — sentence-case labels, an optional `count` per option, and one fixed height (`size` applies to the `toggle` variant only)."}}}},i={render:e=>a.jsx(r,{...e})},c={args:{value:"preview"},render:e=>a.jsx(r,{...e})},d={args:{size:"sm"},render:e=>a.jsx(r,{...e})},m={args:{options:[{value:"write",label:"Write"},{value:"preview",label:"Preview",disabled:!0}]},render:e=>a.jsx(r,{...e})},u={args:{variant:"filter",value:"all","aria-label":"Filter activity",options:[{value:"all",label:"All",count:28},{value:"comments",label:"Comments & Asks",count:4},{value:"system",label:"System",count:24}]},render:e=>a.jsx(r,{...e}),parameters:{docs:{description:{story:'The `filter` variant: sentence-case labels with a count per segment. Counts are plain text inside the button, so a segment announces as "All 28".'}}}},g={args:{variant:"filter",value:"all","aria-label":"Filter activity",options:[{value:"all",label:"All",count:0},{value:"comments",label:"Comments & Asks",count:0},{value:"system",label:"System",count:0}]},render:e=>a.jsx(r,{...e}),parameters:{docs:{description:{story:"A zero shows as `0` and stays selectable — choosing an empty filter is how a consumer reaches its empty state."}}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <Controlled {...args} />
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'preview'
  },
  render: args => <Controlled {...args} />
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm'
  },
  render: args => <Controlled {...args} />
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};const Y=["Default","PreviewActive","Small","WithDisabledOption","ActivityFilter","EmptyCounts"];export{u as ActivityFilter,i as Default,g as EmptyCounts,c as PreviewActive,d as Small,m as WithDisabledOption,Y as __namedExportsOrder,X as default};
