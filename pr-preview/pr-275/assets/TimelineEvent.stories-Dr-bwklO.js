import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as h}from"./iframe-D48BdHOt.js";import{c as S}from"./cn-2dOUpm6k.js";import{I as x,i as C}from"./Icon-BrWnap41.js";import{B as _}from"./Badge-DPzX7BSd.js";import"./preload-helper-DK2lUL2_.js";const D="_row_lg3mk_1",P="_standalone_lg3mk_9",E="_nested_lg3mk_15",R="_icon_lg3mk_19",A="_marker_lg3mk_23",I="_body_lg3mk_35",B="_content_lg3mk_52",M="_separator_lg3mk_56",q="_timestamp_lg3mk_60",O="_muted_lg3mk_66",W="_pinned_lg3mk_71",L="_pin_lg3mk_71",z="_srOnly_lg3mk_100",n={row:D,standalone:P,nested:E,icon:R,marker:A,body:I,content:B,separator:M,timestamp:q,muted:O,pinned:W,pin:L,srOnly:z},G={standalone:n.standalone,nested:n.nested},s=h.forwardRef(({icon:p,timestamp:b,variant:g="standalone",muted:w=!1,pinned:m=!1,onPin:f,className:k,children:j,...T},N)=>{const v=h.useId(),y=h.useId();return e.jsxs("li",{ref:N,tabIndex:m?-1:void 0,className:S(n.row,G[g],w&&n.muted,m&&n.pinned,k),...T,children:[g==="standalone"&&e.jsx("span",{className:n.marker,"aria-hidden":"true"}),m&&e.jsx("span",{className:n.srOnly,children:"Pinned"}),e.jsx(x,{name:p,size:"xs",className:n.icon}),e.jsxs("span",{className:n.body,children:[e.jsx("span",{id:v,className:n.content,children:j}),e.jsxs("span",{className:n.timestamp,children:[e.jsx("span",{className:n.separator,"aria-hidden":"true",children:"·"}),b]}),f&&e.jsxs("button",{type:"button",className:n.pin,onClick:u=>{u.stopPropagation(),f()},onKeyDown:u=>u.stopPropagation(),"aria-labelledby":`${y} ${v}`,children:[e.jsx(x,{name:"push_pin_filled",size:"xs"}),e.jsx("span",{id:y,children:"Pin"})]})]})]})});s.displayName="TimelineEvent";s.__docgenInfo={description:"",methods:[],displayName:"TimelineEvent",props:{icon:{required:!0,tsType:{name:"unknown"},description:""},timestamp:{required:!0,tsType:{name:"ReactNode"},description:""},variant:{required:!1,tsType:{name:"union",raw:"'standalone' | 'nested'",elements:[{name:"literal",value:"'standalone'"},{name:"literal",value:"'nested'"}]},description:"",defaultValue:{value:"'standalone'",computed:!1}},muted:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""},pinned:{defaultValue:{value:"false",computed:!1},required:!1}}};const J=Object.keys(C),Q={title:"Components/TimelineEvent",component:s,tags:["autodocs"],parameters:{docs:{description:{component:'A single event row in an activity timeline. Renders an `<li>` — wrap rows in a `<ul>`, which owns the spacing between them via `gap`; the row adds no margin of its own. `standalone` (default) draws the spine marker and reserves the left gutter; `nested` omits both and must sit inside a group container that supplies the indent, so it renders flush left on its own. Pass `onPin` to render the pin button — its presence is the trigger. `pinned` draws the highlight ring and is mutually exclusive with `onPin`: a pinned row carries no control, because unpinning happens in the feed’s "Clear pin" banner.'}}},argTypes:{icon:{control:"select",options:J},variant:{control:"inline-radio",options:["standalone","nested"]},muted:{control:"boolean"},pinned:{control:"boolean"}},args:{icon:"schedule",timestamp:"22h ago",children:"changed status"},decorators:[p=>e.jsx("ul",{style:{listStyle:"none",margin:0,padding:0,width:560,display:"flex",flexDirection:"column",gap:"var(--ds-space-timeline-event-row-gap)"},children:e.jsx(p,{})})]},t={},a={args:{children:e.jsxs(e.Fragment,{children:["changed status ",e.jsx(_,{variant:"todo",children:"To Do"})," →"," ",e.jsx(_,{variant:"progress",children:"In Progress"})]})}},r={args:{variant:"nested",timestamp:"1d 8h ago"},parameters:{docs:{description:{story:"Shown flush left on purpose: a nested row carries no indent of its own. TimelineGroup supplies it, so this sits 50px left of a standalone row here. See ComposedRun for the assembled shape."}}}},o={args:{variant:"nested",muted:!0,icon:"task_alt",children:"Build #1847 triggered automatically",timestamp:"1d 8h ago"},parameters:{docs:{description:{story:"De-emphasis via italic and a smaller size — deliberately not colour, since the palette has nothing dimmer than `text-secondary` that clears WCAG AA. Used in the activity feed for automated events that happened inside a person’s run: present for context, but not one of their updates."}}}},i={args:{icon:"tag",children:"added label",onPin:()=>{}}},d={args:{icon:"tag",children:"added label",pinned:!0}},l={render:()=>e.jsxs(e.Fragment,{children:[e.jsxs(s,{icon:"person",timestamp:"22h ago",children:[e.jsx("b",{children:"Alex M."})," assigned this ticket to ",e.jsx("b",{children:"Jordan D."})]}),e.jsx("li",{style:{listStyle:"none"},children:e.jsxs("ul",{style:{listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column",gap:"var(--ds-space-timeline-event-row-gap)",paddingLeft:"calc(var(--ds-space-timeline-event-gutter) + var(--ds-space-timeline-event-content-indent))"},children:[e.jsx(s,{variant:"nested",icon:"schedule",timestamp:"1d 8h ago",children:"changed status"}),e.jsx(s,{variant:"nested",icon:"tag",timestamp:"1d 8h ago",children:"added label"})]})})]}),parameters:{docs:{description:{story:"The alignment contract: a nested row carries no indent of its own, so its icon must land in the same column as a standalone row’s. Nothing asserts this — it is only visible here."}}}},c={args:{icon:"person",children:"assigned this ticket to Jordan D. and added Mike R., Alex M. and three others as watchers"}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:"{}",...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        changed status <Badge variant="todo">To Do</Badge> →{' '}
        <Badge variant="progress">In Progress</Badge>
      </>
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'nested',
    timestamp: '1d 8h ago'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shown flush left on purpose: a nested row carries no indent of its own. TimelineGroup supplies it, so this sits 50px left of a standalone row here. See ComposedRun for the assembled shape.'
      }
    }
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'nested',
    muted: true,
    icon: 'task_alt',
    children: 'Build #1847 triggered automatically',
    timestamp: '1d 8h ago'
  },
  parameters: {
    docs: {
      description: {
        story: 'De-emphasis via italic and a smaller size — deliberately not colour, since the palette has nothing dimmer than \`text-secondary\` that clears WCAG AA. Used in the activity feed for automated events that happened inside a person’s run: present for context, but not one of their updates.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'tag',
    children: 'added label',
    onPin: () => {}
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'tag',
    children: 'added label',
    pinned: true
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <TimelineEvent icon="person" timestamp="22h ago">
        <b>Alex M.</b> assigned this ticket to <b>Jordan D.</b>
      </TimelineEvent>
      <li style={{
      listStyle: 'none'
    }}>
        <ul style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-timeline-event-row-gap)',
        paddingLeft: 'calc(var(--ds-space-timeline-event-gutter) + var(--ds-space-timeline-event-content-indent))'
      }}>
          <TimelineEvent variant="nested" icon="schedule" timestamp="1d 8h ago">
            changed status
          </TimelineEvent>
          <TimelineEvent variant="nested" icon="tag" timestamp="1d 8h ago">
            added label
          </TimelineEvent>
        </ul>
      </li>
    </>,
  parameters: {
    docs: {
      description: {
        story: 'The alignment contract: a nested row carries no indent of its own, so its icon must land in the same column as a standalone row’s. Nothing asserts this — it is only visible here.'
      }
    }
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'person',
    children: 'assigned this ticket to Jordan D. and added Mike R., Alex M. and three others as watchers'
  }
}`,...c.parameters?.docs?.source}}};const X=["Default","WithChangeChips","Nested","Muted","Pinnable","Pinned","ComposedRun","LongContentWraps"];export{l as ComposedRun,t as Default,c as LongContentWraps,o as Muted,r as Nested,i as Pinnable,d as Pinned,a as WithChangeChips,X as __namedExportsOrder,Q as default};
