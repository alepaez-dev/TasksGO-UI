import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as n}from"./iframe-QUOITM-w.js";import{S as s}from"./SearchPalette-CBGgM0zC.js";import"./preload-helper-B70A2d3S.js";import"./cn-2dOUpm6k.js";const o=[{title:"Jump to Task",results:[{id:"r1",label:"Update login flow",refId:"TSK-042",type:"task"},{id:"r2",label:"Fix auth token expiry",refId:"TSK-041",type:"task"},{id:"r3",label:"Refactor dashboard layout",refId:"TSK-039",type:"task"}]},{title:"Jump to Ticket",results:[{id:"r4",label:"Login timeout on slow networks",refId:"TKT-15",type:"ticket"}]},{title:"Jump to Doc",results:[{id:"r5",label:"Authentication guide",refId:"DOC-7",type:"doc"}]}];function p(){const[a,i]=n.useState();return r.jsx(s,{groups:o,activeResultId:a,onResultSelect:l=>i(l.id),"aria-label":"Search results"})}const x={title:"Components/SearchPalette",component:s,tags:["autodocs"],argTypes:{activeResultId:{control:"text"}},decorators:[a=>r.jsx("div",{style:{position:"relative",maxWidth:"320px",paddingTop:"48px"},children:r.jsx(a,{})})]},e={render:()=>r.jsx(p,{})},t={args:{groups:[o[0]],"aria-label":"Search results"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <InteractiveRender />
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    groups: [sampleGroups[0]],
    'aria-label': 'Search results'
  }
}`,...t.parameters?.docs?.source}}};const S=["Default","SingleGroup"];export{e as Default,t as SingleGroup,S as __namedExportsOrder,x as default};
