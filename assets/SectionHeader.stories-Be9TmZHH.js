import{j as e}from"./jsx-runtime-u17CrQMm.js";import{S as t}from"./SectionHeader-BjwSv5rp.js";import{N as o}from"./NavItem-C1lXjX56.js";import"./iframe-Ue28p0jA.js";import"./preload-helper-CyvMmb0J.js";import"./cn-2dOUpm6k.js";import"./sanitizeHref-a0N9eHv-.js";import"./Icon-Cr-Eu5kX.js";const x={title:"Components/SectionHeader",component:t,tags:["autodocs"],argTypes:{children:{control:"text"},subtitle:{control:"text"},headingLevel:{control:"select",options:[2,3,4,5,6]}},args:{children:"Project Artifacts"},parameters:{docs:{description:{component:"Uppercase-mono section heading with an optional subtitle line. The `headingLevel` prop (default `3`) lets consumers pick the semantic heading element; `h1` is intentionally excluded since it is reserved for page titles. Consumers are responsible for maintaining a correct document outline — if a parent section already has an `h2` sibling, pick a deeper level here to avoid flat/broken heading hierarchies."}}}},r={},a={args:{children:"My tasks",subtitle:"12 open · 3 in progress",headingLevel:2}},s={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsx(t,{children:"Project Artifacts"}),e.jsx(t,{children:"Active Tasks"}),e.jsx(t,{children:"Completed Tasks"})]})},i={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-nav-list-gap)",width:"240px"},children:[e.jsx("div",{style:{padding:"0 12px",marginBottom:"8px"},children:e.jsx(t,{children:"Project Artifacts"})}),e.jsx(o,{icon:"task_alt",label:"Tasks",href:"#",active:!0}),e.jsx(o,{icon:"confirmation_number",label:"Tickets",href:"#"}),e.jsx(o,{icon:"description",label:"Docs",href:"#"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'My tasks',
    subtitle: '12 open · 3 in progress',
    headingLevel: 2
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }}>
      <SectionHeader>Project Artifacts</SectionHeader>
      <SectionHeader>Active Tasks</SectionHeader>
      <SectionHeader>Completed Tasks</SectionHeader>
    </div>
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-space-nav-list-gap)',
    width: '240px'
  }}>
      <div style={{
      padding: '0 12px',
      marginBottom: '8px'
    }}>
        <SectionHeader>Project Artifacts</SectionHeader>
      </div>
      <NavItem icon="task_alt" label="Tasks" href="#" active />
      <NavItem icon="confirmation_number" label="Tickets" href="#" />
      <NavItem icon="description" label="Docs" href="#" />
    </div>
}`,...i.parameters?.docs?.source}}};const f=["Default","WithSubtitle","AllVariants","InSidebarContext"];export{s as AllVariants,r as Default,i as InSidebarContext,a as WithSubtitle,f as __namedExportsOrder,x as default};
