import{j as e}from"./jsx-runtime-u17CrQMm.js";import{C as r}from"./Callout-06ua4Xuq.js";import"./iframe-BkxkAkzO.js";import"./preload-helper-Deh0GfcN.js";import"./cn-2dOUpm6k.js";const m={title:"Components/Callout",component:r,tags:["autodocs"],argTypes:{variant:{control:"select",options:["positive","critical","warning","neutral"],description:"Semantic color of the box. positive = expected/pass (green), critical = actual failure (red), warning = waived (amber), neutral = not-run / informational (gray)."},children:{control:"text"}},args:{children:"Response carries X-Cache: HIT and TTFB drops below 40ms."}},a={},t={args:{variant:"positive",children:"Gateway returns 429 Too Many Requests with Retry-After: 2."}},s={args:{variant:"critical",children:"Stale cached body returned with 200 OK after TTL expiry; no Retry-After header present."}},n={args:{variant:"warning",children:"Dev confirmed out of scope for this ticket; tracked separately under ENG-2871."}},o={args:{variant:"neutral",children:"Not run — scenario waived before execution."}},i={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-scale-sm)"},children:[e.jsx(r,{variant:"positive",children:"Expected: response carries X-Cache: HIT."}),e.jsx(r,{variant:"critical",children:"Actual: stale body returned with 200 OK."}),e.jsx(r,{variant:"warning",children:"Waived: tracked separately under ENG-2871."}),e.jsx(r,{variant:"neutral",children:"Not run — scenario waived before execution."})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'positive',
    children: 'Gateway returns 429 Too Many Requests with Retry-After: 2.'
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'critical',
    children: 'Stale cached body returned with 200 OK after TTL expiry; no Retry-After header present.'
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Dev confirmed out of scope for this ticket; tracked separately under ENG-2871.'
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'neutral',
    children: 'Not run — scenario waived before execution.'
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-space-scale-sm)'
  }}>
      <Callout variant="positive">
        Expected: response carries X-Cache: HIT.
      </Callout>
      <Callout variant="critical">
        Actual: stale body returned with 200 OK.
      </Callout>
      <Callout variant="warning">
        Waived: tracked separately under ENG-2871.
      </Callout>
      <Callout variant="neutral">
        Not run — scenario waived before execution.
      </Callout>
    </div>
}`,...i.parameters?.docs?.source}}};const v=["Default","Positive","Critical","Warning","Neutral","AllTones"];export{i as AllTones,s as Critical,a as Default,o as Neutral,t as Positive,n as Warning,v as __namedExportsOrder,m as default};
