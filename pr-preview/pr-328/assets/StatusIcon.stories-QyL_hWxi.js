import{j as r}from"./jsx-runtime-u17CrQMm.js";import{S as n}from"./StatusIcon-D273Cc8I.js";import"./iframe-BtXUanSo.js";import"./preload-helper-DZD23-jt.js";import"./cn-2dOUpm6k.js";const l=[{status:"backlog",label:"Backlog"},{status:"todo",label:"Todo"},{status:"in-progress",label:"In progress"},{status:"in-review",label:"In review"},{status:"ready-for-qa",label:"Ready for QA"},{status:"in-qa",label:"In QA"},{status:"blocked",label:"Blocked"},{status:"done",label:"Done"}],u={title:"Components/StatusIcon",component:n,tags:["autodocs"],argTypes:{status:{control:"select",options:l.map(s=>s.status)},size:{control:"select",options:["sm","md"]},label:{control:"text"}},args:{status:"in-progress",label:"In progress"}},a={},e={render:()=>r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-scale-sm)",fontFamily:"var(--ds-font-family-sans)",fontSize:"var(--ds-text-card-body-font-size)",color:"var(--ds-color-text-primary)"},children:l.map(({status:s,label:o})=>r.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"var(--ds-space-scale-sm)"},children:[r.jsx(n,{status:s,label:o}),o]},s))})},t={args:{size:"sm"}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-space-scale-sm)',
    fontFamily: 'var(--ds-font-family-sans)',
    fontSize: 'var(--ds-text-card-body-font-size)',
    color: 'var(--ds-color-text-primary)'
  }}>
      {statuses.map(({
      status,
      label
    }) => <span key={status} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--ds-space-scale-sm)'
    }}>
          <StatusIcon status={status} label={label} />
          {label}
        </span>)}
    </div>
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm'
  }
}`,...t.parameters?.docs?.source}}};const f=["Default","AllStatuses","Small"];export{e as AllStatuses,a as Default,t as Small,f as __namedExportsOrder,u as default};
