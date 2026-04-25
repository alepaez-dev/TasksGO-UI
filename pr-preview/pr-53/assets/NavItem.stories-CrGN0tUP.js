import{j as e}from"./jsx-runtime-u17CrQMm.js";import{N as t}from"./NavItem-CHU28p_e.js";import"./iframe-QUOITM-w.js";import"./preload-helper-B70A2d3S.js";import"./cn-2dOUpm6k.js";import"./sanitizeHref-a0N9eHv-.js";import"./Icon-Dgqze2mz.js";const b={title:"Components/NavItem",component:t,tags:["autodocs"],argTypes:{icon:{control:"text"},label:{control:"text"},active:{control:"boolean"},size:{control:"select",options:["sm","md"]},orientation:{control:"select",options:["horizontal","vertical"]},href:{control:"text"}},args:{icon:"task_alt",label:"Tasks",href:"#"}},a={},r={args:{active:!0}},s={args:{icon:"settings",label:"Settings",size:"sm"}},i={args:{icon:"settings",label:"Settings",size:"sm",active:!0}},o={args:{icon:"task_alt",label:"Tasks",orientation:"vertical"}},c={args:{icon:"task_alt",activeIcon:"check_circle",label:"Tasks",orientation:"vertical",active:!0}},n={render:()=>e.jsx("div",{style:{display:"flex",width:"72px"},children:e.jsx(t,{icon:"task_alt",label:"Notifications",href:"#",orientation:"vertical"})})},l={render:()=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-around",width:"360px"},children:[e.jsx(t,{icon:"task_alt",activeIcon:"check_circle",label:"Tasks",href:"#",orientation:"vertical",active:!0}),e.jsx(t,{icon:"confirmation_number",activeIcon:"confirmation_number_filled",label:"Tickets",href:"#",orientation:"vertical"}),e.jsx(t,{icon:"description",activeIcon:"description_filled",label:"Docs",href:"#",orientation:"vertical"}),e.jsx(t,{icon:"more_horiz",label:"More",href:"#",orientation:"vertical"})]})},m={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-nav-list-gap)",width:"240px"},children:[e.jsx(t,{icon:"task_alt",label:"Tasks",href:"#",active:!0}),e.jsx(t,{icon:"confirmation_number",label:"Tickets",href:"#"}),e.jsx(t,{icon:"description",label:"Docs",href:"#"}),e.jsx(t,{icon:"settings",label:"Settings",href:"#",size:"sm"}),e.jsx(t,{icon:"help",label:"Support",href:"#",size:"sm"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    active: true
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'settings',
    label: 'Settings',
    size: 'sm'
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};const x=["Default","Active","Small","SmallActive","Vertical","VerticalActive","VerticalLongLabel","VerticalRow","AllStates"];export{r as Active,m as AllStates,a as Default,s as Small,i as SmallActive,o as Vertical,c as VerticalActive,n as VerticalLongLabel,l as VerticalRow,x as __namedExportsOrder,b as default};
