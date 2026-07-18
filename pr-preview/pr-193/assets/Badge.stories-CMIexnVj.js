import{j as e}from"./jsx-runtime-u17CrQMm.js";import{B as a}from"./Badge-Dp7PKPHS.js";import"./iframe-CQaOaPYd.js";import"./preload-helper-CLN-MjG3.js";import"./cn-2dOUpm6k.js";const f={title:"Components/Badge",component:a,tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","progress","todo","done","high","critical","success","reference","count"],description:'Visual style. Status variants (progress/todo/done/high/critical/success) tint the badge by state; "reference" is a mono-styled chip for technical reference values like version IDs, build numbers, or short hashes; "count" is a neutral mono tally for numbers and fractions (e.g. 37, 2/13).'},children:{control:"text"}},args:{children:"v4.1.0-alpha"}},r={},s={args:{variant:"progress",children:"In Progress"}},n={args:{variant:"todo",children:"To Do"}},o={args:{variant:"done",children:"Done"}},t={args:{variant:"high",children:"High Prio"}},i={args:{variant:"critical",children:"1 Failed"}},c={args:{variant:"success",children:"4/4 Passed"}},d={args:{variant:"reference",children:"v4.1.0-alpha"}},l={parameters:{controls:{disable:!0},docs:{description:{story:'A neutral mono tally for numbers (`37`) and fractions (`2/13`). Dumb container — pass the content as children; the badge only supplies the look. A bare fraction is ambiguous to a screen reader; to give it a spoken label, pass `role="img"` alongside `aria-label` (`aria-label` alone is prohibited on a plain span). See the third example below.'}}},render:()=>e.jsxs("div",{style:{display:"flex",gap:"var(--ds-space-scale-sm)",alignItems:"center"},children:[e.jsx(a,{variant:"count",children:"37"}),e.jsx(a,{variant:"count",children:"2/13"}),e.jsx(a,{variant:"count",role:"img","aria-label":"2 of 13 checks passing",children:"2/13"})]})},g={render:()=>e.jsxs("div",{style:{display:"flex",gap:"var(--ds-space-scale-sm)",alignItems:"center"},children:[e.jsx(a,{children:"v4.1.0-alpha"}),e.jsx(a,{variant:"progress",children:"In Progress"}),e.jsx(a,{variant:"todo",children:"To Do"}),e.jsx(a,{variant:"done",children:"Done"}),e.jsx(a,{variant:"high",children:"High Prio"}),e.jsx(a,{variant:"critical",children:"1 Failed"}),e.jsx(a,{variant:"success",children:"4/4 Passed"}),e.jsx(a,{variant:"reference",children:"v4.1.0-alpha"}),e.jsx(a,{variant:"count",children:"37"}),e.jsx(a,{variant:"count",children:"2/13"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'progress',
    children: 'In Progress'
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'todo',
    children: 'To Do'
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'done',
    children: 'Done'
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'high',
    children: 'High Prio'
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'critical',
    children: '1 Failed'
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: '4/4 Passed'
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'reference',
    children: 'v4.1.0-alpha'
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      description: {
        story: 'A neutral mono tally for numbers (\`37\`) and fractions (\`2/13\`). Dumb container — pass the content as children; the badge only supplies the look. A bare fraction is ambiguous to a screen reader; to give it a spoken label, pass \`role="img"\` alongside \`aria-label\` (\`aria-label\` alone is prohibited on a plain span). See the third example below.'
      }
    }
  },
  render: () => <div style={{
    display: 'flex',
    gap: 'var(--ds-space-scale-sm)',
    alignItems: 'center'
  }}>
      <Badge variant="count">37</Badge>
      <Badge variant="count">2/13</Badge>
      <Badge variant="count" role="img" aria-label="2 of 13 checks passing">
        2/13
      </Badge>
    </div>
}`,...l.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 'var(--ds-space-scale-sm)',
    alignItems: 'center'
  }}>
      <Badge>v4.1.0-alpha</Badge>
      <Badge variant="progress">In Progress</Badge>
      <Badge variant="todo">To Do</Badge>
      <Badge variant="done">Done</Badge>
      <Badge variant="high">High Prio</Badge>
      <Badge variant="critical">1 Failed</Badge>
      <Badge variant="success">4/4 Passed</Badge>
      <Badge variant="reference">v4.1.0-alpha</Badge>
      <Badge variant="count">37</Badge>
      <Badge variant="count">2/13</Badge>
    </div>
}`,...g.parameters?.docs?.source}}};const b=["Default","Progress","Todo","Done","High","Critical","Success","Reference","Count","AllVariants"];export{g as AllVariants,l as Count,i as Critical,r as Default,o as Done,t as High,s as Progress,d as Reference,c as Success,n as Todo,b as __namedExportsOrder,f as default};
