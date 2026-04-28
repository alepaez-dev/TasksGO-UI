import{j as e}from"./jsx-runtime-u17CrQMm.js";import{D as o}from"./DateCell-FtUFJmbj.js";import"./iframe-DRR0ge1c.js";import"./preload-helper-BEwTLl-L.js";import"./cn-2dOUpm6k.js";const l={title:"Components/DateCell",component:o,tags:["autodocs"],argTypes:{date:{control:"text"},urgent:{control:"boolean"},dateTime:{control:"text"}},args:{date:"Oct 28",dateTime:"2026-10-28"}},a={},t={args:{date:"Today",dateTime:"2026-03-11",urgent:!0}},r={args:{date:"Nov 5",dateTime:"2026-11-05"}},s={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-scale-sm)"},children:[e.jsx(o,{date:"Oct 28",dateTime:"2026-10-28"}),e.jsx(o,{date:"Nov 2",dateTime:"2026-11-02"}),e.jsx(o,{date:"Today",urgent:!0,dateTime:"2026-03-11"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    date: 'Today',
    dateTime: '2026-03-11',
    urgent: true
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    date: 'Nov 5',
    dateTime: '2026-11-05'
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-space-scale-sm)'
  }}>
      <DateCell date="Oct 28" dateTime="2026-10-28" />
      <DateCell date="Nov 2" dateTime="2026-11-02" />
      <DateCell date="Today" urgent dateTime="2026-03-11" />
    </div>
}`,...s.parameters?.docs?.source}}};const p=["Default","Urgent","WithDateTime","AllVariants"];export{s as AllVariants,a as Default,t as Urgent,r as WithDateTime,p as __namedExportsOrder,l as default};
