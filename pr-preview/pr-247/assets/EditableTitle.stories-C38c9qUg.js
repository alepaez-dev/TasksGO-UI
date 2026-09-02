import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as d}from"./iframe-UaE6Nyre.js";import{E as c}from"./EditableTitle-Ckrdr0bn.js";import"./preload-helper-DpPvC_OQ.js";import"./useAutoGrowTextarea-CGLNUYl0.js";import"./cn-2dOUpm6k.js";import"./EditToggle-BDslIg-p.js";import"./Icon-DiVQSk7C.js";const j={title:"Components/EditableTitle",component:c,parameters:{layout:"padded"},argTypes:{as:{control:"select",options:["h1","h2","h3","span"]},editButton:{control:"inline-radio",options:["none","hover","always"]},clickToEdit:{control:"boolean"},fullWidth:{control:"boolean"},value:{control:!1},editing:{control:!1},onChange:{control:!1},onEditingChange:{control:!1}}};function t(r){const[u,m]=d.useState(r.value??"Rate Limit Edge Case"),[p,g]=d.useState(r.editing??!1);return e.jsx(c,{as:"h2",...r,value:u,editing:p,onEditingChange:g,onChange:m})}const o={render:r=>e.jsx(t,{...r}),args:{as:"h2",editButton:"hover",clickToEdit:!1,fullWidth:!1}},a={render:()=>e.jsx(t,{editButton:"always"})},s={render:()=>e.jsx(t,{editing:!0,editButton:"always"})},i={render:()=>e.jsx(t,{as:"h1",fullWidth:!0,clickToEdit:!0})},n={render:()=>e.jsx(t,{as:"h1",fullWidth:!0,editing:!0,clickToEdit:!0})},l={render:()=>e.jsx(t,{as:"h1",fullWidth:!0,clickToEdit:!0,value:"","aria-label":"Ticket title"})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <Controlled {...args} />,
  args: {
    as: 'h2',
    editButton: 'hover',
    clickToEdit: false,
    fullWidth: false
  }
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled editButton="always" />
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled editing editButton="always" />
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled as="h1" fullWidth clickToEdit />
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled as="h1" fullWidth editing clickToEdit />
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled as="h1" fullWidth clickToEdit value="" aria-label="Ticket title" />
}`,...l.parameters?.docs?.source}}};const B=["Default","AlwaysButton","Editing","ClickToEdit","EditingHeading","EmptyClickToEdit"];export{a as AlwaysButton,i as ClickToEdit,o as Default,s as Editing,n as EditingHeading,l as EmptyClickToEdit,B as __namedExportsOrder,j as default};
