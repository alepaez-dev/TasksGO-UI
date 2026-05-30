import{j as e}from"./jsx-runtime-u17CrQMm.js";import{C as a}from"./ChecklistRow-DNE0699E.js";import"./iframe-CFVd6xWV.js";import"./preload-helper-LDNDuAwT.js";import"./cn-2dOUpm6k.js";import"./Icon-DPH3oEkJ.js";const h={title:"Components/ChecklistRow",component:a,tags:["autodocs"],parameters:{docs:{description:{component:"A single line in a verification or scenario checklist: a status indicator, a label, and an optional meta slot for trailing text such as a verifier name or a failure tag."}}},argTypes:{status:{control:"select",options:["passed","failed","pending"]}},decorators:[c=>e.jsx("div",{style:{width:"480px",padding:"24px"},children:e.jsx(c,{})})]},l=e.jsx("span",{style:{color:"var(--ds-color-status-critical)",fontWeight:700},children:"FAILED"}),t={args:{status:"passed",label:"Cache hit ratio check on US-East-1 staging",meta:"Verified by JD"}},s={args:{status:"failed",label:"Invalidation latency under 200ms",meta:l}},i={args:{status:"pending",label:"Browser-side TTL override persistence",meta:"Not verified"}},n={args:{status:"passed",label:"WAF integration compatibility"}},r={args:{status:"failed",label:"Invalidation latency under 200ms",meta:l,onClick:()=>{window.open("https://example.com/failures/invalidation-latency","_blank","noopener,noreferrer")}},parameters:{docs:{description:{story:'When `onClick` is provided, the row becomes a keyboard-operable button (`role="button"`, Tab-focusable, Enter/Space activates). The trailing `open_in_new` icon appears on hover or focus to indicate that activating the row opens its details in a new tab.'}}}},o={render:()=>e.jsxs("div",{children:[e.jsx(a,{status:"passed",label:"Cache hit ratio check on US-East-1 staging",meta:"Verified by JD",onClick:()=>{}}),e.jsx(a,{status:"failed",label:"Invalidation latency under 200ms",meta:l,onClick:()=>{}}),e.jsx(a,{status:"pending",label:"Browser-side TTL override persistence",meta:"Not verified",onClick:()=>{}}),e.jsx(a,{status:"passed",label:"WAF integration compatibility",meta:"Verified by JD",onClick:()=>{}})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'passed',
    label: 'Cache hit ratio check on US-East-1 staging',
    meta: 'Verified by JD'
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'failed',
    label: 'Invalidation latency under 200ms',
    meta: failedMeta
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'pending',
    label: 'Browser-side TTL override persistence',
    meta: 'Not verified'
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'passed',
    label: 'WAF integration compatibility'
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'failed',
    label: 'Invalidation latency under 200ms',
    meta: failedMeta,
    onClick: () => {
      window.open('https://example.com/failures/invalidation-latency', '_blank', 'noopener,noreferrer');
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'When \`onClick\` is provided, the row becomes a keyboard-operable button (\`role="button"\`, Tab-focusable, Enter/Space activates). The trailing \`open_in_new\` icon appears on hover or focus to indicate that activating the row opens its details in a new tab.'
      }
    }
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div>
      <ChecklistRow status="passed" label="Cache hit ratio check on US-East-1 staging" meta="Verified by JD" onClick={() => {}} />
      <ChecklistRow status="failed" label="Invalidation latency under 200ms" meta={failedMeta} onClick={() => {}} />
      <ChecklistRow status="pending" label="Browser-side TTL override persistence" meta="Not verified" onClick={() => {}} />
      <ChecklistRow status="passed" label="WAF integration compatibility" meta="Verified by JD" onClick={() => {}} />
    </div>
}`,...o.parameters?.docs?.source}}};const f=["Passed","Failed","Pending","WithoutMeta","Clickable","AllStatuses"];export{o as AllStatuses,r as Clickable,s as Failed,t as Passed,i as Pending,n as WithoutMeta,f as __namedExportsOrder,h as default};
