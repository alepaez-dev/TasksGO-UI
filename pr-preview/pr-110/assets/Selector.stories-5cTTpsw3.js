import{j as o}from"./jsx-runtime-u17CrQMm.js";import{r as p}from"./iframe-DwpLYT4H.js";import{S as d,u}from"./useSelector-Cg9yTZ9G.js";import{o as T,a as L,b as P}from"./orderByStyles-Lqvs12bl.js";import{A as m}from"./Avatar-COGFbGGM.js";import{S as R}from"./SearchInput-DD-5pYHg.js";import"./preload-helper-D-0AhmOY.js";import"./cn-2dOUpm6k.js";import"./Icon-oo0urz3l.js";const V=[{value:"eng-core",label:"Engineering Core"},{value:"mudatec",label:"Mudatec"},{value:"tasksgo",label:"TasksGo"}],k={"eng-core":{initial:"E",label:"Engineering Core"},mudatec:{initial:"M",label:"Mudatec"},tasksgo:{initial:"T",label:"TasksGo"}},Y={title:"Components/Selector",component:d,tags:["autodocs"],parameters:{docs:{description:{component:["Selector is fully controlled — pair it with a state hook:","- **`useSelectorState`** — standalone selector with click-outside detection.","- **`useSelectorGroup`** — multiple selectors with mutual exclusion (only one open at a time). Use `useSelectorState` instead when selectors are independent and may open simultaneously."].join(`
`)}}},argTypes:{options:{control:"object"},action:{control:"object"}},decorators:[e=>o.jsx("div",{style:{width:"256px",padding:"24px"},children:o.jsx(e,{})})]};function B({options:e}){const[a,n]=p.useState("eng-core"),{ref:r,open:t,onOpenChange:s}=u(),i=k[a];return o.jsx(d,{ref:r,options:e,value:a,onValueChange:n,open:t,onOpenChange:s,triggerPrefix:o.jsx(m,{initial:i.initial,"aria-label":i.label})})}const v={args:{options:V},render:e=>o.jsx(B,{options:e.options})};function I({options:e,action:a}){const[n,r]=p.useState("eng-core"),{ref:t,open:s,onOpenChange:i}=u(),g=k[n];return o.jsx(d,{ref:t,options:e,value:n,onValueChange:r,open:s,onOpenChange:i,triggerPrefix:o.jsx(m,{initial:g.initial,"aria-label":g.label}),action:a})}const f={args:{options:V,action:{label:"Add project",icon:"add",onClick:()=>{}}},render:e=>o.jsx(I,{options:e.options,action:e.action})};function M({options:e}){const[a,n]=p.useState(void 0),{ref:r,open:t,onOpenChange:s}=u(),i=a?k[a]:void 0;return o.jsx(d,{ref:r,options:e,value:a,onValueChange:n,open:t,onOpenChange:s,placeholder:"Choose project…",triggerPrefix:i?o.jsx(m,{initial:i.initial,"aria-label":i.label}):o.jsx(m,{initial:"?","aria-label":"No project selected"})})}const h={args:{options:V},render:e=>o.jsx(M,{options:e.options})},N=[{value:"critical",label:"Critical",icon:"flag",iconColor:"var(--ds-color-status-critical)"},{value:"high",label:"High",icon:"flag",iconColor:"var(--ds-color-status-high)"},{value:"medium",label:"Medium",icon:"flag",iconColor:"var(--ds-color-status-medium)"},{value:"low",label:"Low",icon:"flag",iconColor:"var(--ds-color-status-low)"}];function E({options:e}){const[a,n]=p.useState("high"),{ref:r,open:t,onOpenChange:s}=u();return o.jsx(d,{ref:r,options:e,value:a,onValueChange:n,open:t,onOpenChange:s,variant:"inline","aria-label":"Select priority"})}const x={args:{options:N},render:e=>o.jsx(E,{options:e.options})},A=[{value:"T-42",label:"Implement dynamic edge-caching...",prefix:"T-42"},{value:"T-104",label:"Implement unit tests for cache logic",prefix:"T-104"},{value:"T-105",label:"Update staging environment config",prefix:"T-105"}];function D(){const[e,a]=p.useState("T-42"),[n,r]=p.useState(""),{ref:t,open:s,onOpenChange:i}=u(),g=n?A.filter(c=>c.label.toLowerCase().includes(n.toLowerCase())||c.prefix.toLowerCase().includes(n.toLowerCase())):[...A];return o.jsx(d,{ref:t,options:g,value:e,onValueChange:c=>{a(c),r("")},open:s,onOpenChange:i,header:o.jsx(R,{value:n,onChange:c=>r(c.target.value),placeholder:"Search tickets...",size:"sm"}),action:{label:"Create new ticket",icon:"add",onClick:()=>{}},variant:"inline",emptyState:"No results found","aria-label":"Linked ticket"})}const S={render:()=>o.jsx(D,{})},H=Array.from({length:20},(e,a)=>({value:`opt-${a+1}`,label:`Option ${a+1}`}));function W({options:e}){const[a,n]=p.useState("opt-1"),{ref:r,open:t,onOpenChange:s}=u();return o.jsx(d,{ref:r,options:e,value:a,onValueChange:n,open:t,onOpenChange:s,"aria-label":"Many options"})}const y={args:{options:H},render:e=>o.jsx(W,{options:e.options})},j=[{value:"ale",label:"Ale H.",initial:"AH",color:"#7D9B84"},{value:"cleo",label:"Cleo H.",initial:"CH",color:"#C38E70"},{value:"vader",label:"Vader P.",initial:"VP",color:"#6C89A8"},{value:"loki",label:"Loki P.",initial:"LP",color:"#7B6FA0"}];function z(){const[e,a]=p.useState("ale"),[n,r]=p.useState(""),{ref:t,open:s,onOpenChange:i}=u(),g=n?j.filter(l=>l.label.toLowerCase().includes(n.toLowerCase())):j,c=j.find(l=>l.value===e);return o.jsx(d,{ref:t,options:g,value:e,onValueChange:l=>{a(l),r("")},open:s,onOpenChange:i,header:o.jsx(R,{value:n,onChange:l=>r(l.target.value),placeholder:"Search members...",size:"sm"}),triggerPrefix:o.jsx(m,{variant:"profile",initial:c?.initial??"?","aria-label":c?.label??"No assignee",tint:c?.color}),renderTriggerLabel:l=>l.label,renderOptionIndicator:l=>{const b=j.find(w=>w.value===l.value);return b?o.jsx(m,{variant:"profile",size:"sm",initial:b.initial,"aria-label":b.label,tint:b.color}):null},variant:"inline",emptyState:"No members found","aria-label":"Select assignee"})}const C={render:()=>o.jsx(z,{})};function G(){const e=[{value:"priority",label:"Priority"},{value:"due-date",label:"Due date"}],[a,n]=p.useState("priority"),{ref:r,open:t,onOpenChange:s}=u();return o.jsx(d,{ref:r,options:e,value:a,onValueChange:n,open:t,onOpenChange:s,variant:"inline",renderTriggerLabel:i=>o.jsxs("span",{style:T,children:[o.jsx("span",{style:L,children:"Order by: "}),o.jsx("span",{style:P,children:i.label})]}),renderOptionIndicator:()=>null,"aria-label":"Sort tasks by"})}const O={decorators:[e=>o.jsx("div",{style:{display:"flex",justifyContent:"center",padding:"24px"},children:o.jsx(e,{})})],render:()=>o.jsx(G,{})};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <SearchableRender />
}`,...S.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    options: manyOptions
  },
  render: args => <ManyOptionsRender options={args.options} />
}`,...y.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}};const Z=["Default","WithAction","NoSelection","IconOptions","Searchable","ManyOptions","AvatarOptions","OrderBy"];export{C as AvatarOptions,v as Default,x as IconOptions,y as ManyOptions,h as NoSelection,O as OrderBy,S as Searchable,f as WithAction,Z as __namedExportsOrder,Y as default};
