import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as g}from"./iframe-DWZhSDpp.js";import{c as j}from"./cn-2dOUpm6k.js";import"./preload-helper-0qL2cNvf.js";const S="_tablist_10zs2_1",R="_tab_10zs2_1",P="_disabled_10zs2_26",W="_selected_10zs2_26",u={tablist:S,tab:R,disabled:P,selected:W};function z(a,s){return`${a}-tab-${s}`}function B(a,s){return`${a}-panel-${s}`}const T=g.forwardRef(({items:a,value:s,onValueChange:d,idPrefix:o,"aria-label":h,className:_,...D},I)=>{const y=g.useRef([]),k=(e,t)=>{const l=a.length;for(let i=1;i<=l;i++){const A=(e+t*i+l)%l;if(!a[A].disabled)return A}return e},x=()=>{const e=a.findIndex(t=>!t.disabled);return e===-1?-1:e},E=()=>{for(let e=a.length-1;e>=0;e--)if(!a[e].disabled)return e;return-1},c=e=>{if(e<0)return;const t=a[e];y.current[e]?.focus(),t.value!==s&&d(t.value)},C=(e,t)=>{switch(e.key){case"ArrowRight":e.preventDefault(),c(k(t,1));break;case"ArrowLeft":e.preventDefault(),c(k(t,-1));break;case"Home":e.preventDefault(),c(x());break;case"End":e.preventDefault(),c(E());break}},w=a.findIndex(e=>e.value===s),q=w!==-1?w:x();return r.jsx("div",{ref:I,role:"tablist","aria-label":h,"aria-orientation":"horizontal",className:j(u.tablist,_),...D,children:a.map((e,t)=>{const l=t===w;return r.jsx("button",{ref:i=>{y.current[t]=i},type:"button",role:"tab",id:o?z(o,e.value):void 0,"aria-controls":o?B(o,e.value):void 0,"aria-selected":l,disabled:e.disabled,tabIndex:t===q?0:-1,className:j(u.tab,l&&u.selected,e.disabled&&u.disabled),onClick:()=>{e.disabled||e.value!==s&&d(e.value)},onKeyDown:i=>C(i,t),children:e.label},e.value)})})});T.displayName="Tabs";T.__docgenInfo={description:"",methods:[],displayName:"Tabs",props:{items:{required:!0,tsType:{name:"unknown"},description:""},value:{required:!0,tsType:{name:"string"},description:""},onValueChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},idPrefix:{required:!1,tsType:{name:"string"},description:""},"aria-label":{required:!1,tsType:{name:"string"},description:""}},composes:["HTMLAttributes"]};const Q={title:"Components/Tabs",component:T,tags:["autodocs"],parameters:{docs:{description:{component:["Stateless, controlled tablist. Renders only the tab buttons — consumers render the panels based on `value`. Implements WAI-ARIA tablist keyboard pattern (Arrow keys move focus & activate, Home/End jump to first/last, disabled tabs are skipped).","","**The component does not draw a bottom border under the tablist.** The active tab's underline visually merges with whatever bottom border the consumer adds to the wrapping element (a 1px negative margin handles the overlap). See the `WithParentBorder` story."].join(`
`)}}},decorators:[a=>r.jsx("div",{style:{width:"480px",padding:"24px"},children:r.jsx(a,{})})]},L=[{value:"overview",label:"Overview"},{value:"dev",label:"Dev"},{value:"qa",label:"QA"},{value:"activity",label:"Activity"}];function n({items:a,initial:s,ariaLabel:d}){const[o,h]=g.useState(s);return r.jsx(T,{items:a,value:o,onValueChange:h,"aria-label":d})}const v={render:()=>r.jsx(n,{items:L,initial:"overview",ariaLabel:"Ticket sections"})},b={render:()=>r.jsx("div",{style:{borderBottom:"1px solid var(--ds-color-border-default)"},children:r.jsx(n,{items:L,initial:"overview",ariaLabel:"Ticket sections"})})},p={render:()=>r.jsx(n,{items:[{value:"overview",label:"Overview"},{value:"dev",label:"Dev"},{value:"qa",label:"QA",disabled:!0},{value:"activity",label:"Activity"}],initial:"overview",ariaLabel:"Ticket sections"})},m={render:()=>r.jsx(n,{items:[{value:"active",label:"Active"},{value:"archived",label:"Archived"}],initial:"active",ariaLabel:"Task lists"})},f={render:()=>r.jsx(n,{items:[{value:"overview",label:"Project overview"},{value:"env",label:"Environments and infrastructure"},{value:"audit",label:"Audit log"}],initial:"overview",ariaLabel:"Project sections"})};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledTabs items={ticketTabs} initial="overview" ariaLabel="Ticket sections" />
}`,...v.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    borderBottom: '1px solid var(--ds-color-border-default)'
  }}>
      <ControlledTabs items={ticketTabs} initial="overview" ariaLabel="Ticket sections" />
    </div>
}`,...b.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledTabs items={[{
    value: 'overview',
    label: 'Overview'
  }, {
    value: 'dev',
    label: 'Dev'
  }, {
    value: 'qa',
    label: 'QA',
    disabled: true
  }, {
    value: 'activity',
    label: 'Activity'
  }]} initial="overview" ariaLabel="Ticket sections" />
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledTabs items={[{
    value: 'active',
    label: 'Active'
  }, {
    value: 'archived',
    label: 'Archived'
  }]} initial="active" ariaLabel="Task lists" />
}`,...m.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledTabs items={[{
    value: 'overview',
    label: 'Project overview'
  }, {
    value: 'env',
    label: 'Environments and infrastructure'
  }, {
    value: 'audit',
    label: 'Audit log'
  }]} initial="overview" ariaLabel="Project sections" />
}`,...f.parameters?.docs?.source}}};const K=["Default","WithParentBorder","WithDisabledTab","TwoTabs","LongLabels"];export{v as Default,f as LongLabels,m as TwoTabs,p as WithDisabledTab,b as WithParentBorder,K as __namedExportsOrder,Q as default};
