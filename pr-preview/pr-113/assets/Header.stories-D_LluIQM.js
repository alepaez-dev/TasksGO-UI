import{j as e}from"./jsx-runtime-u17CrQMm.js";import{d as b,m as w,r as i}from"./iframe-DfuyBzhB.js";import{w as A}from"./decorators-Db_2aquo.js";import{H as f}from"./Header-DJ6AGnDH.js";import{h as n,s as C}from"./headerLayout.module-DZR5uXZX.js";import{B as g}from"./Button-uiG6ECMs.js";import{I as x}from"./Icon-CK0pVxYt.js";import{A as d}from"./Avatar-BVZk1Nbd.js";import{B as j}from"./Breadcrumb-Bx4sNTIV.js";import{S as v}from"./SearchInput-BRj2Vi1M.js";import{g as R,S}from"./SearchPalette-yMW1mMqb.js";import{I as D}from"./IconButton-IFuyVQKe.js";import{B as E}from"./BottomSheet-CCeQ-lba.js";import{S as I}from"./SectionHeader-B69IBwiI.js";import{N as h}from"./NavItem-DSNKqldk.js";import"./preload-helper-LDNDuAwT.js";import"./cn-2dOUpm6k.js";import"./sanitizeHref-a0N9eHv-.js";import"./useFocusTrap-Ciw4tj0E.js";import"./index-CCfl9b4U.js";import"./index-By5e_liU.js";const O=[{title:"Tasks",results:[{id:"r1",label:"Refactor Kubernetes service discovery",badge:"HIGH",subtitle:"IN PROGRESS · TODAY",type:"task"},{id:"r2",label:"Kube-proxy iptables sync timeout",badge:"MED",subtitle:"OPEN · DEC 23",type:"task"}]},{title:"Docs",results:[{id:"r4",label:"Architecture · Kubernetes topology",subtitle:"EDITED 2D AGO",type:"doc"}]},{title:"Tickets",results:[{id:"r3",label:"TGO-2891 — Kubelet eviction loop",subtitle:"MARIA C · YESTERDAY",type:"ticket"}]}];function k(r){const a=r.toLowerCase();return O.map(t=>({...t,results:t.results.filter(s=>s.label.toLowerCase().includes(a)||(s.badge?.toLowerCase().includes(a)??!1))})).filter(t=>t.results.length>0)}function N(){const[r,a]=i.useState(""),[t,s]=i.useState(),o=r.length>0?k(r):[];return e.jsx(f,{left:e.jsx(j,{segments:[{label:"Tasks",href:"/tasks"},{label:"Calm Execution"}]}),center:e.jsxs(e.Fragment,{children:[e.jsx(v,{role:"combobox",placeholder:"Search or command...",shortcutHint:"⌘K",value:r,onChange:l=>{a(l.target.value),s(void 0)},"aria-expanded":o.length>0,"aria-controls":o.length>0?"search-palette":void 0,"aria-activedescendant":t?R("search-palette",t):void 0}),o.length>0&&e.jsx(S,{id:"search-palette",groups:o,activeResultId:t,onResultSelect:l=>{s(l.id),a(l.label)},"aria-label":"Search results"})]}),right:e.jsxs(e.Fragment,{children:[e.jsxs(g,{size:"sm",children:[e.jsx(x,{name:"add",size:"sm"}),"New task"]}),e.jsx(d,{initial:"AD",variant:"profile","aria-label":"Alejandra D"})]})})}const te={title:"Components/Header",component:f,tags:["autodocs"],argTypes:{compact:{description:"Mobile layout mode. Reduces padding and absolute-centers `center` so the title stays optically centered against the left and right slots."}},parameters:{layout:"fullscreen"}},c={render:()=>e.jsx(N,{}),parameters:{viewport:{options:b}}},p={parameters:{viewport:{options:b}},args:{left:e.jsx(j,{segments:[{label:"Tasks",href:"/tasks"},{label:"Calm Execution"}]}),right:e.jsxs(e.Fragment,{children:[e.jsxs(g,{size:"sm",children:[e.jsx(x,{name:"add",size:"sm"}),"New task"]}),e.jsx(d,{initial:"AP",variant:"profile","aria-label":"Alejandra Paez"})]})}};function P(){const[r,a]=i.useState(!1),[t,s]=i.useState(""),o=i.useRef(null),l=t.length>0?k(t):[];function u(){a(!1),s("")}return e.jsxs("div",{style:{minHeight:"100vh"},children:[e.jsx(f,{compact:!0,left:e.jsxs("div",{className:n.projectRow,children:[e.jsx(d,{initial:"E",variant:"project","aria-label":"Engineering Core"}),e.jsx("span",{className:n.pageTitle,children:"Tasks"})]}),right:e.jsxs(e.Fragment,{children:[e.jsx(D,{icon:"search","aria-label":"Search",onClick:()=>a(!0)}),e.jsx(d,{initial:"AP",variant:"profile","aria-label":"Ale Paez"})]})}),e.jsxs(E,{open:r,onClose:u,onOpened:()=>o.current?.focus(),fullHeight:!0,"aria-label":"Search",children:[e.jsxs("div",{className:n.searchSheetHeader,children:[e.jsx(v,{ref:o,placeholder:"Jump to task",size:"sm",value:t,onChange:y=>s(y.target.value),onClear:t?()=>s(""):void 0,borderless:!0,className:C.searchPill,style:{fontSize:16}}),e.jsx("button",{type:"button",className:n.cancelButton,onClick:u,children:"Cancel"})]}),l.length>0?e.jsx(S,{groups:l,onResultSelect:()=>u(),variant:"mobile","aria-label":"Search results"}):e.jsxs(e.Fragment,{children:[e.jsx(I,{headingLevel:3,children:"Jump to"}),e.jsxs("nav",{"aria-label":"Jump to",children:[e.jsx(h,{icon:"task_alt",label:"All tasks",href:"#tasks"}),e.jsx(h,{icon:"confirmation_number",label:"All tickets",href:"#tickets"}),e.jsx(h,{icon:"description",label:"All docs",href:"#docs"})]})]})]})]})}const m={render:()=>e.jsx(P,{}),decorators:[A("mobile")],parameters:{viewport:{options:w}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};const se=["Default","LeftOnly","Mobile"];export{c as Default,p as LeftOnly,m as Mobile,se as __namedExportsOrder,te as default};
