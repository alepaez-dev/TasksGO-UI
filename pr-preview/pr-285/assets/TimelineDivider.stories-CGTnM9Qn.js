import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as _}from"./iframe-DWpm_JIO.js";import{c as f}from"./cn-2dOUpm6k.js";import{T as d}from"./TimelineEvent-BxnjTrM6.js";import{B as b}from"./Badge-BGZtgbu1.js";import{T as I}from"./TimelineGroup-b5Hkc7Ye.js";import"./preload-helper-_ynXzUkH.js";import"./Icon-7ZVDxb1s.js";const L="_divider_o9n9c_1",G="_label_o9n9c_13",F="_dayLabel_o9n9c_19",J="_dayDivider_o9n9c_35",N="_gap_o9n9c_39",O="_gapLabel_o9n9c_50",o={divider:L,label:G,dayLabel:F,dayDivider:J,gap:N,gapLabel:O},P={today:"Today",yesterday:"Yesterday"},x=60*1e3,B=60*x;function V(t){const s=Math.abs(t),r=Math.floor(s/B);return r>=1?`${r} hour gap`:`${Math.max(1,Math.floor(s/x))} minute gap`}const w={month:"short",day:"numeric"},U={...w,year:"numeric"};function Z(t,s,r){const a=new Date(t);if(Number.isNaN(a.getTime()))return t;const n=r?w:U;try{return new Intl.DateTimeFormat(s,n).format(a)}catch{return new Intl.DateTimeFormat(void 0,n).format(a)}}const i=_.forwardRef(({type:t,at:s,relative:r,sameYear:a=!0,headingLevel:n=3,durationMs:A,locale:M,className:S,...Y},k)=>{const v=t==="gapDivider",T=v?V(A):[Z(s,M,a),r?P[r]:null].filter(Boolean).join(" · "),R=`h${n}`;return e.jsx("li",{ref:k,className:f(o.divider,v?o.gap:o.dayDivider,S),...Y,children:v?e.jsx("span",{className:f(o.label,o.gapLabel),children:T}):e.jsx(R,{className:f(o.label,o.dayLabel),children:T})})});i.displayName="TimelineDivider";i.__docgenInfo={description:"",methods:[],displayName:"TimelineDivider",props:{locale:{required:!1,tsType:{name:"string"},description:"Overrides the host locale used to format a day heading."},sameYear:{defaultValue:{value:"true",computed:!1},required:!1},headingLevel:{defaultValue:{value:"3",computed:!1},required:!1}}};const j="2026-01-13T09:12:00.000Z",E="2026-01-14T08:30:00.000Z",$="2026-01-06T15:45:00.000Z",q="2025-11-02T10:20:00.000Z",y=24,re={title:"Components/TimelineDivider",component:i,tags:["autodocs"],parameters:{docs:{description:{component:'Marks a break in the activity feed. Renders an `<li>`, so it drops straight into the feed’s `<ul>` alongside `TimelineEvent` and `TimelineGroup`. Its props mirror the divider nodes `withDividers` emits, so a page can spread one in: `<TimelineDivider {...node} />`. A day divider reads "Jan 13 · Yesterday", falling back to the date alone once a day is older than yesterday. A gap divider reports the time skipped and is worded without direction — dividers are recomputed for the active sort, so "later" would be wrong under newest-first. The hairline uses `border-default`, one step lighter than the `border-strong` spine and markers: the spine has to read as one continuous thread, a rule only terminates a label.'}}},argTypes:{type:{control:"inline-radio",options:["dayDivider","gapDivider"]},at:{control:"text"},relative:{control:"select",options:["today","yesterday","none (older)"],mapping:{today:"today",yesterday:"yesterday","none (older)":null}},sameYear:{control:"boolean"},durationMs:{control:"number"},headingLevel:{control:"inline-radio",options:[2,3,4,5,6]},locale:{control:"select",options:["en-US","en-GB","de-DE","ja-JP"]}},args:{type:"dayDivider",at:j,relative:"yesterday"},decorators:[t=>e.jsx("ul",{style:{position:"relative",listStyle:"none",margin:0,background:"var(--ds-color-surface-secondary)",padding:y,width:620,display:"flex",flexDirection:"column",gap:"var(--ds-space-timeline-event-row-gap)"},children:e.jsx(t,{})})]},c={},l={args:{at:E,relative:"today"}},p={args:{at:$,relative:null},parameters:{docs:{description:{story:"Anything older than yesterday has no relative name, so the date stands alone — no trailing separator with nothing after it."}}}},m={args:{at:q,relative:null,sameYear:!1},parameters:{docs:{description:{story:'Once a day falls outside the current year the heading names it, because `relative` is null this far back and two "Jan 13"s a year apart would otherwise be identical. `withDividers` decides this and reports it as `sameYear` — the component never reads the clock.'}}}},u={args:{type:"gapDivider",durationMs:14400*1e3},parameters:{docs:{description:{story:'Emitted when consecutive nodes sit `gapMs` apart within the same day — across a day the day divider already marks the break. The unit is attributive, so it stays singular: "4 hour gap", not "4 hours gap".'}}}},h={args:{type:"gapDivider",durationMs:2700*1e3},parameters:{docs:{description:{story:"`GAP_DIVIDER_MS` defaults to four hours, but `withDividers` takes a `gapMs` override, so sub-hour gaps reach this component in real feeds."}}}},D=[{id:"a",count:8,summary:"Jordan D. performed 8 updates",meta:"· status, description, labels · 1d 8h ago"},{id:"b",count:2,summary:"Jordan D. performed 2 updates",meta:"· labels, sprint · 1d 2h ago"},{id:"c",count:2,summary:"Jordan D. performed 2 updates",meta:"· status, description · 23h ago"}];function H(){const[t,s]=_.useState(null),r=a=>e.jsxs(I,{count:a.count,summary:e.jsxs(e.Fragment,{children:[e.jsx("b",{children:"Jordan D."})," performed ",a.count," updates"]}),meta:a.meta,open:t===a.id,onOpenChange:n=>s(n?a.id:null),children:[e.jsxs(d,{variant:"nested",icon:"schedule",timestamp:"1d 8h ago",children:["changed status ",e.jsx(b,{variant:"todo",children:"To Do"})," →"," ",e.jsx(b,{variant:"progress",children:"In Progress"})]}),e.jsx(d,{variant:"nested",icon:"edit",timestamp:"1d 8h ago",children:"updated the description"})]});return e.jsxs(e.Fragment,{children:[e.jsx("li",{"aria-hidden":"true",style:{position:"absolute",left:`calc(${y}px + var(--ds-space-timeline-event-gutter) / 2)`,transform:"translateX(-50%)",top:y,bottom:y,width:1,background:"var(--ds-color-border-strong)"}}),e.jsx(i,{type:"dayDivider",at:j,relative:"yesterday"}),r(D[0]),e.jsx(i,{type:"gapDivider",durationMs:360*60*1e3}),r(D[1]),r(D[2]),e.jsxs(d,{icon:"person",timestamp:"22h ago",children:[e.jsx("b",{children:"Alex M."})," assigned ticket to ",e.jsx("b",{children:"Jordan D."})]}),e.jsxs(d,{icon:"tag",timestamp:"21h ago",children:[e.jsx("b",{children:"Jordan D."})," added label"," ",e.jsx(b,{variant:"progress",children:"edge-cache"})]}),e.jsx(i,{type:"dayDivider",at:E,relative:"today"}),e.jsxs(d,{icon:"comment_filled",timestamp:"4h ago",children:[e.jsx("b",{children:"Jordan D."})," commented"]})]})}const g={render:()=>e.jsx(H,{}),parameters:{docs:{description:{story:"A day heading anchors left; a gap sits centred between two rules, because it names a distance rather than a place. The runs are collapsed — click one to open it. The alignment contract is visible here too: every divider label, row icon and group pill shares one 50px column."}}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:"{}",...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
    at: LAST_YEAR,
    relative: null,
    sameYear: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Once a day falls outside the current year the heading names it, because \`relative\` is null this far back and two "Jan 13"s a year apart would otherwise be identical. \`withDividers\` decides this and reports it as \`sameYear\` — the component never reads the clock.'
      }
    }
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <RichFeed />,
  parameters: {
    docs: {
      description: {
        story: 'A day heading anchors left; a gap sits centred between two rules, because it names a distance rather than a place. The runs are collapsed — click one to open it. The alignment contract is visible here too: every divider label, row icon and group pill shares one 50px column.'
      }
    }
  }
}`,...g.parameters?.docs?.source}}};const te=["Yesterday","Today","EarlierDate","PreviousYear","Gap","ShortGap","InAFeed"];export{p as EarlierDate,u as Gap,g as InAFeed,m as PreviousYear,h as ShortGap,l as Today,c as Yesterday,te as __namedExportsOrder,re as default};
