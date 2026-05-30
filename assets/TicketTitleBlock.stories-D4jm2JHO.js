import{j as a}from"./jsx-runtime-u17CrQMm.js";import{T as p}from"./TicketTitleBlock-DGRmpGxP.js";import{A as l}from"./Avatar-DhNvYArr.js";import{A as c}from"./AvatarGroup-DSyS3La_.js";import"./iframe-M7vZPr2E.js";import"./preload-helper-CyvMmb0J.js";import"./cn-2dOUpm6k.js";import"./Badge-CTkPu-lc.js";const P={title:"Components/TicketTitleBlock",component:p,tags:["autodocs"],parameters:{docs:{description:{component:"Page-level title block for a ticket: an optional row of status badges and an avatar slot above a page heading. The top meta row is omitted entirely when both `badges` and `avatar` are absent."}}},decorators:[n=>a.jsx("div",{style:{width:"720px",padding:"24px"},children:a.jsx(n,{})})]},r="Implement dynamic edge-caching for API gateway responses",e={args:{title:r,badges:[{label:"In Progress",variant:"progress"},{label:"High Prio",variant:"high"}],avatar:a.jsx(l,{initial:"AP","aria-label":"Ale P.",variant:"profile",size:"sm"})}},t={args:{title:r,badges:[{label:"In Progress",variant:"progress"},{label:"High Prio",variant:"high"}]}},i={args:{title:r,avatar:a.jsx(l,{initial:"AP","aria-label":"Ale P.",variant:"profile",size:"sm"})}},s={args:{title:r}},o={args:{title:r,badges:[{label:"In Progress",variant:"progress"},{label:"High Prio",variant:"high"}],avatar:a.jsxs(c,{"aria-label":"Assignees",children:[a.jsx(l,{initial:"JD","aria-label":"Jordan D.",variant:"profile",size:"sm",tint:"#6C89A8"}),a.jsx(l,{initial:"AM","aria-label":"Alex M.",variant:"profile",size:"sm",tint:"#C38E70"})]})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    title: ticketTitle,
    avatar: <Avatar initial="AP" aria-label="Ale P." variant="profile" size="sm" />
  }
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: ticketTitle
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
        <Avatar initial="JD" aria-label="Jordan D." variant="profile" size="sm" tint="#6C89A8" />
        <Avatar initial="AM" aria-label="Alex M." variant="profile" size="sm" tint="#C38E70" />
      </AvatarGroup>
  }
}`,...o.parameters?.docs?.source}}};const f=["Default","WithoutAvatar","WithoutBadges","TitleOnly","WithAvatarGroup"];export{e as Default,s as TitleOnly,o as WithAvatarGroup,t as WithoutAvatar,i as WithoutBadges,f as __namedExportsOrder,P as default};
