import{j as e}from"./jsx-runtime-u17CrQMm.js";import{C as s}from"./CollapsibleCard-CAq4oIAM.js";import{C as a}from"./ChecklistRow-BhJBrZEV.js";import{I as m}from"./Icon-By1nY6F7.js";import{B as l}from"./Badge-D-tZR_ga.js";import"./iframe-DuEw4TR2.js";import"./preload-helper-CyvMmb0J.js";import"./cn-2dOUpm6k.js";const w={title:"Components/CollapsibleCard",component:s,tags:["autodocs"],parameters:{docs:{description:{component:"A card surface with a clickable header that toggles a body panel. Built on the native `<details>`/`<summary>` element — disclosure state is browser-managed, keyboard activation (Enter/Space) works for free, and screen readers announce the expanded/collapsed state without extra ARIA. Pass `defaultOpen` to set the initial state. Disclosure is uncontrolled by design; for a fully controlled card, render your own `<details>` with `open` + `onToggle`."}}},argTypes:{variant:{control:"select",options:["default","subtle"]}},decorators:[p=>e.jsx("div",{style:{width:"640px",padding:"24px"},children:e.jsx(p,{})})]},t={render:()=>e.jsx(s,{header:"Scenarios Checklist",children:e.jsx("div",{style:{padding:"0 var(--ds-space-scale-md)"},children:e.jsx("p",{children:"Click the header to expand and see the contents."})})})},i={parameters:{docs:{description:{story:"CollapsibleCard intentionally leaves horizontal padding to the consumer so children like `ChecklistRow` can render edge-to-edge. For prose bodies, wrap the content in a padded container as shown here."}}},render:()=>e.jsx(s,{header:"Scenarios Checklist",defaultOpen:!0,children:e.jsx("div",{style:{padding:"0 var(--ds-space-scale-md)"},children:e.jsx("p",{children:"This card starts in the open state via the `defaultOpen` prop."})})})},c=(p,h)=>e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"var(--ds-space-scale-sm)"},children:[e.jsx("strong",{children:"Scenarios Checklist"}),p,e.jsx("span",{"aria-hidden":"true",style:{width:"1px",height:"14px",backgroundColor:"var(--ds-color-border-default)"}}),e.jsx(m,{name:"schedule",size:"sm",style:{color:"var(--ds-color-text-secondary)"}}),e.jsx("span",{style:{fontFamily:"var(--ds-text-metadata-font-family)",fontSize:"var(--ds-text-metadata-font-size)",color:"var(--ds-color-text-secondary)"},children:h})]}),r={parameters:{docs:{description:{story:"Full QA Summary composition: a rich header (title + critical badge + vertical separator + clock icon + meta) above a stack of ChecklistRows. Rows fill the card width edge-to-edge — the consumer is responsible for any per-row padding (ChecklistRow already provides it)."}}},render:()=>e.jsxs(s,{defaultOpen:!0,header:c(e.jsx(l,{variant:"critical",children:"1 Failed"}),"Last checked 2h ago"),children:[e.jsx(a,{status:"passed",label:"Cache hit ratio check on US-East-1 staging",meta:"Verified by JD",onClick:()=>{}}),e.jsx(a,{status:"failed",label:"Invalidation latency under 200ms",meta:e.jsx("span",{style:{color:"var(--ds-color-status-critical)",fontWeight:700},children:"FAILED"}),onClick:()=>{}}),e.jsx(a,{status:"pending",label:"Browser-side TTL override persistence",meta:"Not verified",onClick:()=>{}}),e.jsx(a,{status:"passed",label:"WAF integration compatibility",meta:"Verified by JD",onClick:()=>{}})]})},o={parameters:{docs:{description:{story:"All scenarios passed: header uses the green `success` Badge variant, all rows show a passed status."}}},render:()=>e.jsxs(s,{defaultOpen:!0,header:c(e.jsx(l,{variant:"success",children:"4/4 Passed"}),"Verified 5m ago"),children:[e.jsx(a,{status:"passed",label:"Cache hit ratio check on US-East-1 staging",meta:"Verified by JD",onClick:()=>{}}),e.jsx(a,{status:"passed",label:"Invalidation latency under 200ms",meta:"Verified by JD",onClick:()=>{}}),e.jsx(a,{status:"passed",label:"Browser-side TTL override persistence",meta:"Verified by AM",onClick:()=>{}}),e.jsx(a,{status:"passed",label:"WAF integration compatibility",meta:"Verified by JD",onClick:()=>{}})]})},d={parameters:{docs:{description:{story:"Partial verification: header uses the gray `todo` Badge variant; rows mix passed and pending statuses."}}},render:()=>e.jsxs(s,{defaultOpen:!0,header:c(e.jsx(l,{variant:"todo",children:"2/4 Verified"}),"Last verified 30m ago"),children:[e.jsx(a,{status:"passed",label:"Cache hit ratio check on US-East-1 staging",meta:"Verified by JD",onClick:()=>{}}),e.jsx(a,{status:"pending",label:"Invalidation latency under 200ms",meta:"Not verified",onClick:()=>{}}),e.jsx(a,{status:"pending",label:"Browser-side TTL override persistence",meta:"Not verified",onClick:()=>{}}),e.jsx(a,{status:"passed",label:"WAF integration compatibility",meta:"Verified by JD",onClick:()=>{}})]})},n={parameters:{docs:{description:{story:"No scenarios verified yet: header uses the gray `todo` Badge variant and the meta shows that testing is still underway. All rows are pending."}}},render:()=>e.jsxs(s,{defaultOpen:!0,header:c(e.jsx(l,{variant:"todo",children:"0/4 Verified"}),"Testing in Progress"),children:[e.jsx(a,{status:"pending",label:"Cache hit ratio check on US-East-1 staging",meta:"Not verified",onClick:()=>{}}),e.jsx(a,{status:"pending",label:"Invalidation latency under 200ms",meta:"Not verified",onClick:()=>{}}),e.jsx(a,{status:"pending",label:"Browser-side TTL override persistence",meta:"Not verified",onClick:()=>{}}),e.jsx(a,{status:"pending",label:"WAF integration compatibility",meta:"Not verified",onClick:()=>{}})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <CollapsibleCard header="Scenarios Checklist">
      <div style={{
      padding: '0 var(--ds-space-scale-md)'
    }}>
        <p>Click the header to expand and see the contents.</p>
      </div>
    </CollapsibleCard>
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'CollapsibleCard intentionally leaves horizontal padding to the consumer so children like \`ChecklistRow\` can render edge-to-edge. For prose bodies, wrap the content in a padded container as shown here.'
      }
    }
  },
  render: () => <CollapsibleCard header="Scenarios Checklist" defaultOpen>
      <div style={{
      padding: '0 var(--ds-space-scale-md)'
    }}>
        <p>This card starts in the open state via the \`defaultOpen\` prop.</p>
      </div>
    </CollapsibleCard>
}`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Full QA Summary composition: a rich header (title + critical badge + vertical separator + clock icon + meta) above a stack of ChecklistRows. Rows fill the card width edge-to-edge — the consumer is responsible for any per-row padding (ChecklistRow already provides it).'
      }
    }
  },
  render: () => <CollapsibleCard defaultOpen header={headerWithBadge(<Badge variant="critical">1 Failed</Badge>, 'Last checked 2h ago')}>
      <ChecklistRow status="passed" label="Cache hit ratio check on US-East-1 staging" meta="Verified by JD" onClick={() => {}} />
      <ChecklistRow status="failed" label="Invalidation latency under 200ms" meta={<span style={{
      color: 'var(--ds-color-status-critical)',
      fontWeight: 700
    }}>
            FAILED
          </span>} onClick={() => {}} />
      <ChecklistRow status="pending" label="Browser-side TTL override persistence" meta="Not verified" onClick={() => {}} />
      <ChecklistRow status="passed" label="WAF integration compatibility" meta="Verified by JD" onClick={() => {}} />
    </CollapsibleCard>
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'All scenarios passed: header uses the green \`success\` Badge variant, all rows show a passed status.'
      }
    }
  },
  render: () => <CollapsibleCard defaultOpen header={headerWithBadge(<Badge variant="success">4/4 Passed</Badge>, 'Verified 5m ago')}>
      <ChecklistRow status="passed" label="Cache hit ratio check on US-East-1 staging" meta="Verified by JD" onClick={() => {}} />
      <ChecklistRow status="passed" label="Invalidation latency under 200ms" meta="Verified by JD" onClick={() => {}} />
      <ChecklistRow status="passed" label="Browser-side TTL override persistence" meta="Verified by AM" onClick={() => {}} />
      <ChecklistRow status="passed" label="WAF integration compatibility" meta="Verified by JD" onClick={() => {}} />
    </CollapsibleCard>
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Partial verification: header uses the gray \`todo\` Badge variant; rows mix passed and pending statuses.'
      }
    }
  },
  render: () => <CollapsibleCard defaultOpen header={headerWithBadge(<Badge variant="todo">2/4 Verified</Badge>, 'Last verified 30m ago')}>
      <ChecklistRow status="passed" label="Cache hit ratio check on US-East-1 staging" meta="Verified by JD" onClick={() => {}} />
      <ChecklistRow status="pending" label="Invalidation latency under 200ms" meta="Not verified" onClick={() => {}} />
      <ChecklistRow status="pending" label="Browser-side TTL override persistence" meta="Not verified" onClick={() => {}} />
      <ChecklistRow status="passed" label="WAF integration compatibility" meta="Verified by JD" onClick={() => {}} />
    </CollapsibleCard>
}`,...d.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'No scenarios verified yet: header uses the gray \`todo\` Badge variant and the meta shows that testing is still underway. All rows are pending.'
      }
    }
  },
  render: () => <CollapsibleCard defaultOpen header={headerWithBadge(<Badge variant="todo">0/4 Verified</Badge>, 'Testing in Progress')}>
      <ChecklistRow status="pending" label="Cache hit ratio check on US-East-1 staging" meta="Not verified" onClick={() => {}} />
      <ChecklistRow status="pending" label="Invalidation latency under 200ms" meta="Not verified" onClick={() => {}} />
      <ChecklistRow status="pending" label="Browser-side TTL override persistence" meta="Not verified" onClick={() => {}} />
      <ChecklistRow status="pending" label="WAF integration compatibility" meta="Not verified" onClick={() => {}} />
    </CollapsibleCard>
}`,...n.parameters?.docs?.source}}};const x=["Default","Open","ScenariosChecklist","AllPassed","PartiallyVerified","NotStarted"];export{o as AllPassed,t as Default,n as NotStarted,i as Open,d as PartiallyVerified,r as ScenariosChecklist,x as __namedExportsOrder,w as default};
