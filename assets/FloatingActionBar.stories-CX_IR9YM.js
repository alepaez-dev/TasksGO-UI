import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as h,d as i}from"./iframe-B8ApMtZH.js";import{c as g}from"./cn-2dOUpm6k.js";import{B as t}from"./Button-BWNobxgA.js";import{I as s}from"./Icon-DhSU4xSX.js";import"./preload-helper-CyvMmb0J.js";const u="_positioner_11oyz_1",z="_bar_11oyz_12",c={positioner:u,bar:z},a=h.forwardRef(({className:m,children:d,...p},l)=>e.jsx("div",{className:c.positioner,children:e.jsx("div",{ref:l,role:"group",className:g(c.bar,m),...p,children:d})}));a.displayName="FloatingActionBar";a.__docgenInfo={description:"",methods:[],displayName:"FloatingActionBar",props:{"aria-label":{required:!0,tsType:{name:"string"},description:""}},composes:["HTMLAttributes"]};const w={title:"Components/FloatingActionBar",component:a,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:`A pill-shaped, fixed-position toolbar that floats near the bottom of the viewport. Holds short, related actions (e.g. "Create task", "Linked tasks") that need to remain reachable while the user scrolls through a long piece of content. Children are rendered horizontally with a thin divider between each pair. Designed for short label sets (1–3 actions); on viewports narrower than the bar's natural width the trailing actions clip.`}}}},n={parameters:{viewport:{options:i}},render:()=>e.jsxs(a,{"aria-label":"Scratchpad actions",children:[e.jsxs(t,{variant:"ghost",size:"sm",children:[e.jsx(s,{name:"add",size:"sm"}),"Create task"]}),e.jsxs(t,{variant:"ghost",size:"sm",children:[e.jsx(s,{name:"link",size:"sm"}),"Linked tasks (2)"]})]})},r={parameters:{viewport:{options:i}},render:()=>e.jsx(a,{"aria-label":"Page actions",children:e.jsxs(t,{variant:"ghost",size:"sm",children:[e.jsx(s,{name:"add",size:"sm"}),"Create task"]})})},o={parameters:{viewport:{options:i}},render:()=>e.jsxs(a,{"aria-label":"Scratchpad actions",children:[e.jsxs(t,{variant:"ghost",size:"sm",children:[e.jsx(s,{name:"add",size:"sm"}),"Create task"]}),e.jsxs(t,{variant:"ghost",size:"sm",children:[e.jsx(s,{name:"link",size:"sm"}),"Linked tasks (2)"]}),e.jsxs(t,{variant:"ghost",size:"sm",children:[e.jsx(s,{name:"more_horiz",size:"sm"}),"More"]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      options: desktopViewports
    }
  },
  render: () => <FloatingActionBar aria-label="Scratchpad actions">
      <Button variant="ghost" size="sm">
        <Icon name="add" size="sm" />
        Create task
      </Button>
      <Button variant="ghost" size="sm">
        <Icon name="link" size="sm" />
        Linked tasks (2)
      </Button>
    </FloatingActionBar>
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      options: desktopViewports
    }
  },
  render: () => <FloatingActionBar aria-label="Page actions">
      <Button variant="ghost" size="sm">
        <Icon name="add" size="sm" />
        Create task
      </Button>
    </FloatingActionBar>
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      options: desktopViewports
    }
  },
  render: () => <FloatingActionBar aria-label="Scratchpad actions">
      <Button variant="ghost" size="sm">
        <Icon name="add" size="sm" />
        Create task
      </Button>
      <Button variant="ghost" size="sm">
        <Icon name="link" size="sm" />
        Linked tasks (2)
      </Button>
      <Button variant="ghost" size="sm">
        <Icon name="more_horiz" size="sm" />
        More
      </Button>
    </FloatingActionBar>
}`,...o.parameters?.docs?.source}}};const f=["Default","SingleAction","ThreeActions"];export{n as Default,r as SingleAction,o as ThreeActions,f as __namedExportsOrder,w as default};
