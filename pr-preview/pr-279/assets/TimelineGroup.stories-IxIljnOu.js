import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-GS4NPPdF.js";import{c as _}from"./cn-2dOUpm6k.js";import{I as R}from"./Icon-C-U7Z5pG.js";import{T as a}from"./TimelineEvent-CKZsEFB0.js";import{B as x}from"./Badge-CdSQy8aw.js";import"./preload-helper-D_a3GMB9.js";const O="_group_t25ca_1",D="_toggle_t25ca_9",F="_toggleOpen_t25ca_40",L="_count_t25ca_44",Q="_summary_t25ca_62",q="_meta_t25ca_70",J="_chevron_t25ca_80",W="_moreExpanded_t25ca_87",G="_match_t25ca_91",M="_items_t25ca_102",P="_moreRow_t25ca_112",z="_more_t25ca_87",t={group:O,toggle:D,toggleOpen:F,count:L,summary:Q,meta:q,chevron:J,moreExpanded:W,match:G,items:M,moreRow:P,more:z},w=o.forwardRef(({count:n,summary:r,meta:c,open:s,onOpenChange:i,matchLabel:m,moreLabel:p,onMoreToggle:f,moreExpanded:T,className:C,children:k,...N},I)=>{const j=o.useId(),E=o.useRef(null),S=o.useRef(s);return o.useEffect(()=>{const B=S.current&&!s;S.current=s,B&&document.activeElement===document.body&&E.current?.focus()},[s]),e.jsxs("li",{ref:I,className:_(t.group,C),...N,children:[e.jsxs("button",{ref:E,type:"button",className:_(t.toggle,s&&t.toggleOpen),onClick:()=>i(!s),"aria-expanded":s,"aria-controls":j,children:[e.jsx("span",{className:t.count,"aria-hidden":"true",children:n}),e.jsx("span",{className:t.summary,children:r}),c!==void 0&&e.jsx("span",{className:t.meta,children:c}),e.jsx(R,{name:"expand_more",size:"xs",className:t.chevron}),m!==void 0&&e.jsx("span",{className:t.match,children:m})]}),s&&e.jsxs("ul",{id:j,className:t.items,children:[k,p!==void 0&&e.jsx("li",{className:t.moreRow,children:e.jsxs("button",{type:"button",className:t.more,onClick:f,"aria-expanded":T,children:[e.jsx(R,{name:"expand_more",size:"xs",className:_(t.chevron,T&&t.moreExpanded)}),p]})})]})]})});w.displayName="TimelineGroup";w.__docgenInfo={description:"",methods:[],displayName:"TimelineGroup",props:{count:{required:!0,tsType:{name:"number"},description:"Drives the badge, and nothing else. Actions belonging to whoever the run\nis attributed to: a person's own updates excluding system extras, or\nevery row of a system-only run — `countActions(group)` computes it."},summary:{required:!0,tsType:{name:"ReactNode"},description:'Prose for the pill, e.g. "Jordan D. performed 2 updates". Expected to\nrestate `count`: the badge is hidden from assistive tech to avoid\nannouncing the number twice, so this is where the count is spoken.'},meta:{required:!1,tsType:{name:"ReactNode"},description:'Fields and timestamp, e.g. "· labels, sprint · 1d 2h ago" — rendered smaller, and truncates before the summary does.'},open:{required:!0,tsType:{name:"boolean"},description:""},onOpenChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:""},matchLabel:{required:!1,tsType:{name:"ReactNode"},description:'Search only, e.g. "1 of 2 match".'},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const Z={title:"Components/TimelineGroup",component:w,tags:["autodocs"],parameters:{docs:{description:{component:'A collapsed run of consecutive events by one person, or of automated events with no person behind them. Renders an `<li>` — wrap it in the feed’s `<ul>`. Takes `TimelineEvent` rows as children rather than data, so the page decides which are muted, pinned or highlighted. `count` is the actions belonging to whoever the run is attributed to — use `countActions(group)`. For a person that excludes system extras, so eight updates plus an automated build reads "8 updates" over nine rows; a run with no person behind it counts every row, reading "4 system events". Rows are unmounted while collapsed, not hidden. Long runs are capped by the page, which passes `moreLabel` and `onMoreToggle`.'}}},argTypes:{count:{control:{type:"number",min:1}},summary:{control:"text"},meta:{control:"text"},open:{control:"boolean"},matchLabel:{control:"text"},moreLabel:{control:"text"},onOpenChange:{control:!1},children:{control:!1}},args:{count:2,summary:"Jordan D. performed 2 updates",meta:"· labels, sprint · 1d 2h ago",open:!1},decorators:[n=>e.jsx("ul",{style:{listStyle:"none",margin:0,background:"var(--ds-color-surface-secondary)",padding:24,width:620,display:"flex",flexDirection:"column",gap:"var(--ds-space-timeline-event-row-gap)"},children:e.jsx(n,{})})]},d=e.jsxs(e.Fragment,{children:[e.jsxs(a,{variant:"nested",icon:"tag",timestamp:"1d 2h ago",children:["added label ",e.jsx(x,{variant:"progress",children:"needs-qa"})]}),e.jsxs(a,{variant:"nested",icon:"schedule",timestamp:"1d 2h ago",children:["set sprint to ",e.jsx(x,{variant:"progress",children:"Q1-W4-INFRA"})]})]});function A({moreLabel:n,...r}){const[c,s]=o.useState(r.open),[i,m]=o.useState(!1),p=n===void 0?{}:{moreLabel:i?"Show less":n,onMoreToggle:()=>m(f=>!f),moreExpanded:i};return e.jsxs(w,{...r,...p,open:c,onOpenChange:s,children:[r.children,i&&e.jsxs(a,{variant:"nested",icon:"person",timestamp:"1d 8h ago",children:["added ",e.jsx("b",{children:"Mike R."})," as a watcher"]})]})}const l={render:n=>e.jsx(A,{...n},String(n.open)),args:{children:d},parameters:{docs:{description:{story:"Interactive — the toggle really opens and closes."}}}},h={args:{open:!0,children:d}},u={args:{open:!0,count:2,summary:"Jordan D. performed 2 updates",meta:"· status, description · 1d 8h ago",children:e.jsxs(e.Fragment,{children:[e.jsxs(a,{variant:"nested",icon:"schedule",timestamp:"1d 8h ago",children:["changed status ",e.jsx(x,{variant:"todo",children:"To Do"})," →"," ",e.jsx(x,{variant:"progress",children:"In Progress"})]}),e.jsx(a,{variant:"nested",muted:!0,icon:"task_alt",timestamp:"1d 8h ago",children:"Build #1847 triggered automatically"}),e.jsx(a,{variant:"nested",icon:"edit",timestamp:"1d 8h ago",children:"updated the description"})]})},parameters:{docs:{description:{story:'The count says 2, not 3. The automated build happened inside Jordan’s run and is shown for context, but it is not one of his updates — matching the mockup, whose pill reads "8 updates" over nine rows.'}}}},g={render:n=>e.jsx(A,{...n},String(n.open)),args:{open:!0,count:9,summary:"Jordan D. performed 9 updates",meta:"· status, description, labels · 1d 8h ago",moreLabel:"Show 5 more",children:d}},y={args:{open:!0,matchLabel:"1 of 2 match",children:d},parameters:{docs:{description:{story:"While a search is active, a group holding a match expands and reports how many of its rows matched."}}}},v={args:{open:!1,summary:"Bartholomew Featherstonehaugh-Wellesley performed 14 updates",meta:"· status, description, labels, sprint, priority · 1d 8h ago",children:d},parameters:{docs:{description:{story:"Both slots truncate rather than wrap: the pill is a stadium and only reads as one on a single line. The meta gives way before the actor and the action do, and the count, chevron and match chip never shrink."}}}},b={args:{open:!0,count:4,summary:"4 system events",meta:"· CI, deploys, QA runs · 20m ago",children:e.jsxs(e.Fragment,{children:[e.jsxs(a,{variant:"nested",icon:"task_alt",timestamp:"34m ago",children:["Build ",e.jsx("b",{children:"#1847"})," passed on ",e.jsx("b",{children:"QA-01"})]}),e.jsxs(a,{variant:"nested",icon:"science",timestamp:"28m ago",children:["QA scenario ",e.jsx("b",{children:"TC-412"})," marked Failed"]}),e.jsxs(a,{variant:"nested",icon:"file_upload",timestamp:"24m ago",children:["Deployed ",e.jsx("b",{children:"edge-gateway-service"})," to ",e.jsx("b",{children:"QA-02"})]}),e.jsxs(a,{variant:"nested",icon:"image",timestamp:"20m ago",children:["Evidence ",e.jsx("b",{children:"rate_429.png"})," attached to TC-412"]})]})},parameters:{docs:{description:{story:'A run with no person behind it is never attributed to one: it reads "4 system events", not a bot’s name. `ActivityGroup.actor` holds whichever bot happened to be first, so naming it would credit a deploy to CI.'}}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <Interactive key={String(args.open)} {...args} />,
  args: {
    children: twoRows
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive — the toggle really opens and closes.'
      }
    }
  }
}`,...l.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    open: true,
    children: twoRows
  }
}`,...h.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    open: true,
    count: 2,
    summary: 'Jordan D. performed 2 updates',
    meta: '· status, description · 1d 8h ago',
    children: <>
        <TimelineEvent variant="nested" icon="schedule" timestamp="1d 8h ago">
          changed status <Badge variant="todo">To Do</Badge> →{' '}
          <Badge variant="progress">In Progress</Badge>
        </TimelineEvent>
        <TimelineEvent variant="nested" muted icon="task_alt" timestamp="1d 8h ago">
          Build #1847 triggered automatically
        </TimelineEvent>
        <TimelineEvent variant="nested" icon="edit" timestamp="1d 8h ago">
          updated the description
        </TimelineEvent>
      </>
  },
  parameters: {
    docs: {
      description: {
        story: 'The count says 2, not 3. The automated build happened inside Jordan’s run and is shown for context, but it is not one of his updates — matching the mockup, whose pill reads "8 updates" over nine rows.'
      }
    }
  }
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <Interactive key={String(args.open)} {...args} />,
  args: {
    open: true,
    count: 9,
    summary: 'Jordan D. performed 9 updates',
    meta: '· status, description, labels · 1d 8h ago',
    moreLabel: 'Show 5 more',
    children: twoRows
  }
}`,...g.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    open: true,
    matchLabel: '1 of 2 match',
    children: twoRows
  },
  parameters: {
    docs: {
      description: {
        story: 'While a search is active, a group holding a match expands and reports how many of its rows matched.'
      }
    }
  }
}`,...y.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    open: false,
    summary: 'Bartholomew Featherstonehaugh-Wellesley performed 14 updates',
    meta: '· status, description, labels, sprint, priority · 1d 8h ago',
    children: twoRows
  },
  parameters: {
    docs: {
      description: {
        story: 'Both slots truncate rather than wrap: the pill is a stadium and only reads as one on a single line. The meta gives way before the actor and the action do, and the count, chevron and match chip never shrink.'
      }
    }
  }
}`,...v.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    open: true,
    count: 4,
    summary: '4 system events',
    meta: '· CI, deploys, QA runs · 20m ago',
    children: <>
        <TimelineEvent variant="nested" icon="task_alt" timestamp="34m ago">
          Build <b>#1847</b> passed on <b>QA-01</b>
        </TimelineEvent>
        <TimelineEvent variant="nested" icon="science" timestamp="28m ago">
          QA scenario <b>TC-412</b> marked Failed
        </TimelineEvent>
        <TimelineEvent variant="nested" icon="file_upload" timestamp="24m ago">
          Deployed <b>edge-gateway-service</b> to <b>QA-02</b>
        </TimelineEvent>
        <TimelineEvent variant="nested" icon="image" timestamp="20m ago">
          Evidence <b>rate_429.png</b> attached to TC-412
        </TimelineEvent>
      </>
  },
  parameters: {
    docs: {
      description: {
        story: 'A run with no person behind it is never attributed to one: it reads "4 system events", not a bot’s name. \`ActivityGroup.actor\` holds whichever bot happened to be first, so naming it would credit a deploy to CI.'
      }
    }
  }
}`,...b.parameters?.docs?.source}}};const ee=["Collapsed","Open","WithSystemExtra","Capped","Matching","LongSummary","SystemOnly"];export{g as Capped,l as Collapsed,v as LongSummary,y as Matching,h as Open,b as SystemOnly,u as WithSystemExtra,ee as __namedExportsOrder,Z as default};
