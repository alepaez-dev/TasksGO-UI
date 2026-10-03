import{j as e}from"./jsx-runtime-u17CrQMm.js";import{B as a,s as v}from"./Badge-BQf8SRq1.js";import"./iframe-BAQvXxpj.js";import"./preload-helper-BztvBPQH.js";import"./cn-2dOUpm6k.js";const y={title:"Components/Badge",component:a,tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","progress","todo","done","high","critical","success","waived","reference","count","previous"],description:'Visual style. Status variants (progress/todo/done/high/critical/success/waived) tint the badge by state; "reference" is a mono-styled chip for technical reference values like version IDs, build numbers, or short hashes; "count" is a neutral mono tally for numbers and fractions (e.g. 37, 2/13); "previous" is the struck-through left half of a value change, drained of colour so the new value carries it; it also prefixes a visually hidden "was" for assistive tech, so pass the bare value.'},children:{control:"text"}},args:{children:"v4.1.0-alpha"}},r={},s={args:{variant:"previous",children:"To Do"},parameters:{docs:{description:{story:'The superseded half of a value change. Carries no status colour — a previous "To Do", "Medium" and "Blocked" all look alike, because the colour belongs to the new value. Strike-through is visual only, so the badge also announces "was" to assistive tech.'}}}},n={render:()=>e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"var(--ds-space-scale-sm)",fontFamily:"var(--ds-font-family-sans)",fontSize:"var(--ds-text-timeline-event-font-size)",color:"var(--ds-color-text-secondary)"},children:["changed status ",e.jsx(a,{variant:"previous",children:"To Do"})," ",e.jsx("span",{"aria-hidden":"true",children:"→"}),e.jsx("span",{className:v.srOnly,children:"to"})," ",e.jsx(a,{variant:"progress",children:"In Progress"})]}),parameters:{docs:{description:{story:'How the pair reads in a feed row. The arrow and the sentence belong to the page — Badge renders one chip. The arrow is decorative, so the page supplies a hidden "to" beside it: a screen reader hears "changed status was To Do to In Progress".'}}}},o={args:{variant:"progress",children:"In Progress"}},t={args:{variant:"todo",children:"To Do"}},i={args:{variant:"done",children:"Done"}},c={args:{variant:"high",children:"High Prio"}},d={args:{variant:"critical",children:"1 Failed"}},l={args:{variant:"success",children:"4/4 Passed"}},p={args:{variant:"waived",children:"Waived"}},g={args:{variant:"reference",children:"v4.1.0-alpha"}},h={parameters:{controls:{disable:!0},docs:{description:{story:'A neutral mono tally for numbers (`37`) and fractions (`2/13`). Dumb container — pass the content as children; the badge only supplies the look. A bare fraction is ambiguous to a screen reader; to give it a spoken label, pass `role="img"` alongside `aria-label` (`aria-label` alone is prohibited on a plain span). See the third example below.'}}},render:()=>e.jsxs("div",{style:{display:"flex",gap:"var(--ds-space-scale-sm)",alignItems:"center"},children:[e.jsx(a,{variant:"count",children:"37"}),e.jsx(a,{variant:"count",children:"2/13"}),e.jsx(a,{variant:"count",role:"img","aria-label":"2 of 13 checks passing",children:"2/13"})]})},u={render:()=>e.jsxs("div",{style:{display:"flex",gap:"var(--ds-space-scale-sm)",alignItems:"center"},children:[e.jsx(a,{children:"v4.1.0-alpha"}),e.jsx(a,{variant:"progress",children:"In Progress"}),e.jsx(a,{variant:"todo",children:"To Do"}),e.jsx(a,{variant:"done",children:"Done"}),e.jsx(a,{variant:"high",children:"High Prio"}),e.jsx(a,{variant:"critical",children:"1 Failed"}),e.jsx(a,{variant:"success",children:"4/4 Passed"}),e.jsx(a,{variant:"waived",children:"Waived"}),e.jsx(a,{variant:"reference",children:"v4.1.0-alpha"}),e.jsx(a,{variant:"count",children:"37"}),e.jsx(a,{variant:"count",children:"2/13"}),e.jsx(a,{variant:"previous",children:"To Do"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'previous',
    children: 'To Do'
  },
  parameters: {
    docs: {
      description: {
        story: 'The superseded half of a value change. Carries no status colour — a previous "To Do", "Medium" and "Blocked" all look alike, because the colour belongs to the new value. Strike-through is visual only, so the badge also announces "was" to assistive tech.'
      }
    }
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--ds-space-scale-sm)',
    fontFamily: 'var(--ds-font-family-sans)',
    fontSize: 'var(--ds-text-timeline-event-font-size)',
    color: 'var(--ds-color-text-secondary)'
  }}>
      changed status <Badge variant="previous">To Do</Badge>{' '}
      <span aria-hidden="true">→</span>
      <span className={styles.srOnly}>to</span>{' '}
      <Badge variant="progress">In Progress</Badge>
    </span>,
  parameters: {
    docs: {
      description: {
        story: 'How the pair reads in a feed row. The arrow and the sentence belong to the page — Badge renders one chip. The arrow is decorative, so the page supplies a hidden "to" beside it: a screen reader hears "changed status was To Do to In Progress".'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'progress',
    children: 'In Progress'
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'todo',
    children: 'To Do'
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'done',
    children: 'Done'
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'high',
    children: 'High Prio'
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'critical',
    children: '1 Failed'
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: '4/4 Passed'
  }
}`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'waived',
    children: 'Waived'
  }
}`,...p.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'reference',
    children: 'v4.1.0-alpha'
  }
}`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
      <Badge variant="waived">Waived</Badge>
      <Badge variant="reference">v4.1.0-alpha</Badge>
      <Badge variant="count">37</Badge>
      <Badge variant="count">2/13</Badge>
      <Badge variant="previous">To Do</Badge>
    </div>
}`,...u.parameters?.docs?.source}}};const D=["Default","Previous","StatusChange","Progress","Todo","Done","High","Critical","Success","Waived","Reference","Count","AllVariants"];export{u as AllVariants,h as Count,d as Critical,r as Default,i as Done,c as High,s as Previous,o as Progress,g as Reference,n as StatusChange,l as Success,t as Todo,p as Waived,D as __namedExportsOrder,y as default};
