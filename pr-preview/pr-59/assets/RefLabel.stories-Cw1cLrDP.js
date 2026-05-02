import{j as e}from"./jsx-runtime-u17CrQMm.js";import{R as a}from"./RefLabel-D7FJd8SG.js";import"./iframe-C1igReHY.js";import"./preload-helper-KfmS1-JQ.js";import"./cn-2dOUpm6k.js";import"./Icon-PwFSjkIY.js";const p={title:"Components/RefLabel",component:a,tags:["autodocs"],argTypes:{variant:{control:"select",options:["attachment","doc","general"]},icon:{control:"text"},children:{control:"text"}},args:{children:"INCIDENT ARTIFACT"}},r={},t={args:{variant:"attachment",icon:"link",children:"ARCHITECTURE-SPEC-V2.MD"}},n={args:{variant:"doc",children:"DR-PLAN-2024.MD"}},c={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-scale-sm)"},children:[e.jsx(a,{variant:"attachment",icon:"link",children:"ARCHITECTURE-SPEC-V2.MD"}),e.jsx(a,{variant:"attachment",icon:"attachment",children:"IAM-POLICY-DRAFT.JSON"}),e.jsx(a,{variant:"doc",children:"DR-PLAN-2024.MD"}),e.jsx(a,{children:"INCIDENT ARTIFACT"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'attachment',
    icon: 'link',
    children: 'ARCHITECTURE-SPEC-V2.MD'
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'doc',
    children: 'DR-PLAN-2024.MD'
  }
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-space-scale-sm)'
  }}>
      <RefLabel variant="attachment" icon="link">
        ARCHITECTURE-SPEC-V2.MD
      </RefLabel>
      <RefLabel variant="attachment" icon="attachment">
        IAM-POLICY-DRAFT.JSON
      </RefLabel>
      <RefLabel variant="doc">DR-PLAN-2024.MD</RefLabel>
      <RefLabel>INCIDENT ARTIFACT</RefLabel>
    </div>
}`,...c.parameters?.docs?.source}}};const R=["Default","Attachment","Doc","AllVariants"];export{c as AllVariants,t as Attachment,r as Default,n as Doc,R as __namedExportsOrder,p as default};
