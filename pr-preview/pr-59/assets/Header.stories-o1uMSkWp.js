import{j as e}from"./jsx-runtime-u17CrQMm.js";import{d as g,m as k,r as l}from"./iframe-C1igReHY.js";import{w as y}from"./decorators-CMPAJAeH.js";import{H as m}from"./Header-B6f7G7eR.js";import{B as f}from"./Button-BFxJcuPF.js";import{I as j}from"./Icon-PwFSjkIY.js";import{A as d}from"./Avatar-B79RJqoZ.js";import{B as x}from"./Breadcrumb-CWcxjzj8.js";import{S as v}from"./SearchInput-BiWUq-4B.js";import{g as R,S as w}from"./SearchPalette-CxoujkfP.js";import{I as b}from"./IconButton-DA7QaXa3.js";import"./preload-helper-KfmS1-JQ.js";import"./cn-2dOUpm6k.js";import"./sanitizeHref-a0N9eHv-.js";const A="_searchPill_14jc5_1",C="_projectRow_14jc5_11",D="_pageTitle_14jc5_17",h={searchPill:A,projectRow:C,pageTitle:D},E=[{title:"Tasks",results:[{id:"r1",label:"Refactor Kubernetes service discovery",badge:"HIGH",subtitle:"IN PROGRESS · TODAY",type:"task"},{id:"r2",label:"Kube-proxy iptables sync timeout",badge:"MED",subtitle:"OPEN · DEC 23",type:"task"}]},{title:"Docs",results:[{id:"r4",label:"Architecture · Kubernetes topology",subtitle:"EDITED 2D AGO",type:"doc"}]},{title:"Tickets",results:[{id:"r3",label:"TGO-2891 — Kubelet eviction loop",subtitle:"MARIA C · YESTERDAY",type:"ticket"}]}];function S(s){const r=s.toLowerCase();return E.map(t=>({...t,results:t.results.filter(a=>a.label.toLowerCase().includes(r)||(a.badge?.toLowerCase().includes(r)??!1))})).filter(t=>t.results.length>0)}function T(){const[s,r]=l.useState(""),[t,a]=l.useState(),i=s.length>0?S(s):[];return e.jsx(m,{left:e.jsx(x,{segments:[{label:"Tasks",href:"/tasks"},{label:"Calm Execution"}]}),center:e.jsxs(e.Fragment,{children:[e.jsx(v,{role:"combobox",placeholder:"Search or command...",shortcutHint:"⌘K",value:s,onChange:o=>{r(o.target.value),a(void 0)},"aria-expanded":i.length>0,"aria-controls":i.length>0?"search-palette":void 0,"aria-activedescendant":t?R("search-palette",t):void 0}),i.length>0&&e.jsx(w,{id:"search-palette",groups:i,activeResultId:t,onResultSelect:o=>{a(o.id),r(o.label)},"aria-label":"Search results"})]}),right:e.jsxs(e.Fragment,{children:[e.jsxs(f,{size:"sm",children:[e.jsx(j,{name:"add",size:"sm"}),"New task"]}),e.jsx(d,{initial:"AD",variant:"profile","aria-label":"Alejandra D"})]})})}const Y={title:"Components/Header",component:m,tags:["autodocs"],argTypes:{compact:{description:"Mobile layout mode. Reduces padding and changes how `center` renders: absolute-centered title when `right` is present, or full-width (e.g. search takeover) when `right` is absent."}},parameters:{layout:"fullscreen"}},n={render:()=>e.jsx(T,{}),parameters:{viewport:{options:g}}},c={parameters:{viewport:{options:g}},args:{left:e.jsx(x,{segments:[{label:"Tasks",href:"/tasks"},{label:"Calm Execution"}]}),right:e.jsxs(e.Fragment,{children:[e.jsxs(f,{size:"sm",children:[e.jsx(j,{name:"add",size:"sm"}),"New task"]}),e.jsx(d,{initial:"AP",variant:"profile","aria-label":"Alejandra Paez"})]})}};function I(){const[s,r]=l.useState(!1),[t,a]=l.useState(""),i=l.useCallback(u=>{u?.focus()},[]),o=t.length>0?S(t):[];return e.jsx("div",{style:{minHeight:"100vh"},children:s?e.jsxs(e.Fragment,{children:[e.jsx(m,{compact:!0,left:e.jsx(b,{icon:"chevron_left",size:"md","aria-label":"Close search",onClick:()=>{r(!1),a("")}}),center:e.jsx(v,{ref:i,placeholder:"Search...",size:"sm",value:t,onChange:u=>a(u.target.value),onClear:t?()=>a(""):void 0,className:h.searchPill,style:{fontSize:16}})}),o.length>0&&e.jsx(w,{groups:o,onResultSelect:()=>{},variant:"mobile","aria-label":"Search results"})]}):e.jsx(m,{compact:!0,left:e.jsxs("div",{className:h.projectRow,children:[e.jsx(d,{initial:"E",variant:"project","aria-label":"Engineering Core"}),e.jsx("span",{className:h.pageTitle,children:"Tasks"})]}),right:e.jsxs(e.Fragment,{children:[e.jsx(b,{icon:"search","aria-label":"Search",onClick:()=>r(!0)}),e.jsx(d,{initial:"AP",variant:"profile","aria-label":"Ale Paez"})]})})})}const p={render:()=>e.jsx(I,{}),decorators:[y("mobile")],parameters:{viewport:{options:k}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <DefaultRender />,
  parameters: {
    viewport: {
      options: desktopViewports
    }
  }
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <MobileRender />,
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions
    }
  }
}`,...p.parameters?.docs?.source}}};const Q=["Default","LeftOnly","Mobile"];export{n as Default,c as LeftOnly,p as Mobile,Q as __namedExportsOrder,Y as default};
