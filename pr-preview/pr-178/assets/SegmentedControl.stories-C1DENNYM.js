import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as b}from"./iframe-Nhq1Mera.js";import{c as v}from"./cn-2dOUpm6k.js";import{u as x}from"./useRovingTabList-E0kHTAJu.js";import"./preload-helper-E4FfwnB_.js";import"./rovingIndex-BLt4otwy.js";const z="_segmented_1mz21_1",P="_segment_1mz21_1",j="_md_1mz21_25",T="_sm_1mz21_30",I="_disabled_1mz21_35",W="_selected_1mz21_35",s={segmented:z,segment:P,md:j,sm:T,disabled:I,selected:W};function q(e,r){return`${e}-segment-${r}`}function A(e,r){return`${e}-panel-${r}`}const m=b.forwardRef(({options:e,value:r,onValueChange:u,size:w="md",idPrefix:n,"aria-label":_,className:f,...h},y)=>{const{selectedIndex:C,getTabProps:S}=x(e,r,u);return t.jsx("div",{ref:y,role:"tablist","aria-label":_,"aria-orientation":"horizontal",className:v(s.segmented,s[w],f),...h,children:e.map((a,p)=>{const g=p===C;return t.jsx("button",{type:"button",role:"tab",id:n?q(n,a.value):void 0,"aria-controls":g&&n?A(n,a.value):void 0,className:v(s.segment,g&&s.selected,a.disabled&&s.disabled),...S(p),children:a.label},a.value)})})});m.displayName="SegmentedControl";m.__docgenInfo={description:"",methods:[],displayName:"SegmentedControl",props:{options:{required:!0,tsType:{name:"unknown"},description:""},value:{required:!0,tsType:{name:"string"},description:""},onValueChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},idPrefix:{required:!1,tsType:{name:"string"},description:""},"aria-label":{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const V=[{value:"write",label:"Write"},{value:"preview",label:"Preview"}],c=e=>{const[r,u]=b.useState(e.value);return t.jsx(m,{...e,value:r,onValueChange:u})},k={title:"Components/SegmentedControl",component:m,tags:["autodocs"],argTypes:{size:{control:"inline-radio",options:["sm","md"]},value:{control:!1},onValueChange:{control:!1}},args:{options:V,value:"write",size:"md",onValueChange:()=>{},"aria-label":"Editor mode"},parameters:{docs:{description:{component:"A controlled pill toggle for switching between two views of the same content (e.g. Write/Preview). Built on the WAI-ARIA tablist pattern with roving tabindex and arrow-key navigation. Pair it with tabpanels via `idPrefix` + `getSegmentPanelId`."}}}},o={render:e=>t.jsx(c,{...e})},i={args:{value:"preview"},render:e=>t.jsx(c,{...e})},l={args:{size:"sm"},render:e=>t.jsx(c,{...e})},d={args:{options:[{value:"write",label:"Write"},{value:"preview",label:"Preview",disabled:!0}]},render:e=>t.jsx(c,{...e})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <Controlled {...args} />
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'preview'
  },
  render: args => <Controlled {...args} />
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm'
  },
  render: args => <Controlled {...args} />
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};const B=["Default","PreviewActive","Small","WithDisabledOption"];export{o as Default,i as PreviewActive,l as Small,d as WithDisabledOption,B as __namedExportsOrder,k as default};
