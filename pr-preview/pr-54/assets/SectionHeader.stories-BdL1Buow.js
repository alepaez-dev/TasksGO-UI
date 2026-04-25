import{j as e}from"./jsx-runtime-u17CrQMm.js";import{S as r}from"./SectionHeader-D7alKasq.js";import{N as i}from"./NavItem-DSXEKJTd.js";import"./iframe-DQH_-hqM.js";import"./preload-helper-BZMsmS7u.js";import"./cn-2dOUpm6k.js";import"./sanitizeHref-a0N9eHv-.js";import"./Icon-QPmptYMD.js";const f={title:"Components/SectionHeader",component:r,tags:["autodocs"],argTypes:{children:{control:"text"}},args:{children:"Project Artifacts"}},t={},a={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsx(r,{children:"Project Artifacts"}),e.jsx(r,{children:"Active Tasks"}),e.jsx(r,{children:"Completed Tasks"})]})},s={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-nav-list-gap)",width:"240px"},children:[e.jsx("div",{style:{padding:"0 12px",marginBottom:"8px"},children:e.jsx(r,{children:"Project Artifacts"})}),e.jsx(i,{icon:"task_alt",label:"Tasks",href:"#",active:!0}),e.jsx(i,{icon:"confirmation_number",label:"Tickets",href:"#"}),e.jsx(i,{icon:"description",label:"Docs",href:"#"})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:"{}",...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }}>
      <SectionHeader>Project Artifacts</SectionHeader>
      <SectionHeader>Active Tasks</SectionHeader>
      <SectionHeader>Completed Tasks</SectionHeader>
    </div>
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const u=["Default","AllVariants","InSidebarContext"];export{a as AllVariants,t as Default,s as InSidebarContext,u as __namedExportsOrder,f as default};
