import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as f}from"./iframe-BuSajZ3o.js";import{c as k}from"./cn-2dOUpm6k.js";import{B as T}from"./Badge-CVfelDm7.js";import{A as m}from"./Avatar-BYz2DN2P.js";import"./preload-helper-CyvMmb0J.js";const P="_block_1nsnv_1",x="_meta_1nsnv_7",A="_badges_1nsnv_13",_="_title_1nsnv_19",t={block:P,meta:x,badges:A,title:_},c=f.forwardRef(({title:l,badges:a,avatar:d,className:g,...v},h)=>{const u=a&&a.length>0||d!=null;return e.jsxs("div",{ref:h,className:k(t.block,g),...v,children:[u&&e.jsxs("div",{className:t.meta,children:[a&&a.length>0&&e.jsx("div",{className:t.badges,children:a.map((p,b)=>e.jsx(T,{variant:p.variant,children:p.label},b))}),d]}),e.jsx("h1",{className:t.title,children:l})]})});c.displayName="TicketTitleBlock";c.__docgenInfo={description:"",methods:[],displayName:"TicketTitleBlock",props:{title:{required:!0,tsType:{name:"string"},description:""},badges:{required:!1,tsType:{name:"unknown"},description:""},avatar:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["HTMLAttributes"]};const H={title:"Components/TicketTitleBlock",component:c,tags:["autodocs"],parameters:{docs:{description:{component:"Page-level title block for a ticket: an optional row of status badges and an avatar slot above a page heading. The top meta row is omitted entirely when both `badges` and `avatar` are absent."}}},decorators:[l=>e.jsx("div",{style:{width:"720px",padding:"24px"},children:e.jsx(l,{})})]},n="Implement dynamic edge-caching for API gateway responses",r={args:{title:n,badges:[{label:"In Progress",variant:"progress"},{label:"High Prio",variant:"high"}],avatar:e.jsx(m,{initial:"AP","aria-label":"Ale P.",variant:"profile",size:"sm"})}},s={args:{title:n,badges:[{label:"In Progress",variant:"progress"},{label:"High Prio",variant:"high"}]}},i={args:{title:n,avatar:e.jsx(m,{initial:"AP","aria-label":"Ale P.",variant:"profile",size:"sm"})}},o={args:{title:n}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    title: ticketTitle,
    avatar: <Avatar initial="AP" aria-label="Ale P." variant="profile" size="sm" />
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    title: ticketTitle
  }
}`,...o.parameters?.docs?.source}}};const z=["Default","WithoutAvatar","WithoutBadges","TitleOnly"];export{r as Default,o as TitleOnly,s as WithoutAvatar,i as WithoutBadges,z as __namedExportsOrder,H as default};
