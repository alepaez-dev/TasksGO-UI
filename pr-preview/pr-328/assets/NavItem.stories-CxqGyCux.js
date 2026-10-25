import{j as e}from"./jsx-runtime-u17CrQMm.js";import{N as a}from"./NavItem-BiXkF_-q.js";import{S as u}from"./StatusIcon-D273Cc8I.js";import"./iframe-BtXUanSo.js";import"./preload-helper-DZD23-jt.js";import"./cn-2dOUpm6k.js";import"./sanitizeHref-Bnrf33AA.js";import"./Icon-DIzjSC50.js";const _={title:"Components/NavItem",component:a,tags:["autodocs"],argTypes:{icon:{control:"text"},label:{control:"text"},active:{control:"boolean"},size:{control:"select",options:["sm","md"]},orientation:{control:"select",options:["horizontal","vertical"]},href:{control:"text"}},args:{icon:"task_alt",label:"Tasks",href:"#"}},t={},s={args:{active:!0}},r={args:{icon:"settings",label:"Settings",size:"sm"}},i={args:{icon:"settings",label:"Settings",size:"sm",active:!0}},o={args:{icon:"task_alt",label:"Tasks",orientation:"vertical"}},c={args:{icon:"task_alt",activeIcon:"check_circle",label:"Tasks",orientation:"vertical",active:!0}},n={render:()=>e.jsx("div",{style:{display:"flex",width:"72px"},children:e.jsx(a,{icon:"task_alt",label:"Notifications",href:"#",orientation:"vertical"})})},l={render:()=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-around",width:"360px"},children:[e.jsx(a,{icon:"task_alt",activeIcon:"check_circle",label:"Tasks",href:"#",orientation:"vertical",active:!0}),e.jsx(a,{icon:"confirmation_number",activeIcon:"confirmation_number_filled",label:"Tickets",href:"#",orientation:"vertical"}),e.jsx(a,{icon:"description",activeIcon:"description_filled",label:"Docs",href:"#",orientation:"vertical"}),e.jsx(a,{icon:"more_horiz",label:"More",href:"#",orientation:"vertical"})]})},m={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-nav-list-gap)",width:"240px"},children:[e.jsx(a,{icon:"task_alt",label:"Tasks",href:"#",active:!0}),e.jsx(a,{icon:"confirmation_number",label:"Tickets",href:"#"}),e.jsx(a,{icon:"description",label:"Docs",href:"#"}),e.jsx(a,{icon:"settings",label:"Settings",href:"#",size:"sm"}),e.jsx(a,{icon:"help",label:"Support",href:"#",size:"sm"})]})},d={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-nav-list-gap)",width:"var(--ds-space-layout-sidebar-width)"},children:[e.jsx(a,{icon:"task_alt",label:"Tasks",href:"#",count:5}),e.jsx(a,{icon:"confirmation_number",label:"Tickets",href:"#",count:24,active:!0}),e.jsx(a,{icon:"description",label:"Docs",href:"#",count:6})]})},p={render:()=>e.jsxs("nav",{"aria-label":"Ticket status",style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-nav-list-gap)",width:"var(--ds-space-layout-sidebar-width)"},children:[e.jsx(a,{icon:"menu",label:"All open",count:24,active:!0}),e.jsx(a,{leading:e.jsx(u,{status:"backlog",label:"Backlog",size:"sm"}),label:"Backlog",count:5}),e.jsx(a,{leading:e.jsx(u,{status:"in-progress",label:"In progress",size:"sm"}),label:"In progress",count:4}),e.jsx(a,{leading:e.jsx(u,{status:"in-review",label:"In review",size:"sm"}),label:"In review",count:0})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:"{}",...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    active: true
  }
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'settings',
    label: 'Settings',
    size: 'sm'
  }
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'settings',
    label: 'Settings',
    size: 'sm',
    active: true
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'task_alt',
    label: 'Tasks',
    orientation: 'vertical'
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'task_alt',
    activeIcon: 'check_circle',
    label: 'Tasks',
    orientation: 'vertical',
    active: true
  }
}`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    width: '72px'
  }}>
      <NavItem icon="task_alt" label="Notifications" href="#" orientation="vertical" />
    </div>
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    justifyContent: 'space-around',
    width: '360px'
  }}>
      <NavItem icon="task_alt" activeIcon="check_circle" label="Tasks" href="#" orientation="vertical" active />
      <NavItem icon="confirmation_number" activeIcon="confirmation_number_filled" label="Tickets" href="#" orientation="vertical" />
      <NavItem icon="description" activeIcon="description_filled" label="Docs" href="#" orientation="vertical" />
      <NavItem icon="more_horiz" label="More" href="#" orientation="vertical" />
    </div>
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-space-nav-list-gap)',
    width: '240px'
  }}>
      <NavItem icon="task_alt" label="Tasks" href="#" active />
      <NavItem icon="confirmation_number" label="Tickets" href="#" />
      <NavItem icon="description" label="Docs" href="#" />
      <NavItem icon="settings" label="Settings" href="#" size="sm" />
      <NavItem icon="help" label="Support" href="#" size="sm" />
    </div>
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-space-nav-list-gap)',
    width: 'var(--ds-space-layout-sidebar-width)'
  }}>
      <NavItem icon="task_alt" label="Tasks" href="#" count={5} />
      <NavItem icon="confirmation_number" label="Tickets" href="#" count={24} active />
      <NavItem icon="description" label="Docs" href="#" count={6} />
    </div>
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <nav aria-label="Ticket status" style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-space-nav-list-gap)',
    width: 'var(--ds-space-layout-sidebar-width)'
  }}>
      <NavItem icon="menu" label="All open" count={24} active />
      <NavItem leading={<StatusIcon status="backlog" label="Backlog" size="sm" />} label="Backlog" count={5} />
      <NavItem leading={<StatusIcon status="in-progress" label="In progress" size="sm" />} label="In progress" count={4} />
      <NavItem leading={<StatusIcon status="in-review" label="In review" size="sm" />} label="In review" count={0} />
    </nav>
}`,...p.parameters?.docs?.source}}};const S=["Default","Active","Small","SmallActive","Vertical","VerticalActive","VerticalLongLabel","VerticalRow","AllStates","WithCount","AsButtonList"];export{s as Active,m as AllStates,p as AsButtonList,t as Default,r as Small,i as SmallActive,o as Vertical,c as VerticalActive,n as VerticalLongLabel,l as VerticalRow,d as WithCount,S as __namedExportsOrder,_ as default};
