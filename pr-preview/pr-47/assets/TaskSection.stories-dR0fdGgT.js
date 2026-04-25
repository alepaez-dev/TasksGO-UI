import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as g}from"./iframe-KftA85Gz.js";import{T as i}from"./TaskSection-D6nV2tQi.js";import{u as h,S}from"./useSelector-DGrTQrPs.js";import"./preload-helper-ClFlqRex.js";import"./cn-2dOUpm6k.js";import"./Icon-C7HRVkFt.js";import"./Badge-SGl09WIo.js";const A={title:"Components/TaskSection",component:i,tags:["autodocs"],argTypes:{title:{control:"text"},count:{control:"number"},badgeVariant:{control:"select",options:["default","progress","todo","done"]},open:{control:"boolean"}}},r={args:{title:"ACTIVE TASKS",count:2,badgeVariant:"progress",open:!0,children:e.jsx("p",{children:"Section content goes here."})}},t={args:{title:"DONE",count:5,badgeVariant:"done",children:e.jsx("p",{children:"Completed tasks would appear here."})}},s=[{value:"priority",label:"Priority"},{value:"due-date",label:"Due date"},{value:"recently-updated",label:"Recently updated"}];function b(){const[a,c]=g.useState("priority"),{ref:d,open:l,onOpenChange:p}=h(),u=s.find(m=>m.value===a);return e.jsx(i,{title:"Active Tasks",count:5,badgeVariant:"progress",open:!0,trailing:e.jsx(S,{ref:d,variant:"inline",dropdownAlign:"end",options:s,value:a,onValueChange:c,open:l,onOpenChange:p,renderTriggerLabel:()=>e.jsxs("span",{children:["Order by: ",u?.label??"Select"]}),renderOptionIndicator:()=>null,"aria-label":"Sort tasks by"}),children:e.jsxs("p",{children:["Task rows would appear here, sorted by ",a,"."]})})}const o={args:{title:"Active Tasks"},render:()=>e.jsx(b,{})},n={args:{title:"BACKLOG",open:!0,children:e.jsx("p",{children:"Tasks without a count badge."})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'ACTIVE TASKS',
    count: 2,
    badgeVariant: 'progress',
    open: true,
    children: <p>Section content goes here.</p>
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'DONE',
    count: 5,
    badgeVariant: 'done',
    children: <p>Completed tasks would appear here.</p>
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Active Tasks'
  },
  render: () => <WithOrderByRender />
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'BACKLOG',
    open: true,
    children: <p>Tasks without a count badge.</p>
  }
}`,...n.parameters?.docs?.source}}};const v=["Default","Closed","WithOrderBy","WithoutCount"];export{t as Closed,r as Default,o as WithOrderBy,n as WithoutCount,v as __namedExportsOrder,A as default};
