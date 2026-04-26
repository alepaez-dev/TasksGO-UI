import{j as e}from"./jsx-runtime-u17CrQMm.js";import{m as v,r as o}from"./iframe-CY-KSXXP.js";import{w as j}from"./decorators-Ci1Jec0r.js";import{D as g}from"./Drawer-BlJpcRaa.js";import{u as D,S as O}from"./useSelector-CijBW-P-.js";import{I as x}from"./IconButton-BAJ406mH.js";import{F as E}from"./FloatingSearch-BlhoiB4t.js";import{M as R}from"./MobileSearchSheet-C2RO2uwX.js";import{S as T}from"./Sidebar-CgcNMq4M.js";import{S as I}from"./SectionHeader-Cx63El3k.js";import{N as c}from"./NavItem-DCVn9_cO.js";import{A as _}from"./Avatar-BJFP-kGw.js";import"./preload-helper-CyvMmb0J.js";import"./index-QneCgyIl.js";import"./index-DlNAMhfm.js";import"./cn-2dOUpm6k.js";import"./interaction-B76X0LZB.js";import"./Icon-DVcBtTpv.js";import"./SearchInput-CeoPP-B0.js";import"./SearchPalette-Rd6mmJRD.js";import"./sanitizeHref-a0N9eHv-.js";const{expect:b,userEvent:F,waitFor:M}=__STORYBOOK_MODULE_TEST__,A=[{value:"eng-core",label:"Engineering Core"},{value:"mudatec",label:"Mudatec"},{value:"tasksgo",label:"TasksGo"}],N={"eng-core":{initial:"E",label:"Engineering Core"},mudatec:{initial:"M",label:"Mudatec"},tasksgo:{initial:"T",label:"TasksGo"}},ie={title:"Compositions/Drawer",component:g,tags:["autodocs"],parameters:{layout:"fullscreen"}};function w(){const[t,s]=o.useState("eng-core"),[r,a]=o.useState("tasks"),{ref:i,open:l,onOpenChange:S}=D(),p=N[t],n=u=>C=>{C.preventDefault(),a(u)};return e.jsxs(T,{"aria-label":"Sidebar navigation",header:e.jsx(O,{ref:i,options:A,value:t,onValueChange:s,open:l,onOpenChange:S,triggerPrefix:e.jsx(_,{initial:p.initial,"aria-label":p.label}),action:{label:"Add project",icon:"add",onClick:()=>{}}}),footer:e.jsxs(e.Fragment,{children:[e.jsx(c,{icon:"settings",label:"Settings",href:"/settings",size:"sm"}),e.jsx(c,{icon:"help",label:"Support",href:"/support",size:"sm"})]}),children:[e.jsx(I,{children:"Project Artifacts"}),e.jsx(c,{icon:"task_alt",label:"Tasks",href:"/tasks",active:r==="tasks",onClick:n("tasks")}),e.jsx(c,{icon:"confirmation_number",label:"Tickets",href:"/tickets",active:r==="tickets",onClick:n("tickets")}),e.jsx(c,{icon:"description",label:"Docs",href:"/docs",active:r==="docs",onClick:n("docs")})]})}function k(t){const[s,r]=o.useState(!1);return e.jsxs("div",{style:{minHeight:"100vh"},children:[e.jsx(x,{icon:"menu","aria-label":"Open menu",onClick:()=>r(!0)}),e.jsx(g,{...t,open:s,onClose:()=>r(!1),"aria-label":"Navigation menu",children:e.jsx(w,{})})]})}const d={render:t=>e.jsx(k,{...t})};function L(t){const[s,r]=o.useState(!1);return e.jsxs("div",{style:{minHeight:"100vh"},children:[e.jsx(x,{icon:"menu","aria-label":"Open menu",onClick:()=>r(!0)}),e.jsx(g,{...t,open:s,onClose:()=>r(!1),side:"right","aria-label":"Details panel",children:e.jsx("div",{style:{padding:"48px 24px 24px"},children:e.jsx("p",{children:"Right-side drawer content"})})})]})}const m={args:{side:"right"},render:t=>e.jsx(L,{...t})},h={render:t=>e.jsx(k,{...t}),decorators:[j("mobile")],parameters:{viewport:{options:v}}},y=[{title:"Jump to Task",results:[{id:"r1",label:"Refactor Kubernetes service discovery",refId:"T-104",type:"task"},{id:"r2",label:"Implement Redis cache for metadata",refId:"T-42",type:"task"}]},{title:"Jump to Ticket",results:[{id:"r3",label:"Audit IAM permissions for staging",refId:"ENG-902",type:"ticket"}]}];function V(t){const s=t.toLowerCase();return y.map(r=>({...r,results:r.results.filter(a=>a.label.toLowerCase().includes(s)||a.refId.toLowerCase().includes(s))})).filter(r=>r.results.length>0)}function q(t){const[s,r]=o.useState(!1),[a,i]=o.useState(!1),[l,S]=o.useState(""),p=l.length>0?V(l):y;return e.jsxs("div",{style:{minHeight:"200vh",position:"relative"},children:[e.jsx(x,{icon:"menu","aria-label":"Open menu",onClick:()=>r(!0)}),e.jsx("div",{style:{padding:"64px 16px"},children:Array.from({length:30},(n,u)=>e.jsxs("p",{style:{margin:"16px 0",color:"var(--ds-color-text-secondary)"},children:["Scrollable content line ",u+1]},u))}),e.jsx(E,{placeholder:"Search tasks...",shortcutHint:"⌘K",value:l,onChange:n=>{S(n.target.value),a||i(!0)},onFocus:()=>i(!0)}),e.jsx(R,{open:a,onClose:()=>i(!1),groups:p,emptyState:"No results found"}),e.jsx(g,{...t,open:s,onClose:()=>r(!1),"aria-label":"Navigation menu",children:e.jsx(w,{})})]})}const f={render:t=>e.jsx(q,{...t}),decorators:[j("mobile")],parameters:{viewport:{options:v},scrollLock:!0},play:async({canvasElement:t})=>{const s=t.querySelector('input[placeholder="Search tasks..."]');if(!s)throw new Error("Search input not found");await F.click(s),await M(()=>{const a=t.ownerDocument.querySelector('[aria-label="Search results"]');b(a).toBeTruthy()});const r=t.ownerDocument;b(r.body.style.overflow).toBe("hidden")}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <DefaultRender {...args} />
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    side: 'right'
  },
  render: args => <RightSideRender {...args} />
}`,...m.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <DefaultRender {...args} />,
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions
    }
  }
}`,...h.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <WithFloatingSearchRender {...args} />,
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions
    },
    scrollLock: true
  },
  play: async ({
    canvasElement
  }) => {
    const searchInput = canvasElement.querySelector<HTMLInputElement>('input[placeholder="Search tasks..."]');
    if (!searchInput) throw new Error('Search input not found');
    await userEvent.click(searchInput);
    await waitFor(() => {
      const sheet = canvasElement.ownerDocument.querySelector('[aria-label="Search results"]');
      expect(sheet).toBeTruthy();
    });
    const doc = canvasElement.ownerDocument;
    expect(doc.body.style.overflow).toBe('hidden');
  }
}`,...f.parameters?.docs?.source}}};const le=["Default","RightSide","Mobile","WithFloatingSearch"];export{d as Default,h as Mobile,m as RightSide,f as WithFloatingSearch,le as __namedExportsOrder,ie as default};
