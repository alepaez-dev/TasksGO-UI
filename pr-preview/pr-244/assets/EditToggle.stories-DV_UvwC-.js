import{j as o}from"./jsx-runtime-u17CrQMm.js";import{r as i}from"./iframe-BYq1w_Z-.js";import{E as n}from"./EditToggle-CHpbO1ld.js";import"./preload-helper-B5V5mqQ5.js";import"./cn-2dOUpm6k.js";import"./Icon-CWRBXoNK.js";const E={title:"Components/EditToggle",component:n,parameters:{layout:"centered"}};function d(){const[s,a]=i.useState(!1);return o.jsx(n,{editing:s,onEditingChange:a})}const e={render:()=>o.jsx(d,{})},r={render:()=>o.jsx(n,{editing:!0,onEditingChange:()=>{}})},t={render:()=>o.jsx(n,{editing:!1,onEditingChange:()=>{},disabled:!0})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled />
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <EditToggle editing onEditingChange={() => {}} />
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <EditToggle editing={false} onEditingChange={() => {}} disabled />
}`,...t.parameters?.docs?.source}}};const f=["Default","Editing","Disabled"];export{e as Default,t as Disabled,r as Editing,f as __namedExportsOrder,E as default};
