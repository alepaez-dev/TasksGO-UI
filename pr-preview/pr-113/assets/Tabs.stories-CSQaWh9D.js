import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as m}from"./iframe-D5lvGuty.js";import{T as n}from"./Tabs-DJfLOKDY.js";import"./preload-helper-LDNDuAwT.js";import"./cn-2dOUpm6k.js";const j={title:"Components/Tabs",component:n,tags:["autodocs"],parameters:{docs:{description:{component:["Stateless, controlled tablist. Renders only the tab buttons — consumers render the panels based on `value`. Implements WAI-ARIA tablist keyboard pattern (Arrow keys move focus & activate, Home/End jump to first/last, disabled tabs are skipped).","","**The component does not draw a bottom border under the tablist.** The active tab's underline visually merges with whatever bottom border the consumer adds to the wrapping element (a 1px negative margin handles the overlap). See the `WithParentBorder` story."].join(`
`)}}},decorators:[l=>e.jsx("div",{style:{width:"480px",padding:"24px"},children:e.jsx(l,{})})]},v=[{value:"overview",label:"Overview"},{value:"dev",label:"Dev"},{value:"qa",label:"QA"},{value:"activity",label:"Activity"}];function a({items:l,initial:c,ariaLabel:d}){const[b,u]=m.useState(c);return e.jsx(n,{items:l,value:b,onValueChange:u,"aria-label":d})}const r={render:()=>e.jsx(a,{items:v,initial:"overview",ariaLabel:"Ticket sections"})},t={render:()=>e.jsx("div",{style:{borderBottom:"1px solid var(--ds-color-border-default)"},children:e.jsx(a,{items:v,initial:"overview",ariaLabel:"Ticket sections"})})},i={render:()=>e.jsx(a,{items:[{value:"overview",label:"Overview"},{value:"dev",label:"Dev"},{value:"qa",label:"QA",disabled:!0},{value:"activity",label:"Activity"}],initial:"overview",ariaLabel:"Ticket sections"})},s={render:()=>e.jsx(a,{items:[{value:"active",label:"Active"},{value:"archived",label:"Archived"}],initial:"active",ariaLabel:"Task lists"})},o={render:()=>e.jsx(a,{items:[{value:"overview",label:"Project overview"},{value:"env",label:"Environments and infrastructure"},{value:"audit",label:"Audit log"}],initial:"overview",ariaLabel:"Project sections"})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledTabs items={ticketTabs} initial="overview" ariaLabel="Ticket sections" />
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    borderBottom: '1px solid var(--ds-color-border-default)'
  }}>
      <ControlledTabs items={ticketTabs} initial="overview" ariaLabel="Ticket sections" />
    </div>
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledTabs items={[{
    value: 'active',
    label: 'Active'
  }, {
    value: 'archived',
    label: 'Archived'
  }]} initial="active" ariaLabel="Task lists" />
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};const A=["Default","WithParentBorder","WithDisabledTab","TwoTabs","LongLabels"];export{r as Default,o as LongLabels,s as TwoTabs,i as WithDisabledTab,t as WithParentBorder,A as __namedExportsOrder,j as default};
