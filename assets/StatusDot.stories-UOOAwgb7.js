import{j as a}from"./jsx-runtime-u17CrQMm.js";import{S as t}from"./StatusDot-CA8-CjT6.js";import"./iframe-D9Itj8Qf.js";import"./preload-helper-CyvMmb0J.js";import"./cn-2dOUpm6k.js";const n={title:"Components/StatusDot",component:t,tags:["autodocs"],argTypes:{variant:{control:"select",options:["active","critical","high","medium","low","info"]},label:{control:"text"}},args:{label:"Active"}},e={},r={render:()=>a.jsxs("div",{style:{display:"flex",gap:"var(--ds-space-scale-sm)",alignItems:"center"},children:[a.jsx(t,{variant:"active",label:"Active"}),a.jsx(t,{variant:"critical",label:"Critical"}),a.jsx(t,{variant:"high",label:"High"}),a.jsx(t,{variant:"medium",label:"Medium"}),a.jsx(t,{variant:"low",label:"Low"}),a.jsx(t,{variant:"info",label:"Info"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"{}",...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 'var(--ds-space-scale-sm)',
    alignItems: 'center'
  }}>
      <StatusDot variant="active" label="Active" />
      <StatusDot variant="critical" label="Critical" />
      <StatusDot variant="high" label="High" />
      <StatusDot variant="medium" label="Medium" />
      <StatusDot variant="low" label="Low" />
      <StatusDot variant="info" label="Info" />
    </div>
}`,...r.parameters?.docs?.source}}};const m=["Default","AllVariants"];export{r as AllVariants,e as Default,m as __namedExportsOrder,n as default};
