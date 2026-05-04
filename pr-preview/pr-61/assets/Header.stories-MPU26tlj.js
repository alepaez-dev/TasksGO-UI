import{j as e}from"./jsx-runtime-u17CrQMm.js";import{d as g,m as w,r as i}from"./iframe-Bq0yMram.js";import{w as A}from"./decorators-DoCmPJVb.js";import{H as f}from"./Header-DQ_nYJEh.js";import{h as n,s as C}from"./headerLayout.module-DZR5uXZX.js";import{B as x}from"./Button-CfWyFGSW.js";import{I as j}from"./Icon-BeIt3WQP.js";import{A as d}from"./Avatar-C8YjoW28.js";import{B as v}from"./Breadcrumb-BRFh2a8a.js";import{S}from"./SearchInput-B4l9pJIY.js";import{g as R,S as k}from"./SearchPalette-Dx4URFvZ.js";import{I as D}from"./IconButton-CSoZn2UQ.js";import{B as E}from"./BottomSheet-BoRSaEnG.js";import{S as I}from"./SectionHeader-CB1XjOP3.js";import{N as b}from"./NavItem-B5EIK1jS.js";import"./preload-helper-DRu9V-mC.js";import"./cn-2dOUpm6k.js";import"./sanitizeHref-a0N9eHv-.js";import"./useFocusTrap-Nm65ZczQ.js";import"./index-BrfgA0GA.js";import"./index-CMjm_IK_.js";const O=[{title:"Tasks",results:[{id:"r1",label:"Refactor Kubernetes service discovery",badge:"HIGH",subtitle:"IN PROGRESS · TODAY",type:"task"},{id:"r2",label:"Kube-proxy iptables sync timeout",badge:"MED",subtitle:"OPEN · DEC 23",type:"task"}]},{title:"Docs",results:[{id:"r4",label:"Architecture · Kubernetes topology",subtitle:"EDITED 2D AGO",type:"doc"}]},{title:"Tickets",results:[{id:"r3",label:"TGO-2891 — Kubelet eviction loop",subtitle:"MARIA C · YESTERDAY",type:"ticket"}]}];function y(r){const s=r.toLowerCase();return O.map(t=>({...t,results:t.results.filter(a=>a.label.toLowerCase().includes(s)||(a.badge?.toLowerCase().includes(s)??!1))})).filter(t=>t.results.length>0)}function N(){const[r,s]=i.useState(""),[t,a]=i.useState(),l=r.length>0?y(r):[];return e.jsx(f,{left:e.jsx(v,{segments:[{label:"Tasks",href:"/tasks"},{label:"Calm Execution"}]}),center:e.jsxs(e.Fragment,{children:[e.jsx(S,{role:"combobox",placeholder:"Search or command...",shortcutHint:"⌘K",value:r,onChange:o=>{s(o.target.value),a(void 0)},"aria-expanded":l.length>0,"aria-controls":l.length>0?"search-palette":void 0,"aria-activedescendant":t?R("search-palette",t):void 0}),l.length>0&&e.jsx(k,{id:"search-palette",groups:l,activeResultId:t,onResultSelect:o=>{a(o.id),s(o.label)},"aria-label":"Search results"})]}),right:e.jsxs(e.Fragment,{children:[e.jsxs(x,{size:"sm",children:[e.jsx(j,{name:"add",size:"sm"}),"New task"]}),e.jsx(d,{initial:"AD",variant:"profile","aria-label":"Alejandra D"})]})})}const te={title:"Components/Header",component:f,tags:["autodocs"],argTypes:{compact:{description:"Mobile layout mode. Reduces padding and absolute-centers `center` so the title stays optically centered against the left and right slots."}},parameters:{layout:"fullscreen"}},c={render:()=>e.jsx(N,{}),parameters:{viewport:{options:g}}},p={parameters:{viewport:{options:g}},args:{left:e.jsx(v,{segments:[{label:"Tasks",href:"/tasks"},{label:"Calm Execution"}]}),right:e.jsxs(e.Fragment,{children:[e.jsxs(x,{size:"sm",children:[e.jsx(j,{name:"add",size:"sm"}),"New task"]}),e.jsx(d,{initial:"AP",variant:"profile","aria-label":"Alejandra Paez"})]})}};function P(){const[r,s]=i.useState(!1),[t,a]=i.useState(""),l=i.useCallback(h=>{h?.focus()},[]),o=t.length>0?y(t):[];function u(){s(!1),a("")}return e.jsxs("div",{style:{minHeight:"100vh"},children:[e.jsx(f,{compact:!0,left:e.jsxs("div",{className:n.projectRow,children:[e.jsx(d,{initial:"E",variant:"project","aria-label":"Engineering Core"}),e.jsx("span",{className:n.pageTitle,children:"Tasks"})]}),right:e.jsxs(e.Fragment,{children:[e.jsx(D,{icon:"search","aria-label":"Search",onClick:()=>s(!0)}),e.jsx(d,{initial:"AP",variant:"profile","aria-label":"Ale Paez"})]})}),e.jsxs(E,{open:r,onClose:u,fullHeight:!0,"aria-label":"Search",children:[e.jsxs("div",{className:n.searchSheetHeader,children:[e.jsx(S,{ref:l,placeholder:"Jump to task",size:"sm",value:t,onChange:h=>a(h.target.value),onClear:t?()=>a(""):void 0,borderless:!0,className:C.searchPill,style:{fontSize:16}}),e.jsx("button",{type:"button",className:n.cancelButton,onClick:u,children:"Cancel"})]}),o.length>0?e.jsx(k,{groups:o,onResultSelect:()=>u(),variant:"mobile","aria-label":"Search results"}):e.jsxs(e.Fragment,{children:[e.jsx(I,{headingLevel:3,children:"Jump to"}),e.jsxs("nav",{"aria-label":"Jump to",children:[e.jsx(b,{icon:"task_alt",label:"All tasks",href:"#tasks"}),e.jsx(b,{icon:"confirmation_number",label:"All tickets",href:"#tickets"}),e.jsx(b,{icon:"description",label:"All docs",href:"#docs"})]})]})]})]})}const m={render:()=>e.jsx(P,{}),decorators:[A("mobile")],parameters:{viewport:{options:w}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <DefaultRender />,
  parameters: {
    viewport: {
      options: desktopViewports
    }
  }
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
        <Avatar initial="AP" variant="profile" aria-label="Alejandra Paez" />
      </>
  }
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <MobileRender />,
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions
    }
  }
}`,...m.parameters?.docs?.source}}};const ae=["Default","LeftOnly","Mobile"];export{c as Default,p as LeftOnly,m as Mobile,ae as __namedExportsOrder,te as default};
