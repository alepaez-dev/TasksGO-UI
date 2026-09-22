import{j as e}from"./jsx-runtime-u17CrQMm.js";import{T as c}from"./TimelineEvent-CKZsEFB0.js";import{B as l}from"./Badge-CdSQy8aw.js";import{i as m}from"./Icon-C-U7Z5pG.js";import"./iframe-GS4NPPdF.js";import"./preload-helper-D_a3GMB9.js";import"./cn-2dOUpm6k.js";const h=Object.keys(m),b={title:"Components/TimelineEvent",component:c,tags:["autodocs"],parameters:{docs:{description:{component:'A single event row in an activity timeline. Renders an `<li>` — wrap rows in a `<ul>`, which owns the spacing between them via `gap`; the row adds no margin of its own. `standalone` (default) draws the spine marker and reserves the left gutter; `nested` omits both and must sit inside a group container that supplies the indent, so it renders flush left on its own. Pass `onPin` to render the pin button — its presence is the trigger. `pinned` draws the highlight ring and is mutually exclusive with `onPin`: a pinned row carries no control, because unpinning happens in the feed’s "Clear pin" banner.'}}},argTypes:{icon:{control:"select",options:h},variant:{control:"inline-radio",options:["standalone","nested"]},muted:{control:"boolean"},pinned:{control:"boolean"}},args:{icon:"schedule",timestamp:"22h ago",children:"changed status"},decorators:[p=>e.jsx("ul",{style:{listStyle:"none",margin:0,padding:0,width:560,display:"flex",flexDirection:"column",gap:"var(--ds-space-timeline-event-row-gap)"},children:e.jsx(p,{})})]},n={},t={args:{children:e.jsxs(e.Fragment,{children:["changed status ",e.jsx(l,{variant:"todo",children:"To Do"})," →"," ",e.jsx(l,{variant:"progress",children:"In Progress"})]})}},s={args:{variant:"nested",timestamp:"1d 8h ago"},parameters:{docs:{description:{story:"Shown flush left on purpose: a nested row carries no indent of its own. TimelineGroup supplies it, so this sits 50px left of a standalone row here. See ComposedRun for the assembled shape."}}}},a={args:{variant:"nested",muted:!0,icon:"task_alt",children:"Build #1847 triggered automatically",timestamp:"1d 8h ago"},parameters:{docs:{description:{story:"De-emphasis via italic and a smaller size, keeping `text-secondary`. Used in the activity feed for automated events that happened inside a person’s run: present for context, but not one of their updates."}}}},r={args:{icon:"tag",children:"added label",onPin:()=>{}}},i={args:{icon:"tag",children:"added label",pinned:!0}},o={render:()=>e.jsxs(e.Fragment,{children:[e.jsxs(c,{icon:"person",timestamp:"22h ago",children:[e.jsx("b",{children:"Alex M."})," assigned this ticket to ",e.jsx("b",{children:"Jordan D."})]}),e.jsx("li",{style:{listStyle:"none"},children:e.jsxs("ul",{style:{listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column",gap:"var(--ds-space-timeline-event-row-gap)",paddingLeft:"calc(var(--ds-space-timeline-event-gutter) + var(--ds-space-timeline-event-content-indent))"},children:[e.jsx(c,{variant:"nested",icon:"schedule",timestamp:"1d 8h ago",children:"changed status"}),e.jsx(c,{variant:"nested",icon:"tag",timestamp:"1d 8h ago",children:"added label"})]})})]}),parameters:{docs:{description:{story:"The alignment contract: a nested row carries no indent of its own, so its icon must land in the same column as a standalone row’s. Nothing asserts this — it is only visible here."}}}},d={args:{icon:"person",children:"assigned this ticket to Jordan D. and added Mike R., Alex M. and three others as watchers"}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:"{}",...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        changed status <Badge variant="todo">To Do</Badge> →{' '}
        <Badge variant="progress">In Progress</Badge>
      </>
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
        story: 'De-emphasis via italic and a smaller size, keeping \`text-secondary\`. Used in the activity feed for automated events that happened inside a person’s run: present for context, but not one of their updates.'
      }
    }
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'tag',
    children: 'added label',
    onPin: () => {}
  }
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'tag',
    children: 'added label',
    pinned: true
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'person',
    children: 'assigned this ticket to Jordan D. and added Mike R., Alex M. and three others as watchers'
  }
}`,...d.parameters?.docs?.source}}};const S=["Default","WithChangeChips","Nested","Muted","Pinnable","Pinned","ComposedRun","LongContentWraps"];export{o as ComposedRun,n as Default,d as LongContentWraps,a as Muted,s as Nested,r as Pinnable,i as Pinned,t as WithChangeChips,S as __namedExportsOrder,b as default};
