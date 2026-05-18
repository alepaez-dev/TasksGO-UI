import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as f}from"./iframe-DtiNtrZj.js";import{c as k}from"./cn-2dOUpm6k.js";import{B as P}from"./Badge-fBhKNtss.js";import{A as c}from"./Avatar-DIyvfnDP.js";import{A as x}from"./AvatarGroup-pyckLZae.js";import"./preload-helper-cRWhBNr-.js";const T="_block_1nsnv_1",y="_meta_1nsnv_7",_="_badges_1nsnv_13",j="_title_1nsnv_19",t={block:T,meta:y,badges:_,title:j},d=f.forwardRef(({title:p,badges:e,avatar:m,className:v,...b},h)=>{const u=e&&e.length>0||m!=null;return a.jsxs("div",{ref:h,className:k(t.block,v),...b,children:[u&&a.jsxs("div",{className:t.meta,children:[e&&e.length>0&&a.jsx("div",{className:t.badges,children:e.map((g,A)=>a.jsx(P,{variant:g.variant,children:g.label},A))}),m]}),a.jsx("h1",{className:t.title,children:p})]})});d.displayName="TicketTitleBlock";d.__docgenInfo={description:"",methods:[],displayName:"TicketTitleBlock",props:{title:{required:!0,tsType:{name:"string"},description:""},badges:{required:!1,tsType:{name:"unknown"},description:""},avatar:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["HTMLAttributes"]};const D={title:"Components/TicketTitleBlock",component:d,tags:["autodocs"],parameters:{docs:{description:{component:"Page-level title block for a ticket: an optional row of status badges and an avatar slot above a page heading. The top meta row is omitted entirely when both `badges` and `avatar` are absent."}}},decorators:[p=>a.jsx("div",{style:{width:"720px",padding:"24px"},children:a.jsx(p,{})})]},r="Implement dynamic edge-caching for API gateway responses",s={args:{title:r,badges:[{label:"In Progress",variant:"progress"},{label:"High Prio",variant:"high"}],avatar:a.jsx(c,{initial:"AP","aria-label":"Ale P.",variant:"profile",size:"sm"})}},i={args:{title:r,badges:[{label:"In Progress",variant:"progress"},{label:"High Prio",variant:"high"}]}},o={args:{title:r,avatar:a.jsx(c,{initial:"AP","aria-label":"Ale P.",variant:"profile",size:"sm"})}},l={args:{title:r}},n={args:{title:r,badges:[{label:"In Progress",variant:"progress"},{label:"High Prio",variant:"high"}],avatar:a.jsxs(x,{"aria-label":"Assignees",children:[a.jsx(c,{initial:"JD","aria-label":"Jordan D.",variant:"profile",size:"sm",style:{backgroundColor:"#6C89A8"}}),a.jsx(c,{initial:"AM","aria-label":"Alex M.",variant:"profile",size:"sm",style:{backgroundColor:"#C38E70"}})]})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    title: ticketTitle,
    avatar: <Avatar initial="AP" aria-label="Ale P." variant="profile" size="sm" />
  }
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    title: ticketTitle
  }
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
        <Avatar initial="JD" aria-label="Jordan D." variant="profile" size="sm" style={{
        backgroundColor: '#6C89A8'
      }} />
        <Avatar initial="AM" aria-label="Alex M." variant="profile" size="sm" style={{
        backgroundColor: '#C38E70'
      }} />
      </AvatarGroup>
  }
}`,...n.parameters?.docs?.source}}};const M=["Default","WithoutAvatar","WithoutBadges","TitleOnly","WithAvatarGroup"];export{s as Default,l as TitleOnly,n as WithAvatarGroup,i as WithoutAvatar,o as WithoutBadges,M as __namedExportsOrder,D as default};
