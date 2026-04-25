import{j as e}from"./jsx-runtime-u17CrQMm.js";import{I as s,i as n}from"./Icon-QPmptYMD.js";import"./iframe-DQH_-hqM.js";import"./preload-helper-BZMsmS7u.js";import"./cn-2dOUpm6k.js";const c=Object.keys(n),x={title:"Components/Icon",component:s,tags:["autodocs"],argTypes:{name:{control:"select",options:c},size:{control:"select",options:["sm","md","lg"]}},args:{name:"task_alt"}},a={},r={args:{size:"sm"}},t={render:()=>e.jsxs("div",{style:{display:"flex",gap:"var(--ds-space-scale-md)",alignItems:"center"},children:[e.jsx(s,{name:"task_alt",size:"sm"}),e.jsx(s,{name:"task_alt",size:"md"}),e.jsx(s,{name:"task_alt",size:"lg"})]})},o={render:()=>e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, 80px)",gap:"var(--ds-space-scale-md)",textAlign:"center"},children:c.map(l=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"var(--ds-space-scale-xs)"},children:[e.jsx(s,{name:l,size:"md"}),e.jsx("span",{style:{fontSize:"10px",color:"var(--ds-color-text-secondary)"},children:l})]},l))})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm'
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 'var(--ds-space-scale-md)',
    alignItems: 'center'
  }}>
      <Icon name="task_alt" size="sm" />
      <Icon name="task_alt" size="md" />
      <Icon name="task_alt" size="lg" />
    </div>
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 80px)',
    gap: 'var(--ds-space-scale-md)',
    textAlign: 'center'
  }}>
      {iconNames.map(name => <div key={name} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--ds-space-scale-xs)'
    }}>
          <Icon name={name} size="md" />
          <span style={{
        fontSize: '10px',
        color: 'var(--ds-color-text-secondary)'
      }}>
            {name}
          </span>
        </div>)}
    </div>
}`,...o.parameters?.docs?.source}}};const u=["Default","Small","AllSizes","AllIcons"];export{o as AllIcons,t as AllSizes,a as Default,r as Small,u as __namedExportsOrder,x as default};
