import{j as o}from"./jsx-runtime-u17CrQMm.js";import{r as p}from"./iframe-DRR0ge1c.js";import{S as d,u}from"./useSelector-D2yXX-fC.js";import{o as T,a as L,b as P}from"./orderByStyles-Lqvs12bl.js";import{A as m}from"./Avatar-DfY7Vpzc.js";import{S as R}from"./SearchInput-DG9zEQeb.js";import"./preload-helper-BEwTLl-L.js";import"./cn-2dOUpm6k.js";import"./Icon-l85gbPLJ.js";const k=[{value:"eng-core",label:"Engineering Core"},{value:"mudatec",label:"Mudatec"},{value:"tasksgo",label:"TasksGo"}],V={"eng-core":{initial:"E",label:"Engineering Core"},mudatec:{initial:"M",label:"Mudatec"},tasksgo:{initial:"T",label:"TasksGo"}},Y={title:"Components/Selector",component:d,tags:["autodocs"],parameters:{docs:{description:{component:["Selector is fully controlled — pair it with a state hook:","- **`useSelectorState`** — standalone selector with click-outside detection.","- **`useSelectorGroup`** — multiple selectors with mutual exclusion (only one open at a time). Use `useSelectorState` instead when selectors are independent and may open simultaneously."].join(`
`)}}},argTypes:{options:{control:"object"},action:{control:"object"}},decorators:[e=>o.jsx("div",{style:{width:"256px",padding:"24px"},children:o.jsx(e,{})})]};function B({options:e}){const[a,r]=p.useState("eng-core"),{ref:n,open:t,onOpenChange:s}=u(),i=V[a];return o.jsx(d,{ref:n,options:e,value:a,onValueChange:r,open:t,onOpenChange:s,triggerPrefix:o.jsx(m,{initial:i.initial,"aria-label":i.label})})}const v={args:{options:k},render:e=>o.jsx(B,{options:e.options})};function I({options:e,action:a}){const[r,n]=p.useState("eng-core"),{ref:t,open:s,onOpenChange:i}=u(),g=V[r];return o.jsx(d,{ref:t,options:e,value:r,onValueChange:n,open:s,onOpenChange:i,triggerPrefix:o.jsx(m,{initial:g.initial,"aria-label":g.label}),action:a})}const f={args:{options:k,action:{label:"Add project",icon:"add",onClick:()=>{}}},render:e=>o.jsx(I,{options:e.options,action:e.action})};function M({options:e}){const[a,r]=p.useState(void 0),{ref:n,open:t,onOpenChange:s}=u(),i=a?V[a]:void 0;return o.jsx(d,{ref:n,options:e,value:a,onValueChange:r,open:t,onOpenChange:s,placeholder:"Choose project…",triggerPrefix:i?o.jsx(m,{initial:i.initial,"aria-label":i.label}):o.jsx(m,{initial:"?","aria-label":"No project selected"})})}const h={args:{options:k},render:e=>o.jsx(M,{options:e.options})},N=[{value:"critical",label:"Critical",icon:"flag",iconColor:"var(--ds-color-status-critical)"},{value:"high",label:"High",icon:"flag",iconColor:"var(--ds-color-status-high)"},{value:"medium",label:"Medium",icon:"flag",iconColor:"var(--ds-color-status-medium)"},{value:"low",label:"Low",icon:"flag",iconColor:"var(--ds-color-status-low)"}];function E({options:e}){const[a,r]=p.useState("high"),{ref:n,open:t,onOpenChange:s}=u();return o.jsx(d,{ref:n,options:e,value:a,onValueChange:r,open:t,onOpenChange:s,variant:"inline","aria-label":"Select priority"})}const x={args:{options:N},render:e=>o.jsx(E,{options:e.options})},A=[{value:"T-42",label:"Implement dynamic edge-caching...",prefix:"T-42"},{value:"T-104",label:"Implement unit tests for cache logic",prefix:"T-104"},{value:"T-105",label:"Update staging environment config",prefix:"T-105"}];function D(){const[e,a]=p.useState("T-42"),[r,n]=p.useState(""),{ref:t,open:s,onOpenChange:i}=u(),g=r?A.filter(l=>l.label.toLowerCase().includes(r.toLowerCase())||l.prefix.toLowerCase().includes(r.toLowerCase())):[...A];return o.jsx(d,{ref:t,options:g,value:e,onValueChange:l=>{a(l),n("")},open:s,onOpenChange:i,header:o.jsx(R,{value:r,onChange:l=>n(l.target.value),placeholder:"Search tickets...",size:"sm"}),action:{label:"Create new ticket",icon:"add",onClick:()=>{}},variant:"inline",emptyState:"No results found","aria-label":"Linked ticket"})}const y={render:()=>o.jsx(D,{})},H=Array.from({length:20},(e,a)=>({value:`opt-${a+1}`,label:`Option ${a+1}`}));function W({options:e}){const[a,r]=p.useState("opt-1"),{ref:n,open:t,onOpenChange:s}=u();return o.jsx(d,{ref:n,options:e,value:a,onValueChange:r,open:t,onOpenChange:s,"aria-label":"Many options"})}const S={args:{options:H},render:e=>o.jsx(W,{options:e.options})},j=[{value:"ale",label:"Ale H.",initial:"AH",color:"#7D9B84"},{value:"cleo",label:"Cleo H.",initial:"CH",color:"#C38E70"},{value:"vader",label:"Vader P.",initial:"VP",color:"#6C89A8"},{value:"loki",label:"Loki P.",initial:"LP",color:"#7B6FA0"}];function z(){const[e,a]=p.useState("ale"),[r,n]=p.useState(""),{ref:t,open:s,onOpenChange:i}=u(),g=r?j.filter(c=>c.label.toLowerCase().includes(r.toLowerCase())):j,l=j.find(c=>c.value===e);return o.jsx(d,{ref:t,options:g,value:e,onValueChange:c=>{a(c),n("")},open:s,onOpenChange:i,header:o.jsx(R,{value:r,onChange:c=>n(c.target.value),placeholder:"Search members...",size:"sm"}),triggerPrefix:o.jsx(m,{variant:"profile",initial:l?.initial??"?","aria-label":l?.label??"No assignee",style:l?.color?{backgroundColor:l.color}:void 0}),renderTriggerLabel:c=>c.label,renderOptionIndicator:c=>{const b=j.find(w=>w.value===c.value);return b?o.jsx(m,{variant:"profile",size:"sm",initial:b.initial,"aria-label":b.label,style:{backgroundColor:b.color}}):null},variant:"inline",emptyState:"No members found","aria-label":"Select assignee"})}const C={render:()=>o.jsx(z,{})};function G(){const e=[{value:"priority",label:"Priority"},{value:"due-date",label:"Due date"}],[a,r]=p.useState("priority"),{ref:n,open:t,onOpenChange:s}=u();return o.jsx(d,{ref:n,options:e,value:a,onValueChange:r,open:t,onOpenChange:s,variant:"inline",renderTriggerLabel:i=>o.jsxs("span",{style:T,children:[o.jsx("span",{style:L,children:"Order by: "}),o.jsx("span",{style:P,children:i.label})]}),renderOptionIndicator:()=>null,"aria-label":"Sort tasks by"})}const O={decorators:[e=>o.jsx("div",{style:{display:"flex",justifyContent:"center",padding:"24px"},children:o.jsx(e,{})})],render:()=>o.jsx(G,{})};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    options: projects
  },
  render: args => <DefaultRender options={args.options} />
}`,...v.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    options: projects,
    action: {
      label: 'Add project',
      icon: 'add',
      onClick: () => {}
    }
  },
  render: args => <WithActionRender options={args.options} action={args.action} />
}`,...f.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    options: projects
  },
  render: args => <NoSelectionRender options={args.options} />
}`,...h.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    options: priorityOptions
  },
  render: args => <IconOptionsRender options={args.options} />
}`,...x.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <SearchableRender />
}`,...y.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    options: manyOptions
  },
  render: args => <ManyOptionsRender options={args.options} />
}`,...S.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <AvatarOptionsRender />
}`,...C.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <div style={{
    display: 'flex',
    justifyContent: 'center',
    padding: '24px'
  }}>
        <Story />
      </div>],
  render: () => <OrderByRender />
}`,...O.parameters?.docs?.source}}};const Z=["Default","WithAction","NoSelection","IconOptions","Searchable","ManyOptions","AvatarOptions","OrderBy"];export{C as AvatarOptions,v as Default,x as IconOptions,S as ManyOptions,h as NoSelection,O as OrderBy,y as Searchable,f as WithAction,Z as __namedExportsOrder,Y as default};
