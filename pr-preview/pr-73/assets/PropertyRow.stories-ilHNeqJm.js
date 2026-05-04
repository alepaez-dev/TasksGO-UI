import{j as r}from"./jsx-runtime-u17CrQMm.js";import{P as c}from"./PropertyRow-CQCKP1ju.js";import{A as l}from"./Avatar-C4fHPnOl.js";import{P as p}from"./PriorityLabel-DdNZ5Q3b.js";import{S as m}from"./StatusDot-Uf7bapQy.js";import"./iframe-Dh8KDhUC.js";import"./preload-helper-BiPwfwAp.js";import"./cn-2dOUpm6k.js";import"./Icon-vWsfamG2.js";const S={title:"Components/PropertyRow",component:c,tags:["autodocs"]},a={args:{icon:"person",label:"Assignee",children:"Alex D."}},o={args:{icon:"person",label:"Assignee",onClick:()=>{}},render:e=>r.jsxs(c,{...e,children:[r.jsx(l,{initial:"AD","aria-label":"Alex D.",variant:"profile"}),r.jsx("span",{children:"Alex D."})]})},s={args:{icon:"tag",label:"Project"},render:e=>r.jsxs(c,{...e,children:[r.jsx(m,{variant:"active",label:"Active"}),r.jsx("span",{children:"Infrastructure"})]})},t={args:{icon:"signal_cellular_alt",label:"Priority",onClick:()=>{}},render:e=>r.jsx(c,{...e,children:r.jsx(p,{priority:"high"})})},i={args:{icon:"confirmation_number",label:"Linked Ticket",onClick:()=>{},children:"Search ticket..."}},n={args:{label:"Sprint",children:"Q1-W4-INFRA"}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'person',
    label: 'Assignee',
    children: 'Alex D.'
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'person',
    label: 'Assignee',
    onClick: () => {}
  },
  render: args => <PropertyRow {...args}>
      <Avatar initial="AD" aria-label="Alex D." variant="profile" />
      <span>Alex D.</span>
    </PropertyRow>
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'tag',
    label: 'Project'
  },
  render: args => <PropertyRow {...args}>
      <StatusDot variant="active" label="Active" />
      <span>Infrastructure</span>
    </PropertyRow>
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'signal_cellular_alt',
    label: 'Priority',
    onClick: () => {}
  },
  render: args => <PropertyRow {...args}>
      <PriorityLabel priority="high" />
    </PropertyRow>
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'confirmation_number',
    label: 'Linked Ticket',
    onClick: () => {},
    children: 'Search ticket...'
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Sprint',
    children: 'Q1-W4-INFRA'
  }
}`,...n.parameters?.docs?.source}}};const f=["Default","WithAvatar","WithStatusDot","WithPriority","Placeholder","WithoutIcon"];export{a as Default,i as Placeholder,o as WithAvatar,t as WithPriority,s as WithStatusDot,n as WithoutIcon,f as __namedExportsOrder,S as default};
