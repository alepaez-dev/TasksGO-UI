import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as u}from"./iframe-Ca0CFKfR.js";import{T as g}from"./TimelineGroup-Cycy-2lX.js";import{T as t}from"./TimelineEvent-C6QMxeAE.js";import{B as p}from"./Badge-BNOwTy7Q.js";import"./preload-helper-D7_X6d8d.js";import"./cn-2dOUpm6k.js";import"./Icon-e9CAg4nm.js";const R={title:"Components/TimelineGroup",component:g,tags:["autodocs"],render:a=>e.jsx(f,{...a},String(a.open)),parameters:{docs:{description:{component:'A collapsed run of consecutive events by one person, or of automated events with no person behind them. Renders an `<li>` — wrap it in the feed’s `<ul>`. Takes `TimelineEvent` rows as children rather than data, so the page decides which are muted, pinned or highlighted. `count` is the actions belonging to whoever the run is attributed to — use `countActions(group)`. For a person that excludes system extras, so eight updates plus an automated build reads "8 updates" over nine rows; a run with no person behind it counts every row, reading "4 system events". Rows are unmounted while collapsed, not hidden. Long runs are capped by the page, which passes `moreLabel` and `onMoreToggle`.'}}},argTypes:{count:{control:{type:"number",min:1}},summary:{control:"text"},meta:{control:"text"},open:{control:"boolean"},matchLabel:{control:"text"},moreLabel:{control:"text"},children:{control:!1}},args:{count:2,summary:"Jordan D. performed 2 updates",meta:"· labels, sprint · 1d 2h ago",open:!1},decorators:[a=>e.jsx("ul",{style:{listStyle:"none",margin:0,background:"var(--ds-color-surface-secondary)",padding:24,width:620,display:"flex",flexDirection:"column",gap:"var(--ds-space-timeline-event-row-gap)"},children:e.jsx(a,{})})]},s=e.jsxs(e.Fragment,{children:[e.jsxs(t,{variant:"nested",icon:"tag",timestamp:"1d 2h ago",children:["added label ",e.jsx(p,{variant:"progress",children:"needs-qa"})]}),e.jsxs(t,{variant:"nested",icon:"schedule",timestamp:"1d 2h ago",children:["set sprint to ",e.jsx(p,{variant:"progress",children:"Q1-W4-INFRA"})]})]});function f({moreLabel:a,...l}){const[v,y]=u.useState(l.open),[h,b]=u.useState(!1),w=a===void 0?{}:{moreLabel:h?"Show less":a,onMoreToggle:()=>b(x=>!x),moreExpanded:h};return e.jsxs(g,{...l,...w,open:v,onOpenChange:y,children:[l.children,h&&e.jsxs(t,{variant:"nested",icon:"person",timestamp:"1d 8h ago",children:["added ",e.jsx("b",{children:"Mike R."})," as a watcher"]})]})}const n={args:{children:s},parameters:{docs:{description:{story:"The default resting state: a run stays closed until asked."}}}},r={args:{open:!0,children:s}},o={args:{open:!0,count:2,summary:"Jordan D. performed 2 updates",meta:"· status, description · 1d 8h ago",children:e.jsxs(e.Fragment,{children:[e.jsxs(t,{variant:"nested",icon:"schedule",timestamp:"1d 8h ago",children:["changed status ",e.jsx(p,{variant:"todo",children:"To Do"})," →"," ",e.jsx(p,{variant:"progress",children:"In Progress"})]}),e.jsx(t,{variant:"nested",muted:!0,icon:"task_alt",timestamp:"1d 8h ago",children:"Build #1847 triggered automatically"}),e.jsx(t,{variant:"nested",icon:"edit",timestamp:"1d 8h ago",children:"updated the description"})]})},parameters:{docs:{description:{story:'The count says 2, not 3. The automated build happened inside Jordan’s run and is shown for context, but it is not one of his updates — matching the mockup, whose pill reads "8 updates" over nine rows.'}}}},i={args:{open:!0,count:9,summary:"Jordan D. performed 9 updates",meta:"· status, description, labels · 1d 8h ago",moreLabel:"Show 5 more",children:s}},d={args:{open:!0,matchLabel:"1 of 2 match",children:s},parameters:{docs:{description:{story:"While a search is active, a group holding a match expands and reports how many of its rows matched."}}}},c={args:{open:!1,summary:"Bartholomew Featherstonehaugh-Wellesley performed 14 updates",meta:"· status, description, labels, sprint, priority · 1d 8h ago",children:s},parameters:{docs:{description:{story:"Both slots truncate rather than wrap: the pill is a stadium and only reads as one on a single line. The meta gives way before the actor and the action do, and the count, chevron and match chip never shrink."}}}},m={args:{open:!0,count:4,summary:"4 system events",meta:"· CI, deploys, QA runs · 20m ago",children:e.jsxs(e.Fragment,{children:[e.jsxs(t,{variant:"nested",icon:"task_alt",timestamp:"34m ago",children:["Build ",e.jsx("b",{children:"#1847"})," passed on ",e.jsx("b",{children:"QA-01"})]}),e.jsxs(t,{variant:"nested",icon:"science",timestamp:"28m ago",children:["QA scenario ",e.jsx("b",{children:"TC-412"})," marked Failed"]}),e.jsxs(t,{variant:"nested",icon:"file_upload",timestamp:"24m ago",children:["Deployed ",e.jsx("b",{children:"edge-gateway-service"})," to ",e.jsx("b",{children:"QA-02"})]}),e.jsxs(t,{variant:"nested",icon:"image",timestamp:"20m ago",children:["Evidence ",e.jsx("b",{children:"rate_429.png"})," attached to TC-412"]})]})},parameters:{docs:{description:{story:'A run with no person behind it is never attributed to one: it reads "4 system events", not a bot’s name. `ActivityGroup.actor` holds whichever bot happened to be first, so naming it would credit a deploy to CI.'}}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: twoRows
  },
  parameters: {
    docs: {
      description: {
        story: 'The default resting state: a run stays closed until asked.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    open: true,
    children: twoRows
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    open: true,
    count: 9,
    summary: 'Jordan D. performed 9 updates',
    meta: '· status, description, labels · 1d 8h ago',
    moreLabel: 'Show 5 more',
    children: twoRows
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};const D=["Collapsed","Open","WithSystemExtra","Capped","Matching","LongSummary","SystemOnly"];export{i as Capped,n as Collapsed,c as LongSummary,d as Matching,r as Open,m as SystemOnly,o as WithSystemExtra,D as __namedExportsOrder,R as default};
