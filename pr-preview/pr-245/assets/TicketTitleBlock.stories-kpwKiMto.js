import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as c}from"./iframe-ajbhkFwv.js";import{T as g}from"./TicketTitleBlock-CAclxQIY.js";import{A as r}from"./Avatar-BRVastrG.js";import{A as b}from"./AvatarGroup-CpznZUpB.js";import"./preload-helper-CyTtWbco.js";import"./cn-2dOUpm6k.js";import"./Badge-C1ZZxK_H.js";import"./EditableTitle-D15NnSLn.js";import"./useAutoGrowTextarea-BUSTC3wo.js";import"./EditToggle-MNKmEvPt.js";import"./Icon-BrMJquHT.js";const H={title:"Components/TicketTitleBlock",component:g,tags:["autodocs"],parameters:{docs:{description:{component:"Page-level title block for a ticket: an optional row of status badges and an avatar slot above a page heading. The top meta row is omitted entirely when both `badges` and `avatar` are absent."}}},decorators:[p=>a.jsx("div",{style:{width:"720px",padding:"24px"},children:a.jsx(p,{})})]},e="Implement dynamic edge-caching for API gateway responses",t={args:{title:e,badges:[{label:"In Progress",variant:"progress"},{label:"High Prio",variant:"high"}],avatar:a.jsx(r,{initial:"AP","aria-label":"Ale P.",variant:"profile",size:"sm"})}},i={args:{title:e,badges:[{label:"In Progress",variant:"progress"},{label:"High Prio",variant:"high"}]}},s={args:{title:e,avatar:a.jsx(r,{initial:"AP","aria-label":"Ale P.",variant:"profile",size:"sm"})}},o={args:{title:e}},l={args:{title:e,badges:[{label:"In Progress",variant:"progress"},{label:"High Prio",variant:"high"}],avatar:a.jsxs(b,{"aria-label":"Assignees",children:[a.jsx(r,{initial:"JD","aria-label":"Jordan D.",variant:"profile",size:"sm",tint:"var(--ds-color-avatar-tone-profile-steel)"}),a.jsx(r,{initial:"AM","aria-label":"Alex M.",variant:"profile",size:"sm",tint:"var(--ds-color-avatar-tone-profile-tan)"})]})}};function h(){const[p,d]=c.useState(e),[m,v]=c.useState(!1);return a.jsx(g,{title:p,badges:[{label:"In Progress",variant:"progress"},{label:"High Prio",variant:"high"}],avatar:a.jsx(r,{initial:"AP","aria-label":"Ale P.",variant:"profile",size:"sm"}),onTitleChange:d,titleEditing:m,onTitleEditingChange:v})}const n={render:()=>a.jsx(h,{})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    title: ticketTitle,
    badges: [{
      label: 'In Progress',
      variant: 'progress'
    }, {
      label: 'High Prio',
      variant: 'high'
    }],
    avatar: <Avatar initial="AP" aria-label="Ale P." variant="profile" size="sm" />
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    title: ticketTitle,
    badges: [{
      label: 'In Progress',
      variant: 'progress'
    }, {
      label: 'High Prio',
      variant: 'high'
    }]
  }
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: ticketTitle,
    avatar: <Avatar initial="AP" aria-label="Ale P." variant="profile" size="sm" />
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    title: ticketTitle
  }
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    title: ticketTitle,
    badges: [{
      label: 'In Progress',
      variant: 'progress'
    }, {
      label: 'High Prio',
      variant: 'high'
    }],
    avatar: <AvatarGroup aria-label="Assignees">
        <Avatar initial="JD" aria-label="Jordan D." variant="profile" size="sm" tint="var(--ds-color-avatar-tone-profile-steel)" />
        <Avatar initial="AM" aria-label="Alex M." variant="profile" size="sm" tint="var(--ds-color-avatar-tone-profile-tan)" />
      </AvatarGroup>
  }
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <EditableExample />
}`,...n.parameters?.docs?.source}}};const y=["Default","WithoutAvatar","WithoutBadges","TitleOnly","WithAvatarGroup","Editable"];export{t as Default,n as Editable,o as TitleOnly,l as WithAvatarGroup,i as WithoutAvatar,s as WithoutBadges,y as __namedExportsOrder,H as default};
