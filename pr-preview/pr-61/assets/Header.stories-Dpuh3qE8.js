import{j as e}from"./jsx-runtime-u17CrQMm.js";import{d as g,m as y,r as i}from"./iframe-DY150Hd8.js";import{w as A}from"./decorators-B-JoX8tx.js";import{H as f}from"./Header-B9Cu_TeV.js";import{s as R}from"./searchPill.module-Dt8VRG0-.js";import{B as x}from"./Button-D7aLF9qe.js";import{I as j}from"./Icon-DsjyDYYK.js";import{A as d}from"./Avatar-h3uJG0E4.js";import{B as v}from"./Breadcrumb-DqNMHbm3.js";import{S}from"./SearchInput-DQuAXoAr.js";import{g as C,S as k}from"./SearchPalette-CEC0o2Sk.js";import{I as D}from"./IconButton-CKWjOSOA.js";import{B as E}from"./BottomSheet-DCmAtwbb.js";import{S as _}from"./SectionHeader-CqUWOP5P.js";import{N as b}from"./NavItem-CL6TE7L3.js";import"./preload-helper-DRu9V-mC.js";import"./cn-2dOUpm6k.js";import"./sanitizeHref-a0N9eHv-.js";import"./useFocusTrap-CJVvSO7x.js";import"./index-DiYJpeRN.js";import"./index-4ItzUkhQ.js";const I="_projectRow_131ho_1",T="_pageTitle_131ho_7",B="_searchSheetHeader_131ho_13",H="_cancelButton_131ho_20",n={projectRow:I,pageTitle:T,searchSheetHeader:B,cancelButton:H},O=[{title:"Tasks",results:[{id:"r1",label:"Refactor Kubernetes service discovery",badge:"HIGH",subtitle:"IN PROGRESS · TODAY",type:"task"},{id:"r2",label:"Kube-proxy iptables sync timeout",badge:"MED",subtitle:"OPEN · DEC 23",type:"task"}]},{title:"Docs",results:[{id:"r4",label:"Architecture · Kubernetes topology",subtitle:"EDITED 2D AGO",type:"doc"}]},{title:"Tickets",results:[{id:"r3",label:"TGO-2891 — Kubelet eviction loop",subtitle:"MARIA C · YESTERDAY",type:"ticket"}]}];function w(r){const s=r.toLowerCase();return O.map(t=>({...t,results:t.results.filter(a=>a.label.toLowerCase().includes(s)||(a.badge?.toLowerCase().includes(s)??!1))})).filter(t=>t.results.length>0)}function N(){const[r,s]=i.useState(""),[t,a]=i.useState(),l=r.length>0?w(r):[];return e.jsx(f,{left:e.jsx(v,{segments:[{label:"Tasks",href:"/tasks"},{label:"Calm Execution"}]}),center:e.jsxs(e.Fragment,{children:[e.jsx(S,{role:"combobox",placeholder:"Search or command...",shortcutHint:"⌘K",value:r,onChange:o=>{s(o.target.value),a(void 0)},"aria-expanded":l.length>0,"aria-controls":l.length>0?"search-palette":void 0,"aria-activedescendant":t?C("search-palette",t):void 0}),l.length>0&&e.jsx(k,{id:"search-palette",groups:l,activeResultId:t,onResultSelect:o=>{a(o.id),s(o.label)},"aria-label":"Search results"})]}),right:e.jsxs(e.Fragment,{children:[e.jsxs(x,{size:"sm",children:[e.jsx(j,{name:"add",size:"sm"}),"New task"]}),e.jsx(d,{initial:"AD",variant:"profile","aria-label":"Alejandra D"})]})})}const oe={title:"Components/Header",component:f,tags:["autodocs"],argTypes:{compact:{description:"Mobile layout mode. Reduces padding and absolute-centers `center` so the title stays optically centered against the left and right slots."}},parameters:{layout:"fullscreen"}},c={render:()=>e.jsx(N,{}),parameters:{viewport:{options:g}}},p={parameters:{viewport:{options:g}},args:{left:e.jsx(v,{segments:[{label:"Tasks",href:"/tasks"},{label:"Calm Execution"}]}),right:e.jsxs(e.Fragment,{children:[e.jsxs(x,{size:"sm",children:[e.jsx(j,{name:"add",size:"sm"}),"New task"]}),e.jsx(d,{initial:"AP",variant:"profile","aria-label":"Alejandra Paez"})]})}};function P(){const[r,s]=i.useState(!1),[t,a]=i.useState(""),l=i.useCallback(h=>{h?.focus()},[]),o=t.length>0?w(t):[];function u(){s(!1),a("")}return e.jsxs("div",{style:{minHeight:"100vh"},children:[e.jsx(f,{compact:!0,left:e.jsxs("div",{className:n.projectRow,children:[e.jsx(d,{initial:"E",variant:"project","aria-label":"Engineering Core"}),e.jsx("span",{className:n.pageTitle,children:"Tasks"})]}),right:e.jsxs(e.Fragment,{children:[e.jsx(D,{icon:"search","aria-label":"Search",onClick:()=>s(!0)}),e.jsx(d,{initial:"AP",variant:"profile","aria-label":"Ale Paez"})]})}),e.jsxs(E,{open:r,onClose:u,fullHeight:!0,"aria-label":"Search",children:[e.jsxs("div",{className:n.searchSheetHeader,children:[e.jsx(S,{ref:l,placeholder:"Jump to task",size:"sm",value:t,onChange:h=>a(h.target.value),onClear:t?()=>a(""):void 0,borderless:!0,className:R.searchPill,style:{fontSize:16}}),e.jsx("button",{type:"button",className:n.cancelButton,onClick:u,children:"Cancel"})]}),o.length>0?e.jsx(k,{groups:o,onResultSelect:()=>u(),variant:"mobile","aria-label":"Search results"}):e.jsxs(e.Fragment,{children:[e.jsx(_,{headingLevel:3,children:"Jump to"}),e.jsxs("nav",{"aria-label":"Jump to",children:[e.jsx(b,{icon:"task_alt",label:"All tasks",href:"#tasks"}),e.jsx(b,{icon:"confirmation_number",label:"All tickets",href:"#tickets"}),e.jsx(b,{icon:"description",label:"All docs",href:"#docs"})]})]})]})]})}const m={render:()=>e.jsx(P,{}),decorators:[A("mobile")],parameters:{viewport:{options:y}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};const le=["Default","LeftOnly","Mobile"];export{c as Default,p as LeftOnly,m as Mobile,le as __namedExportsOrder,oe as default};
