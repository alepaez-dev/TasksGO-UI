import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as v}from"./iframe-C3ln3lUW.js";import{c as f}from"./cn-2dOUpm6k.js";import"./preload-helper-BXjOkAHB.js";const g="_callout_1fgh1_1",h="_positive_1fgh1_12",y="_critical_1fgh1_17",w="_warning_1fgh1_22",x="_neutral_1fgh1_27",c={callout:g,positive:h,critical:y,warning:w,neutral:x},e=v.forwardRef(({variant:l="neutral",className:d,children:u,...p},m)=>r.jsx("div",{ref:m,className:f(c.callout,c[l],d),...p,children:u}));e.displayName="Callout";e.__docgenInfo={description:"",methods:[],displayName:"Callout",props:{variant:{required:!1,tsType:{name:"union",raw:"'positive' | 'critical' | 'warning' | 'neutral'",elements:[{name:"literal",value:"'positive'"},{name:"literal",value:"'critical'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'neutral'"}]},description:"",defaultValue:{value:"'neutral'",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["HTMLAttributes"]};const b={title:"Components/Callout",component:e,tags:["autodocs"],argTypes:{variant:{control:"select",options:["positive","critical","warning","neutral"],description:"Semantic color of the box. positive = expected/pass (green), critical = actual failure (red), warning = waived (amber), neutral = not-run / informational (gray)."},children:{control:"text"}},args:{children:"Response carries X-Cache: HIT and TTFB drops below 40ms."}},a={},t={args:{variant:"positive",children:"Gateway returns 429 Too Many Requests with Retry-After: 2."}},n={args:{variant:"critical",children:"Stale cached body returned with 200 OK after TTL expiry; no Retry-After header present."}},i={args:{variant:"warning",children:"Dev confirmed out of scope for this ticket; tracked separately under ENG-2871."}},s={args:{variant:"neutral",children:"Not run — scenario waived before execution."}},o={render:()=>r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-scale-sm)"},children:[r.jsx(e,{variant:"positive",children:"Expected: response carries X-Cache: HIT."}),r.jsx(e,{variant:"critical",children:"Actual: stale body returned with 200 OK."}),r.jsx(e,{variant:"warning",children:"Waived: tracked separately under ENG-2871."}),r.jsx(e,{variant:"neutral",children:"Not run — scenario waived before execution."})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'positive',
    children: 'Gateway returns 429 Too Many Requests with Retry-After: 2.'
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'critical',
    children: 'Stale cached body returned with 200 OK after TTL expiry; no Retry-After header present.'
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Dev confirmed out of scope for this ticket; tracked separately under ENG-2871.'
  }
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'neutral',
    children: 'Not run — scenario waived before execution.'
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};const R=["Default","Positive","Critical","Warning","Neutral","AllTones"];export{o as AllTones,n as Critical,a as Default,s as Neutral,t as Positive,i as Warning,R as __namedExportsOrder,b as default};
