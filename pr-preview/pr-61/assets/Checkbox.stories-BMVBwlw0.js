import{j as e}from"./jsx-runtime-u17CrQMm.js";import{C as a}from"./Checkbox-3pXswIS8.js";import"./iframe-Bq0yMram.js";import"./preload-helper-DRu9V-mC.js";import"./cn-2dOUpm6k.js";const m={title:"Components/Checkbox",component:a,tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","completed"]},checked:{control:"boolean"},disabled:{control:"boolean"},"aria-label":{control:"text"}},args:{"aria-label":"Toggle task"}},r={},s={args:{checked:!0,onChange:()=>{}}},t={args:{variant:"completed",checked:!0,onChange:()=>{}}},o={args:{disabled:!0}},c={render:()=>e.jsxs("div",{style:{display:"flex",gap:"var(--ds-space-scale-md)",alignItems:"center"},children:[e.jsx(a,{"aria-label":"Unchecked task"}),e.jsx(a,{"aria-label":"Active task",checked:!0,onChange:()=>{}}),e.jsx(a,{"aria-label":"Completed task",variant:"completed",checked:!0,onChange:()=>{}}),e.jsx(a,{"aria-label":"Disabled task",disabled:!0})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    checked: true,
    onChange: () => {}
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'completed',
    checked: true,
    onChange: () => {}
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 'var(--ds-space-scale-md)',
    alignItems: 'center'
  }}>
      <Checkbox aria-label="Unchecked task" />
      <Checkbox aria-label="Active task" checked onChange={() => {}} />
      <Checkbox aria-label="Completed task" variant="completed" checked onChange={() => {}} />
      <Checkbox aria-label="Disabled task" disabled />
    </div>
}`,...c.parameters?.docs?.source}}};const u=["Default","Checked","Completed","Disabled","AllVariants"];export{c as AllVariants,s as Checked,t as Completed,r as Default,o as Disabled,u as __namedExportsOrder,m as default};
