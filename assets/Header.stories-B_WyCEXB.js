import{j as e}from"./jsx-runtime-u17CrQMm.js";import{d as h,m as g,r as c}from"./iframe-CY-KSXXP.js";import{w as b}from"./decorators-Ci1Jec0r.js";import{H as p}from"./Header-B0neBqYE.js";import{B as d}from"./Button-ZcpGNp_B.js";import{I as u}from"./Icon-DVcBtTpv.js";import{A as f}from"./Avatar-BJFP-kGw.js";import{B as x}from"./Breadcrumb-DGbugHRx.js";import{S as j}from"./SearchInput-CeoPP-B0.js";import{g as v,S as w}from"./SearchPalette-Rd6mmJRD.js";import{I as k}from"./IconButton-BAJ406mH.js";import{F as S}from"./FloatingSearch-BlhoiB4t.js";import"./preload-helper-CyvMmb0J.js";import"./cn-2dOUpm6k.js";import"./sanitizeHref-a0N9eHv-.js";const I=[{title:"Jump to Task",results:[{id:"r1",label:"Update login flow",refId:"TSK-042",type:"task"},{id:"r2",label:"Fix auth token expiry",refId:"TSK-041",type:"task"}]},{title:"Jump to Ticket",results:[{id:"r3",label:"Login timeout on slow networks",refId:"TKT-15",type:"ticket"}]},{title:"Jump to Doc",results:[{id:"r4",label:"Authentication guide",refId:"DOC-7",type:"doc"}]}];function y(r){const a=r.toLowerCase();return I.map(t=>({...t,results:t.results.filter(s=>s.label.toLowerCase().includes(a)||s.refId.toLowerCase().includes(a))})).filter(t=>t.results.length>0)}function A(){const[r,a]=c.useState(""),[t,s]=c.useState(),o=r.length>0?y(r):[];return e.jsx(p,{left:e.jsx(x,{segments:[{label:"Tasks",href:"/tasks"},{label:"Calm Execution"}]}),center:e.jsxs(e.Fragment,{children:[e.jsx(j,{role:"combobox",placeholder:"Search or command...",shortcutHint:"⌘K",value:r,onChange:i=>{a(i.target.value),s(void 0)},"aria-expanded":o.length>0,"aria-controls":o.length>0?"search-palette":void 0,"aria-activedescendant":t?v("search-palette",t):void 0}),o.length>0&&e.jsx(w,{id:"search-palette",groups:o,activeResultId:t,onResultSelect:i=>{s(i.id),a(i.label)},"aria-label":"Search results"})]}),right:e.jsxs(e.Fragment,{children:[e.jsxs(d,{size:"sm",children:[e.jsx(u,{name:"add",size:"sm"}),"New task"]}),e.jsx(f,{initial:"AD",variant:"profile","aria-label":"Alejandra D"})]})})}const J={title:"Components/Header",component:p,tags:["autodocs"],parameters:{layout:"fullscreen"}},n={render:()=>e.jsx(A,{}),parameters:{viewport:{options:h}}},l={parameters:{viewport:{options:h}},args:{left:e.jsx(x,{segments:[{label:"Tasks",href:"/tasks"},{label:"Calm Execution"}]}),right:e.jsxs(e.Fragment,{children:[e.jsxs(d,{size:"sm",children:[e.jsx(u,{name:"add",size:"sm"}),"New task"]}),e.jsx(f,{initial:"AH",variant:"profile","aria-label":"Alejandra Hernandez"})]})}};function D(){const[r,a]=c.useState("");return e.jsxs("div",{style:{minHeight:"100vh",position:"relative"},children:[e.jsx(p,{compact:!0,left:e.jsx(k,{icon:"menu","aria-label":"Menu"}),center:"Project / Infrastructure",right:e.jsxs(e.Fragment,{children:[e.jsx(d,{size:"sm","aria-label":"New task",children:e.jsx(u,{name:"add",size:"sm"})}),e.jsx(f,{initial:"AD",variant:"profile","aria-label":"Alejandra D"})]})}),e.jsx(S,{placeholder:"Search tasks or commands...",shortcutHint:"⌘K",value:r,onChange:t=>a(t.target.value)})]})}const m={render:()=>e.jsx(D,{}),decorators:[b("mobile")],parameters:{viewport:{options:g}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <DefaultRender />,
  parameters: {
    viewport: {
      options: desktopViewports
    }
  }
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      options: desktopViewports
    }
  },
  args: {
    left: <Breadcrumb segments={[{
      label: 'Tasks',
      href: '/tasks'
    }, {
      label: 'Calm Execution'
    }]} />,
    right: <>
        <Button size="sm">
          <Icon name="add" size="sm" />
          New task
        </Button>
        <Avatar initial="AH" variant="profile" aria-label="Alejandra Hernandez" />
      </>
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <MobileRender />,
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions
    }
  }
}`,...m.parameters?.docs?.source}}};const P=["Default","LeftOnly","Mobile"];export{n as Default,l as LeftOnly,m as Mobile,P as __namedExportsOrder,J as default};
