import{j as e}from"./jsx-runtime-u17CrQMm.js";import{m as k,r as c}from"./iframe-BTDm9UiW.js";import{w as C}from"./decorators-Tobz6ide.js";import{D as p}from"./Drawer-8iprFslh.js";import{u as D}from"./useSelector-BHBe0cjF.js";import{I as u}from"./IconButton-BfxmUsul.js";import{S as w}from"./Sidebar-CUVT9aiu.js";import{S as R}from"./SectionHeader-Cy0kytln.js";import{N as s}from"./NavItem-DYz7uKJ5.js";import{S as O}from"./Selector-CfnTWqGI.js";import{A as N}from"./Avatar-Dy8ZCZx9.js";import"./preload-helper-BfGoidxi.js";import"./cn-2dOUpm6k.js";import"./useFocusTrap-Dm0q6htV.js";import"./index-D4lhpljC.js";import"./index-CY7XuUG_.js";import"./Icon-Ii9KjIXg.js";import"./useClickOutside-Cx7orlEp.js";import"./sanitizeHref-Bnrf33AA.js";import"./OptionList-3uWwuIsA.js";const y=[{value:"eng-core",label:"Engineering Core"},{value:"mudatec",label:"Mudatec"},{value:"tasksgo",label:"TasksGo"}],E={"eng-core":{initial:"E",label:"Engineering Core"},mudatec:{initial:"M",label:"Mudatec"},tasksgo:{initial:"T",label:"TasksGo"}},Z={title:"Compositions/Drawer",component:p,tags:["autodocs"],parameters:{layout:"fullscreen"}};function g(){const[r,a]=c.useState("eng-core"),[t,h]=c.useState("tasks"),{ref:x,open:v,onOpenChange:b}=D(),d=E[r],m=j=>S=>{S.preventDefault(),h(j)};return e.jsxs(w,{"aria-label":"Sidebar navigation",header:e.jsx(O,{ref:x,options:y,value:r,onValueChange:a,open:v,onOpenChange:b,triggerPrefix:e.jsx(N,{initial:d.initial,"aria-label":d.label}),action:{label:"Add project",icon:"add",onClick:()=>{}}}),footer:e.jsxs(e.Fragment,{children:[e.jsx(s,{icon:"settings",label:"Settings",href:"/settings",size:"sm"}),e.jsx(s,{icon:"help",label:"Support",href:"/support",size:"sm"})]}),children:[e.jsx(R,{children:"Project Artifacts"}),e.jsx(s,{icon:"task_alt",label:"Tasks",href:"/tasks",active:t==="tasks",onClick:m("tasks")}),e.jsx(s,{icon:"confirmation_number",label:"Tickets",href:"/tickets",active:t==="tickets",onClick:m("tickets")}),e.jsx(s,{icon:"description",label:"Docs",href:"/docs",active:t==="docs",onClick:m("docs")})]})}function f(r){const[a,t]=c.useState(!1);return e.jsxs("div",{style:{minHeight:"100vh"},children:[e.jsx(u,{icon:"menu","aria-label":"Open menu",onClick:()=>t(!0)}),e.jsx(p,{...r,open:a,onClose:()=>t(!1),"aria-label":"Navigation menu",children:e.jsx(g,{})})]})}const o={render:r=>e.jsx(f,{...r})},i={render:()=>e.jsx("div",{style:{minHeight:"100vh"},children:e.jsx(p,{open:!0,onClose:()=>{},"aria-label":"Navigation menu",children:e.jsx(g,{})})})};function A(r){const[a,t]=c.useState(!1);return e.jsxs("div",{style:{minHeight:"100vh"},children:[e.jsx(u,{icon:"menu","aria-label":"Open menu",onClick:()=>t(!0)}),e.jsx(p,{...r,open:a,onClose:()=>t(!1),side:"right","aria-label":"Details panel",children:e.jsx("div",{style:{padding:"48px 24px 24px"},children:e.jsx("p",{children:"Right-side drawer content"})})})]})}const n={args:{side:"right"},render:r=>e.jsx(A,{...r})},l={render:r=>e.jsx(f,{...r}),decorators:[C("mobile")],parameters:{viewport:{options:k}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <DefaultRender {...args} />
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minHeight: '100vh'
  }}>
      <Drawer open onClose={() => {}} aria-label="Navigation menu">
        <SidebarContent />
      </Drawer>
    </div>
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    side: 'right'
  },
  render: args => <RightSideRender {...args} />
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <DefaultRender {...args} />,
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions
    }
  }
}`,...l.parameters?.docs?.source}}};const $=["Default","Open","RightSide","Mobile"];export{o as Default,l as Mobile,i as Open,n as RightSide,$ as __namedExportsOrder,Z as default};
