import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as T}from"./iframe-Ca0CFKfR.js";import{c as v}from"./cn-2dOUpm6k.js";import{T as d}from"./TimelineEvent-C6QMxeAE.js";import{B as f}from"./Badge-BNOwTy7Q.js";import{T as k}from"./TimelineGroup-Cycy-2lX.js";import"./preload-helper-D7_X6d8d.js";import"./Icon-e9CAg4nm.js";const L="_divider_o9n9c_1",G="_label_o9n9c_13",Y="_dayLabel_o9n9c_19",F="_dayDivider_o9n9c_35",N="_gap_o9n9c_39",J="_gapLabel_o9n9c_50",o={divider:L,label:G,dayLabel:Y,dayDivider:F,gap:N,gapLabel:J},O={today:"Today",yesterday:"Yesterday"},x=60*1e3,P=60*x;function B(t){const s=Math.abs(t),r=Math.floor(s/P);return r>=1?`${r} hour gap`:`${Math.max(1,Math.floor(s/x))} minute gap`}const _={month:"short",day:"numeric"},V={..._,year:"numeric"};function U(t,s,r){const a=new Date(t);if(Number.isNaN(a.getTime()))return t;const n=r?_:V;try{return new Intl.DateTimeFormat(s,n).format(a)}catch{return new Intl.DateTimeFormat(void 0,n).format(a)}}const i=T.forwardRef(({type:t,at:s,relative:r,sameYear:a=!0,headingLevel:n=3,durationMs:E,locale:A,className:M,...S},I)=>{const y=t==="gapDivider",D=y?B(E):[U(s,A,a),r?O[r]:null].filter(Boolean).join(" · "),R=`h${n}`;return e.jsx("li",{ref:I,className:v(o.divider,y?o.gap:o.dayDivider,M),...S,children:y?e.jsx("span",{className:v(o.label,o.gapLabel),children:D}):e.jsx(R,{className:v(o.label,o.dayLabel),children:D})})});i.displayName="TimelineDivider";i.__docgenInfo={description:"",methods:[],displayName:"TimelineDivider",props:{locale:{required:!1,tsType:{name:"string"},description:"Overrides the host locale used to format a day heading."},sameYear:{defaultValue:{value:"true",computed:!1},required:!1},headingLevel:{defaultValue:{value:"3",computed:!1},required:!1}}};const j="2026-01-13T09:12:00.000Z",w="2026-01-14T08:30:00.000Z",$="2026-01-06T15:45:00.000Z",g=24,ee={title:"Components/TimelineDivider",component:i,tags:["autodocs"],parameters:{docs:{description:{component:'Marks a break in the activity feed. Renders an `<li>`, so it drops straight into the feed’s `<ul>` alongside `TimelineEvent` and `TimelineGroup`. Its props mirror the divider nodes `withDividers` emits, so a page can spread one in: `<TimelineDivider {...node} />`. A day divider reads "Jan 13 · Yesterday", falling back to the date alone once a day is older than yesterday. A gap divider reports the time skipped and is worded without direction — dividers are recomputed for the active sort, so "later" would be wrong under newest-first. The hairline uses `border-default`, one step lighter than the `border-strong` spine and markers: the spine has to read as one continuous thread, a rule only terminates a label.'}}},argTypes:{type:{control:"inline-radio",options:["dayDivider","gapDivider"]},at:{control:"text"},relative:{control:"select",options:["today","yesterday","none (older)"],mapping:{today:"today",yesterday:"yesterday","none (older)":null}},durationMs:{control:"number"},headingLevel:{control:"inline-radio",options:[2,3,4,5,6]},locale:{control:"select",options:["en-US","en-GB","de-DE","ja-JP"]}},args:{type:"dayDivider",at:j,relative:"yesterday"},decorators:[t=>e.jsx("ul",{style:{position:"relative",listStyle:"none",margin:0,background:"var(--ds-color-surface-secondary)",padding:g,width:620,display:"flex",flexDirection:"column",gap:"var(--ds-space-timeline-event-row-gap)"},children:e.jsx(t,{})})]},c={},l={args:{at:w,relative:"today"}},p={args:{at:$,relative:null},parameters:{docs:{description:{story:"Anything older than yesterday has no relative name, so the date stands alone — no trailing separator with nothing after it."}}}},m={args:{type:"gapDivider",durationMs:14400*1e3},parameters:{docs:{description:{story:'Emitted when consecutive nodes sit `gapMs` apart within the same day — across a day the day divider already marks the break. The unit is attributive, so it stays singular: "4 hour gap", not "4 hours gap".'}}}},u={args:{type:"gapDivider",durationMs:2700*1e3},parameters:{docs:{description:{story:"`GAP_DIVIDER_MS` defaults to four hours, but `withDividers` takes a `gapMs` override, so sub-hour gaps reach this component in real feeds."}}}},b=[{id:"a",count:8,summary:"Jordan D. performed 8 updates",meta:"· status, description, labels · 1d 8h ago"},{id:"b",count:2,summary:"Jordan D. performed 2 updates",meta:"· labels, sprint · 1d 2h ago"},{id:"c",count:2,summary:"Jordan D. performed 2 updates",meta:"· status, description · 23h ago"}];function q(){const[t,s]=T.useState(null),r=a=>e.jsxs(k,{count:a.count,summary:e.jsxs(e.Fragment,{children:[e.jsx("b",{children:"Jordan D."})," performed ",a.count," updates"]}),meta:a.meta,open:t===a.id,onOpenChange:n=>s(n?a.id:null),children:[e.jsxs(d,{variant:"nested",icon:"schedule",timestamp:"1d 8h ago",children:["changed status ",e.jsx(f,{variant:"todo",children:"To Do"})," →"," ",e.jsx(f,{variant:"progress",children:"In Progress"})]}),e.jsx(d,{variant:"nested",icon:"edit",timestamp:"1d 8h ago",children:"updated the description"})]});return e.jsxs(e.Fragment,{children:[e.jsx("li",{"aria-hidden":"true",style:{position:"absolute",left:`calc(${g}px + var(--ds-space-timeline-event-gutter) / 2)`,transform:"translateX(-50%)",top:g,bottom:g,width:1,background:"var(--ds-color-border-strong)"}}),e.jsx(i,{type:"dayDivider",at:j,relative:"yesterday"}),r(b[0]),e.jsx(i,{type:"gapDivider",durationMs:360*60*1e3}),r(b[1]),r(b[2]),e.jsxs(d,{icon:"person",timestamp:"22h ago",children:[e.jsx("b",{children:"Alex M."})," assigned ticket to ",e.jsx("b",{children:"Jordan D."})]}),e.jsxs(d,{icon:"tag",timestamp:"21h ago",children:[e.jsx("b",{children:"Jordan D."})," added label"," ",e.jsx(f,{variant:"progress",children:"edge-cache"})]}),e.jsx(i,{type:"dayDivider",at:w,relative:"today"}),e.jsxs(d,{icon:"comment_filled",timestamp:"4h ago",children:[e.jsx("b",{children:"Jordan D."})," commented"]})]})}const h={render:()=>e.jsx(q,{}),parameters:{docs:{description:{story:"A day heading anchors left; a gap sits centred between two rules, because it names a distance rather than a place. The runs are collapsed — click one to open it. The alignment contract is visible here too: every divider label, row icon and group pill shares one 50px column."}}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:"{}",...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    at: TODAY,
    relative: 'today'
  }
}`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    at: LAST_WEEK,
    relative: null
  },
  parameters: {
    docs: {
      description: {
        story: 'Anything older than yesterday has no relative name, so the date stands alone — no trailing separator with nothing after it.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'gapDivider',
    durationMs: 4 * 60 * 60 * 1000
  },
  parameters: {
    docs: {
      description: {
        story: 'Emitted when consecutive nodes sit \`gapMs\` apart within the same day — across a day the day divider already marks the break. The unit is attributive, so it stays singular: "4 hour gap", not "4 hours gap".'
      }
    }
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'gapDivider',
    durationMs: 45 * 60 * 1000
  },
  parameters: {
    docs: {
      description: {
        story: '\`GAP_DIVIDER_MS\` defaults to four hours, but \`withDividers\` takes a \`gapMs\` override, so sub-hour gaps reach this component in real feeds.'
      }
    }
  }
}`,...u.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <RichFeed />,
  parameters: {
    docs: {
      description: {
        story: 'A day heading anchors left; a gap sits centred between two rules, because it names a distance rather than a place. The runs are collapsed — click one to open it. The alignment contract is visible here too: every divider label, row icon and group pill shares one 50px column.'
      }
    }
  }
}`,...h.parameters?.docs?.source}}};const ae=["Yesterday","Today","EarlierDate","Gap","ShortGap","InAFeed"];export{p as EarlierDate,m as Gap,h as InAFeed,u as ShortGap,l as Today,c as Yesterday,ae as __namedExportsOrder,ee as default};
