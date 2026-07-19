import{j as o}from"./jsx-runtime-u17CrQMm.js";import{r as p}from"./iframe-C3ln3lUW.js";import{S as d}from"./Selector-C-cLhtJI.js";import{u}from"./useSelector-sKtPcCXi.js";import{o as L,a as P,b as E}from"./orderByStyles-Lqvs12bl.js";import{A as g}from"./Avatar-7h592syz.js";import{S as w}from"./SearchInput-CmZtDVJk.js";import"./preload-helper-BXjOkAHB.js";import"./cn-2dOUpm6k.js";import"./Icon-CVdn13on.js";import"./OptionList-CImnGFAO.js";const A=[{value:"eng-core",label:"Engineering Core"},{value:"mudatec",label:"Mudatec"},{value:"tasksgo",label:"TasksGo"}],k={"eng-core":{initial:"E",label:"Engineering Core"},mudatec:{initial:"M",label:"Mudatec"},tasksgo:{initial:"T",label:"TasksGo"}},oe={title:"Components/Selector",component:d,tags:["autodocs"],parameters:{docs:{description:{component:["Selector is fully controlled — pair it with a state hook:","- **`useSelectorState`** — standalone selector with click-outside detection.","- **`useSelectorGroup`** — multiple selectors with mutual exclusion (only one open at a time). Use `useSelectorState` instead when selectors are independent and may open simultaneously."].join(`
`)}}},argTypes:{options:{control:"object"},action:{control:"object"}},decorators:[e=>o.jsx("div",{style:{width:"256px",padding:"24px"},children:o.jsx(e,{})})]};function B({options:e}){const[a,r]=p.useState("eng-core"),{ref:n,open:t,onOpenChange:s}=u(),i=k[a];return o.jsx(d,{ref:n,options:e,value:a,onValueChange:r,open:t,onOpenChange:s,triggerPrefix:o.jsx(g,{initial:i.initial,"aria-label":i.label})})}const v={args:{options:A},render:e=>o.jsx(B,{options:e.options})},f={args:{options:A},render:e=>o.jsx(d,{options:e.options,value:"eng-core",open:!0,onOpenChange:()=>{},triggerPrefix:o.jsx(g,{initial:"E","aria-label":"Engineering Core"}),"aria-label":"Select project"})};function I({options:e,action:a}){const[r,n]=p.useState("eng-core"),{ref:t,open:s,onOpenChange:i}=u(),m=k[r];return o.jsx(d,{ref:t,options:e,value:r,onValueChange:n,open:s,onOpenChange:i,triggerPrefix:o.jsx(g,{initial:m.initial,"aria-label":m.label}),action:a})}const h={args:{options:A,action:{label:"Add project",icon:"add",onClick:()=>{}}},render:e=>o.jsx(I,{options:e.options,action:e.action})};function M({options:e}){const[a,r]=p.useState(void 0),{ref:n,open:t,onOpenChange:s}=u(),i=a?k[a]:void 0;return o.jsx(d,{ref:n,options:e,value:a,onValueChange:r,open:t,onOpenChange:s,placeholder:"Choose project…",triggerPrefix:i?o.jsx(g,{initial:i.initial,"aria-label":i.label}):o.jsx(g,{initial:"?","aria-label":"No project selected"})})}const x={args:{options:A},render:e=>o.jsx(M,{options:e.options})},N=[{value:"critical",label:"Critical",icon:"flag",iconColor:"var(--ds-color-status-critical)"},{value:"high",label:"High",icon:"flag",iconColor:"var(--ds-color-status-high)"},{value:"medium",label:"Medium",icon:"flag",iconColor:"var(--ds-color-status-medium)"},{value:"low",label:"Low",icon:"flag",iconColor:"var(--ds-color-status-low)"}];function D({options:e}){const[a,r]=p.useState("high"),{ref:n,open:t,onOpenChange:s}=u();return o.jsx(d,{ref:n,options:e,value:a,onValueChange:r,open:t,onOpenChange:s,variant:"inline","aria-label":"Select priority"})}const S={args:{options:N},render:e=>o.jsx(D,{options:e.options})},R=[{value:"T-42",label:"Implement dynamic edge-caching...",prefix:"T-42"},{value:"T-104",label:"Implement unit tests for cache logic",prefix:"T-104"},{value:"T-105",label:"Update staging environment config",prefix:"T-105"}];function H(){const[e,a]=p.useState("T-42"),[r,n]=p.useState(""),{ref:t,open:s,onOpenChange:i}=u(),m=r?R.filter(c=>c.label.toLowerCase().includes(r.toLowerCase())||c.prefix.toLowerCase().includes(r.toLowerCase())):[...R];return o.jsx(d,{ref:t,options:m,value:e,onValueChange:c=>{a(c),n("")},open:s,onOpenChange:i,header:o.jsx(w,{value:r,onChange:c=>n(c.target.value),placeholder:"Search tickets...",size:"sm"}),action:{label:"Create new ticket",icon:"add",onClick:()=>{}},variant:"inline",emptyState:"No results found","aria-label":"Linked ticket"})}const j={render:()=>o.jsx(H,{})},W=Array.from({length:20},(e,a)=>({value:`opt-${a+1}`,label:`Option ${a+1}`}));function z({options:e}){const[a,r]=p.useState("opt-1"),{ref:n,open:t,onOpenChange:s}=u();return o.jsx(d,{ref:n,options:e,value:a,onValueChange:r,open:t,onOpenChange:s,"aria-label":"Many options"})}const y={args:{options:W},render:e=>o.jsx(z,{options:e.options})},C=[{value:"ale",label:"Ale H.",initial:"AH",color:"#7D9B84"},{value:"cleo",label:"Cleo H.",initial:"CH",color:"#C38E70"},{value:"vader",label:"Vader P.",initial:"VP",color:"#6C89A8"},{value:"loki",label:"Loki P.",initial:"LP",color:"#7B6FA0"}];function G(){const[e,a]=p.useState("ale"),[r,n]=p.useState(""),{ref:t,open:s,onOpenChange:i}=u(),m=r?C.filter(l=>l.label.toLowerCase().includes(r.toLowerCase())):C,c=C.find(l=>l.value===e);return o.jsx(d,{ref:t,options:m,value:e,onValueChange:l=>{a(l),n("")},open:s,onOpenChange:i,header:o.jsx(w,{value:r,onChange:l=>n(l.target.value),placeholder:"Search members...",size:"sm"}),triggerPrefix:o.jsx(g,{variant:"profile",initial:c?.initial??"?","aria-label":c?.label??"No assignee",tint:c?.color}),renderTriggerLabel:l=>l.label,renderOptionIndicator:l=>{const b=C.find(T=>T.value===l.value);return b?o.jsx(g,{variant:"profile",size:"sm",initial:b.initial,"aria-label":b.label,tint:b.color}):null},variant:"inline",emptyState:"No members found","aria-label":"Select assignee"})}const O={render:()=>o.jsx(G,{})};function _(){const e=[{value:"priority",label:"Priority"},{value:"due-date",label:"Due date"}],[a,r]=p.useState("priority"),{ref:n,open:t,onOpenChange:s}=u();return o.jsx(d,{ref:n,options:e,value:a,onValueChange:r,open:t,onOpenChange:s,variant:"inline",renderTriggerLabel:i=>o.jsxs("span",{style:L,children:[o.jsx("span",{style:P,children:"Order by: "}),o.jsx("span",{style:E,children:i.label})]}),renderOptionIndicator:()=>null,"aria-label":"Sort tasks by"})}const V={decorators:[e=>o.jsx("div",{style:{display:"flex",justifyContent:"center",padding:"24px"},children:o.jsx(e,{})})],render:()=>o.jsx(_,{})};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    options: projects
  },
  render: args => <DefaultRender options={args.options} />
}`,...v.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    options: projects
  },
  render: args => <Selector options={args.options} value="eng-core" open onOpenChange={() => {}} triggerPrefix={<Avatar initial="E" aria-label="Engineering Core" />} aria-label="Select project" />
}`,...f.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    options: projects,
    action: {
      label: 'Add project',
      icon: 'add',
      onClick: () => {}
    }
  },
  render: args => <WithActionRender options={args.options} action={args.action} />
}`,...h.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    options: projects
  },
  render: args => <NoSelectionRender options={args.options} />
}`,...x.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    options: priorityOptions
  },
  render: args => <IconOptionsRender options={args.options} />
}`,...S.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <SearchableRender />
}`,...j.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    options: manyOptions
  },
  render: args => <ManyOptionsRender options={args.options} />
}`,...y.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <AvatarOptionsRender />
}`,...O.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <div style={{
    display: 'flex',
    justifyContent: 'center',
    padding: '24px'
  }}>
        <Story />
      </div>],
  render: () => <OrderByRender />
}`,...V.parameters?.docs?.source}}};const ae=["Default","Open","WithAction","NoSelection","IconOptions","Searchable","ManyOptions","AvatarOptions","OrderBy"];export{O as AvatarOptions,v as Default,S as IconOptions,y as ManyOptions,x as NoSelection,f as Open,V as OrderBy,j as Searchable,h as WithAction,ae as __namedExportsOrder,oe as default};
