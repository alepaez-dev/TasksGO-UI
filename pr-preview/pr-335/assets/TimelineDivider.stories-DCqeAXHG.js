import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as x}from"./iframe-BYEug7bc.js";import{T as p}from"./TimelineDivider-B9D8KdMa.js";import{f as h}from"./timelineFeed.module-Djjimaa1.js";import{T as r}from"./TimelineEvent-BMgz0j5U.js";import{B as u}from"./Badge-Cf-1AUpH.js";import{T}from"./TimelineGroup-9WZBb8o6.js";import"./preload-helper-Dm4_WskR.js";import"./cn-2dOUpm6k.js";import"./Icon-Cj6uVZYM.js";const y="2026-01-13T09:12:00.000Z",v="2026-01-14T08:30:00.000Z",D="2026-01-06T15:45:00.000Z",w="2025-11-02T10:20:00.000Z",G={title:"Components/TimelineDivider",component:p,tags:["autodocs"],parameters:{docs:{description:{component:'Marks a break in the activity feed. Renders an `<li>`, so it drops straight into the feed’s `<ul>` alongside `TimelineEvent` and `TimelineGroup`. Its props mirror the divider nodes `withDividers` emits, so a page can spread one in: `<TimelineDivider {...node} />`. A day divider reads "Jan 13 · Yesterday", falling back to the date alone once a day is older than yesterday. A gap divider reports the time skipped and is worded without direction — dividers are recomputed for the active sort, so "later" would be wrong under newest-first. The hairline and the spine use `border-default`; the markers sit one step up on `border-medium`. The feed reads as one thread because the spine is continuous, and the markers punctuate it without the line itself having to carry weight.'}}},argTypes:{type:{control:"inline-radio",options:["dayDivider","gapDivider"]},at:{control:"text"},relative:{control:"select",options:["today","yesterday","none (older)"],mapping:{today:"today",yesterday:"yesterday","none (older)":null}},sameYear:{control:"boolean"},durationMs:{control:"number"},headingLevel:{control:"inline-radio",options:[2,3,4,5,6]},locale:{control:"select",options:["en-US","en-GB","de-DE","ja-JP"]}},args:{type:"dayDivider",at:y,relative:"yesterday"},decorators:[l=>e.jsxs("ul",{className:`${h.timelineFeed} ${h.boxed}`,style:{width:620},children:[e.jsx("li",{className:h.spine,"aria-hidden":"true"}),e.jsx(l,{})]})]},t={},s={args:{at:v,relative:"today"}},o={args:{at:D,relative:null},parameters:{docs:{description:{story:"Anything older than yesterday has no relative name, so the date stands alone — no trailing separator with nothing after it."}}}},n={args:{at:w,relative:null,sameYear:!1},parameters:{docs:{description:{story:'Once a day falls outside the current year the heading names it, because `relative` is null this far back and two "Jan 13"s a year apart would otherwise be identical. `withDividers` decides this and reports it as `sameYear` — the component never reads the clock.'}}}},i={args:{type:"gapDivider",durationMs:14400*1e3},parameters:{docs:{description:{story:'Emitted when consecutive nodes sit `gapMs` apart within the same day — across a day the day divider already marks the break. The unit is attributive, so it stays singular: "4 hour gap", not "4 hours gap".'}}}},d={args:{type:"gapDivider",durationMs:2700*1e3},parameters:{docs:{description:{story:"`GAP_DIVIDER_MS` defaults to four hours, but `withDividers` takes a `gapMs` override, so sub-hour gaps reach this component in real feeds."}}}},g=[{id:"a",count:8,summary:"Jordan D. performed 8 updates",meta:"· status, description, labels · 1d 8h ago"},{id:"b",count:2,summary:"Jordan D. performed 2 updates",meta:"· labels, sprint · 1d 2h ago"},{id:"c",count:2,summary:"Jordan D. performed 2 updates",meta:"· status, description · 23h ago"}];function j(){const[l,b]=x.useState(null),m=a=>e.jsxs(T,{count:a.count,summary:e.jsxs(e.Fragment,{children:[e.jsx("b",{children:"Jordan D."})," performed ",a.count," updates"]}),meta:a.meta,open:l===a.id,onOpenChange:f=>b(f?a.id:null),children:[e.jsxs(r,{variant:"nested",icon:"schedule",timestamp:"1d 8h ago",children:["changed status ",e.jsx(u,{variant:"todo",children:"To Do"})," →"," ",e.jsx(u,{variant:"progress",children:"In Progress"})]}),e.jsx(r,{variant:"nested",icon:"edit",timestamp:"1d 8h ago",children:"updated the description"})]});return e.jsxs(e.Fragment,{children:[e.jsx(p,{type:"dayDivider",at:y,relative:"yesterday"}),m(g[0]),e.jsx(p,{type:"gapDivider",durationMs:360*60*1e3}),m(g[1]),m(g[2]),e.jsxs(r,{icon:"person",timestamp:"22h ago",children:[e.jsx("b",{children:"Alex M."})," assigned ticket to ",e.jsx("b",{children:"Jordan D."})]}),e.jsxs(r,{icon:"tag",timestamp:"21h ago",children:[e.jsx("b",{children:"Jordan D."})," added label"," ",e.jsx(u,{variant:"progress",children:"edge-cache"})]}),e.jsx(p,{type:"dayDivider",at:v,relative:"today"}),e.jsxs(r,{icon:"comment_filled",timestamp:"4h ago",children:[e.jsx("b",{children:"Jordan D."})," commented"]})]})}const c={render:()=>e.jsx(j,{}),parameters:{docs:{description:{story:"A day heading anchors left; a gap sits centred between two rules, because it names a distance rather than a place. The runs are collapsed — click one to open it. The alignment contract is visible here too: every divider label, row icon and group pill shares one 50px column."}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:"{}",...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    at: TODAY,
    relative: 'today'
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <RichFeed />,
  parameters: {
    docs: {
      description: {
        story: 'A day heading anchors left; a gap sits centred between two rules, because it names a distance rather than a place. The runs are collapsed — click one to open it. The alignment contract is visible here too: every divider label, row icon and group pill shares one 50px column.'
      }
    }
  }
}`,...c.parameters?.docs?.source}}};const F=["Yesterday","Today","EarlierDate","PreviousYear","Gap","ShortGap","InAFeed"];export{o as EarlierDate,i as Gap,c as InAFeed,n as PreviousYear,d as ShortGap,s as Today,t as Yesterday,F as __namedExportsOrder,G as default};
