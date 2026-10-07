import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as D}from"./iframe-BsOfj63y.js";import{c as r}from"./cn-2dOUpm6k.js";import{A as R}from"./Avatar-C-3uN1jq.js";import{I as o}from"./Icon-DDE8Bo2Y.js";import{M as C}from"./Markdown-D2KgTB9J.js";import{R as O}from"./ReactionBar-BdcefWpq.js";import"./preload-helper-BXxMBR1D.js";import"./linkRenderRule-D8bc6Yhp.js";import"./sanitizeHref-Bnrf33AA.js";import"./HighlightedText-DlzOHvAo.js";import"./Card-D9bqDQWz.js";const z="_entry_1sy05_1",E="_avatar_1sy05_10",P="_main_1sy05_14",$="_head_1sy05_18",V="_author_1sy05_25",W="_time_1sy05_31",H="_chip_1sy05_36",J="_chipComment_1sy05_50",L="_chipAsk_1sy05_55",Q="_chipAnswered_1sy05_60",X="_actions_1sy05_65",K="_action_1sy05_65",G="_bubble_1sy05_108",U="_bubbleComment_1sy05_118",Z="_bubbleAsk_1sy05_123",Y="_bubbleAnswered_1sy05_129",ee="_foot_1sy05_134",ne="_footBtn_1sy05_141",se="_solved_1sy05_167",ae="_replies_1sy05_172",te="_reply_1sy05_183",oe="_replyHead_1sy05_189",re="_replyAuthor_1sy05_196",ie="_replyBody_1sy05_202",ce="_pinned_1sy05_209",de="_srOnly_1sy05_215",n={entry:z,avatar:E,main:P,head:$,author:V,time:W,chip:H,chipComment:J,chipAsk:L,chipAnswered:Q,actions:X,action:K,bubble:G,bubbleComment:U,bubbleAsk:Z,bubbleAnswered:Y,foot:ee,footBtn:ne,solved:se,replies:ae,reply:te,replyHead:oe,replyAuthor:re,replyBody:ie,pinned:ce,srOnly:de},le={comment:n.chipComment,ask:n.chipAsk},me={comment:n.bubbleComment,ask:n.bubbleAsk},b=D.forwardRef(({kind:s,actor:a,body:h,timestamp:T,query:f="",mentions:x,replies:k=[],reactions:q=[],answeredBy:w,pinned:y=!1,onReply:A,onMarkAnswered:j,onToggleReaction:M,onAddReaction:S,onMore:v,onPin:N,className:B,...F},I)=>{const c=s==="ask"&&w!==void 0;return e.jsxs("li",{ref:I,tabIndex:y?-1:void 0,className:r(n.entry,y&&n.pinned,B),...F,children:[y&&e.jsx("span",{className:n.srOnly,children:"Pinned"}),e.jsx(R,{size:"lg",variant:"profile",initial:a.initial,tint:a.tint,"aria-label":a.name,className:n.avatar}),e.jsxs("div",{className:n.main,children:[e.jsxs("div",{className:n.head,children:[e.jsx("span",{className:n.author,children:a.name}),e.jsxs("span",{className:r(n.chip,le[s]),children:[e.jsx(o,{name:s==="ask"?"help":"comment_filled",size:"xs"}),s==="ask"?"Asked":"Comment"]}),c&&e.jsxs("span",{className:r(n.chip,n.chipAnswered),children:[e.jsx(o,{name:"check_circle",size:"xs"}),"Answered"]}),e.jsx("span",{className:n.time,children:T}),e.jsxs("span",{className:n.actions,children:[N&&e.jsx("button",{type:"button",className:n.action,onClick:N,"aria-label":`Pin ${s==="ask"?"ask":"comment"} by ${a.name}`,children:e.jsx(o,{name:"push_pin_filled",size:"xs"})}),v&&e.jsx("button",{type:"button",className:n.action,"aria-label":"More actions",onClick:v,children:e.jsx(o,{name:"more_horiz",size:"xs"})})]})]}),e.jsx(C,{source:h,query:f,mentions:x,className:r(n.bubble,me[s],c&&n.bubbleAnswered)}),e.jsxs("div",{className:n.foot,children:[A&&e.jsxs("button",{type:"button",className:n.footBtn,onClick:A,children:[e.jsx(o,{name:"reply",size:"xs"}),s==="ask"?"Reply to Ask":"Reply"]}),c&&e.jsxs("span",{className:r(n.footBtn,n.solved),children:[e.jsx(o,{name:"check_circle",size:"xs"}),"Answered by ",w.name]}),s==="ask"&&!c&&j&&e.jsxs("button",{type:"button",className:n.footBtn,onClick:j,children:[e.jsx(o,{name:"check",size:"xs"}),"Mark as answered"]}),e.jsx(O,{reactions:q,onToggleReaction:M,onAddReaction:S})]}),k.length>0&&e.jsx("ul",{"aria-label":"Replies",className:n.replies,children:k.map(t=>e.jsxs("li",{className:n.reply,children:[e.jsx(R,{variant:"profile",initial:t.actor.initial,tint:t.actor.tint,"aria-label":t.actor.name}),e.jsxs("div",{children:[e.jsxs("div",{className:n.replyHead,children:[e.jsx("span",{className:n.replyAuthor,children:t.actor.name}),e.jsx("span",{className:n.time,children:t.at})]}),e.jsx(C,{source:t.body,query:f,mentions:x,className:n.replyBody})]})]},t.id))})]})]})});b.displayName="CommentCard";b.__docgenInfo={description:"",methods:[],displayName:"CommentCard",props:{actor:{required:!0,tsType:{name:"ActivityActor"},description:""},body:{required:!0,tsType:{name:"string"},description:""},timestamp:{required:!0,tsType:{name:"ReactNode"},description:""},query:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},mentions:{required:!1,tsType:{name:"unknown"},description:""},replies:{required:!1,tsType:{name:"unknown"},description:"",defaultValue:{value:"[]",computed:!1}},reactions:{required:!1,tsType:{name:"unknown"},description:"",defaultValue:{value:"[]",computed:!1}},onReply:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onToggleReaction:{required:!1,tsType:{name:"signature",type:"function",raw:"(emoji: string) => void",signature:{arguments:[{type:{name:"string"},name:"emoji"}],return:{name:"void"}}},description:""},onAddReaction:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onMore:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},pinned:{defaultValue:{value:"false",computed:!1},required:!1}}};const _={id:"jd",name:"Jordan D.",initial:"JD",kind:"human",tint:"#4F6F8F"},pe={id:"am",name:"Alex M.",initial:"AM",kind:"human",tint:"#856D4A"},ue={id:"mr",name:"Mike R.",initial:"MR",kind:"human",tint:"#7560C2"},he=Date.parse("2026-01-14T12:00:00.000Z");function ye(s){return new Date(he+s*6e4).toISOString()}function be(s,a,h={}){return{id:`r-${s.id}-${a}`,at:ye(a),actor:s,body:"sounds good",...h}}const g=[{emoji:"👍",count:2,reactedByViewer:!0}],_e=[be(_,60,{at:"1h ago",body:"Good point — let's go with fan-out. I'll update the specs to reflect an SNS topic that fans out to SQS queues for the cache-invalidation workers."})],qe={title:"Components/CommentCard",component:b,tags:["autodocs"],parameters:{docs:{description:{component:'A comment or ask in the activity feed. Renders an `<li>` — wrap cards in a `<ul>`, which owns the spacing between them. The body is markdown, so `query` marks matching terms and handles listed in `mentions` render as mentions. `kind="ask"` tints the bubble and switches the labels; passing `answeredBy` marks it answered and replaces the resolve button. Pass `onPin` to offer the pin button; `pinned` draws the ring instead and is mutually exclusive with it.'}}},argTypes:{kind:{control:"inline-radio",options:["comment","ask"]},mentions:{control:"object"},query:{control:"text"},pinned:{control:"boolean"}},args:{kind:"comment",actor:_,timestamp:"4h ago",body:`I've started looking into the edge-caching strategy. The main challenge will be invalidating the cache effectively when the underlying data changes — I'm thinking a combination of time-based expiry and explicit invalidation triggers.

Does anyone recall if we have existing patterns for SNS topic subscriptions in the gateway service?`}},i=s=>e.jsx("ul",{style:{listStyle:"none",margin:0,padding:0,maxWidth:720},children:s()}),d={decorators:[i],args:{reactions:g,onReply:()=>{},onAddReaction:()=>{},onMore:()=>{}}},l={decorators:[i],args:{kind:"ask",actor:pe,timestamp:"2h ago",body:"For the invalidation triggers, are we planning to use a fan-out pattern or direct subscription? Fan-out might be more resilient if we add more consumers later. @jordan",answeredBy:_,mentions:["jordan"],replies:_e,onReply:()=>{},onMore:()=>{}}},m={decorators:[i],args:{kind:"ask",actor:ue,timestamp:"40m ago",body:"What TTL are we defaulting to for `/v1/assets`? QA needs a number to write the burst-threshold scenario against.",onReply:()=>{},onMarkAnswered:()=>{}}},p={decorators:[i],args:{query:"cache",reactions:g,onReply:()=>{},onPin:()=>{}}},u={decorators:[i],args:{pinned:!0,reactions:g,onReply:()=>{}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  decorators: [inFeed],
  args: {
    reactions,
    onReply: () => {},
    onAddReaction: () => {},
    onMore: () => {}
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  decorators: [inFeed],
  args: {
    kind: 'ask',
    actor: ALEX,
    timestamp: '2h ago',
    body: 'For the invalidation triggers, are we planning to use a fan-out pattern or direct subscription? Fan-out might be more resilient if we add more consumers later. @jordan',
    answeredBy: JORDAN,
    mentions: ['jordan'],
    replies,
    onReply: () => {},
    onMore: () => {}
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  decorators: [inFeed],
  args: {
    kind: 'ask',
    actor: MIKE,
    timestamp: '40m ago',
    body: 'What TTL are we defaulting to for \`/v1/assets\`? QA needs a number to write the burst-threshold scenario against.',
    onReply: () => {},
    onMarkAnswered: () => {}
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  decorators: [inFeed],
  args: {
    query: 'cache',
    reactions,
    onReply: () => {},
    onPin: () => {}
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  decorators: [inFeed],
  args: {
    pinned: true,
    reactions,
    onReply: () => {}
  }
}`,...u.parameters?.docs?.source}}};const Me=["Default","AnsweredAsk","OpenAsk","WithSearchMatch","Pinned"];export{l as AnsweredAsk,d as Default,m as OpenAsk,u as Pinned,p as WithSearchMatch,Me as __namedExportsOrder,qe as default};
