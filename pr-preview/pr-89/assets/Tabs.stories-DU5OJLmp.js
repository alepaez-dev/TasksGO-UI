import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as g}from"./iframe-DkfXeFRW.js";import{c as L}from"./cn-2dOUpm6k.js";import"./preload-helper-wuZ2h0jk.js";const P="_tablist_10zs2_1",W="_tab_10zs2_1",z="_disabled_10zs2_26",B="_selected_10zs2_26",b={tablist:P,tab:W,disabled:z,selected:B};function N(a,s){return`${a}-tab-${s}`}function O(a,s){return`${a}-panel-${s}`}const h=g.forwardRef(({items:a,value:s,onValueChange:d,idPrefix:o,"aria-label":w,className:D,...I},E)=>{const y=g.useRef([]),x=(e,t)=>{const l=a.length;for(let i=1;i<=l;i++){const j=(e+t*i+l)%l;if(!a[j].disabled)return j}return e},k=()=>{const e=a.findIndex(t=>!t.disabled);return e===-1?-1:e},C=()=>{for(let e=a.length-1;e>=0;e--)if(!a[e].disabled)return e;return-1},c=e=>{if(e<0)return;const t=a[e];y.current[e]?.focus(),t.value!==s&&d(t.value)},q=(e,t)=>{switch(e.key){case"ArrowRight":e.preventDefault(),c(x(t,1));break;case"ArrowLeft":e.preventDefault(),c(x(t,-1));break;case"Home":e.preventDefault(),c(k());break;case"End":e.preventDefault(),c(C());break}},v=a.findIndex(e=>e.value===s),A=v!==-1&&!a[v].disabled,S=A?v:-1,R=A?v:k();return r.jsx("div",{ref:E,role:"tablist","aria-label":w,"aria-orientation":"horizontal",className:L(b.tablist,D),...I,children:a.map((e,t)=>{const l=t===S;return r.jsx("button",{ref:i=>{y.current[t]=i},type:"button",role:"tab",id:o?N(o,e.value):void 0,"aria-controls":o?O(o,e.value):void 0,"aria-selected":l,disabled:e.disabled,tabIndex:t===R?0:-1,className:L(b.tab,l&&b.selected,e.disabled&&b.disabled),onClick:()=>{e.disabled||e.value!==s&&d(e.value)},onKeyDown:i=>q(i,t),children:e.label},e.value)})})});h.displayName="Tabs";h.__docgenInfo={description:"",methods:[],displayName:"Tabs",props:{items:{required:!0,tsType:{name:"unknown"},description:""},value:{required:!0,tsType:{name:"string"},description:""},onValueChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},idPrefix:{required:!1,tsType:{name:"string"},description:""},"aria-label":{required:!1,tsType:{name:"string"},description:""}},composes:["HTMLAttributes"]};const M={title:"Components/Tabs",component:h,tags:["autodocs"],parameters:{docs:{description:{component:["Stateless, controlled tablist. Renders only the tab buttons — consumers render the panels based on `value`. Implements WAI-ARIA tablist keyboard pattern (Arrow keys move focus & activate, Home/End jump to first/last, disabled tabs are skipped).","","**The component does not draw a bottom border under the tablist.** The active tab's underline visually merges with whatever bottom border the consumer adds to the wrapping element (a 1px negative margin handles the overlap). See the `WithParentBorder` story."].join(`
`)}}},decorators:[a=>r.jsx("div",{style:{width:"480px",padding:"24px"},children:r.jsx(a,{})})]},_=[{value:"overview",label:"Overview"},{value:"dev",label:"Dev"},{value:"qa",label:"QA"},{value:"activity",label:"Activity"}];function n({items:a,initial:s,ariaLabel:d}){const[o,w]=g.useState(s);return r.jsx(h,{items:a,value:o,onValueChange:w,"aria-label":d})}const u={render:()=>r.jsx(n,{items:_,initial:"overview",ariaLabel:"Ticket sections"})},p={render:()=>r.jsx("div",{style:{borderBottom:"1px solid var(--ds-color-border-default)"},children:r.jsx(n,{items:_,initial:"overview",ariaLabel:"Ticket sections"})})},m={render:()=>r.jsx(n,{items:[{value:"overview",label:"Overview"},{value:"dev",label:"Dev"},{value:"qa",label:"QA",disabled:!0},{value:"activity",label:"Activity"}],initial:"overview",ariaLabel:"Ticket sections"})},f={render:()=>r.jsx(n,{items:[{value:"active",label:"Active"},{value:"archived",label:"Archived"}],initial:"active",ariaLabel:"Task lists"})},T={render:()=>r.jsx(n,{items:[{value:"overview",label:"Project overview"},{value:"env",label:"Environments and infrastructure"},{value:"audit",label:"Audit log"}],initial:"overview",ariaLabel:"Project sections"})};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledTabs items={ticketTabs} initial="overview" ariaLabel="Ticket sections" />
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    borderBottom: '1px solid var(--ds-color-border-default)'
  }}>
      <ControlledTabs items={ticketTabs} initial="overview" ariaLabel="Ticket sections" />
    </div>
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledTabs items={[{
    value: 'active',
    label: 'Active'
  }, {
    value: 'archived',
    label: 'Archived'
  }]} initial="active" ariaLabel="Task lists" />
}`,...f.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};const F=["Default","WithParentBorder","WithDisabledTab","TwoTabs","LongLabels"];export{u as Default,T as LongLabels,f as TwoTabs,m as WithDisabledTab,p as WithParentBorder,F as __namedExportsOrder,M as default};
