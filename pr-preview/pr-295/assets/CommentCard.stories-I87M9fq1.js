import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as P}from"./iframe-DQzDOA3N.js";import{c as i}from"./cn-2dOUpm6k.js";import{A as T}from"./Avatar-C-2f1PA4.js";import{I as t}from"./Icon-B3T8eCrm.js";import{M as S}from"./Markdown-BiolrUCl.js";import{F as W}from"./FileChip-B1faGvhT.js";import{R as V}from"./ReactionBar-DKKID2tU.js";import{J as b,A as D,M as H,r as L}from"./testFixtures-BZvXuINM.js";import"./preload-helper-B-j5Cm3y.js";import"./linkRenderRule-BHQ3e2rt.js";import"./sanitizeHref-Bnrf33AA.js";import"./HighlightedText-DlzOHvAo.js";import"./Card-DByVjHrX.js";import"./resolvePreview-DWjeOZcP.js";import"./RefLabel-CZL1Equ6.js";const $="_entry_1dkvi_1",J="_avatar_1dkvi_10",Q="_main_1dkvi_14",K="_head_1dkvi_18",X="_author_1dkvi_25",G="_time_1dkvi_31",U="_chip_1dkvi_36",Y="_chipComment_1dkvi_50",Z="_chipAsk_1dkvi_55",ee="_chipAnswered_1dkvi_60",ne="_actions_1dkvi_65",ae="_action_1dkvi_65",se="_bubble_1dkvi_108",te="_bubbleComment_1dkvi_118",oe="_bubbleAsk_1dkvi_123",re="_bubbleAnswered_1dkvi_129",ie="_attachments_1dkvi_134",ce="_foot_1dkvi_145",de="_footBtn_1dkvi_152",le="_solved_1dkvi_178",me="_replies_1dkvi_183",pe="_reply_1dkvi_194",ue="_replyHead_1dkvi_200",he="_replyAuthor_1dkvi_207",ge="_replyBody_1dkvi_213",ye="_pinned_1dkvi_220",be="_srOnly_1dkvi_226",n={entry:$,avatar:J,main:Q,head:K,author:X,time:G,chip:U,chipComment:Y,chipAsk:Z,chipAnswered:ee,actions:ne,action:ae,bubble:se,bubbleComment:te,bubbleAsk:oe,bubbleAnswered:re,attachments:ie,foot:ce,footBtn:de,solved:le,replies:me,reply:pe,replyHead:ue,replyAuthor:he,replyBody:ge,pinned:ye,srOnly:be},_e=[],ke={comment:n.chipComment,ask:n.chipAsk},fe={comment:n.bubbleComment,ask:n.bubbleAsk},_=P.forwardRef(({kind:s,actor:r,body:q,timestamp:F,query:k="",mentions:f,attachments:v=_e,onOpenAttachment:x,replies:w=[],reactions:M=[],answeredBy:A,pinned:y=!1,onReply:j,onMarkAnswered:N,onToggleReaction:B,onAddReaction:O,onMore:R,onPin:C,className:z,...I},E)=>{const c=s==="ask"&&A!==void 0;return e.jsxs("li",{ref:E,tabIndex:y?-1:void 0,className:i(n.entry,y&&n.pinned,z),...I,children:[y&&e.jsx("span",{className:n.srOnly,children:"Pinned"}),e.jsx(T,{size:"lg",variant:"profile",initial:r.initial,tint:r.tint,"aria-label":r.name,className:n.avatar}),e.jsxs("div",{className:n.main,children:[e.jsxs("div",{className:n.head,children:[e.jsx("span",{className:n.author,children:r.name}),e.jsxs("span",{className:i(n.chip,ke[s]),children:[e.jsx(t,{name:s==="ask"?"help":"comment_filled",size:"xs"}),s==="ask"?"Asked":"Comment"]}),c&&e.jsxs("span",{className:i(n.chip,n.chipAnswered),children:[e.jsx(t,{name:"check_circle",size:"xs"}),"Answered"]}),e.jsx("span",{className:n.time,children:F}),e.jsxs("span",{className:n.actions,children:[C&&e.jsx("button",{type:"button",className:n.action,onClick:C,"aria-label":`Pin ${s==="ask"?"ask":"comment"} by ${r.name}`,children:e.jsx(t,{name:"push_pin_filled",size:"xs"})}),R&&e.jsx("button",{type:"button",className:n.action,"aria-label":"More actions",onClick:R,children:e.jsx(t,{name:"more_horiz",size:"xs"})})]})]}),e.jsx(S,{source:q,query:k,mentions:f,className:i(n.bubble,fe[s],c&&n.bubbleAnswered)}),v.length>0&&e.jsx("div",{className:n.attachments,children:v.map(a=>e.jsx(W,{label:a.name,kind:a.kind,onOpen:x?()=>x(a.id):void 0},a.id))}),e.jsxs("div",{className:n.foot,children:[j&&e.jsxs("button",{type:"button",className:n.footBtn,onClick:j,children:[e.jsx(t,{name:"reply",size:"xs"}),s==="ask"?"Reply to Ask":"Reply"]}),c&&e.jsxs("span",{className:i(n.footBtn,n.solved),children:[e.jsx(t,{name:"check_circle",size:"xs"}),"Answered by ",A.name]}),s==="ask"&&!c&&N&&e.jsxs("button",{type:"button",className:n.footBtn,onClick:N,children:[e.jsx(t,{name:"check",size:"xs"}),"Mark as answered"]}),e.jsx(V,{reactions:M,onToggleReaction:B,onAddReaction:O})]}),w.length>0&&e.jsx("ul",{"aria-label":"Replies",className:n.replies,children:w.map(a=>e.jsxs("li",{className:n.reply,children:[e.jsx(T,{variant:"profile",initial:a.actor.initial,tint:a.actor.tint,"aria-label":a.actor.name}),e.jsxs("div",{children:[e.jsxs("div",{className:n.replyHead,children:[e.jsx("span",{className:n.replyAuthor,children:a.actor.name}),e.jsx("span",{className:n.time,children:a.at})]}),e.jsx(S,{source:a.body,query:k,mentions:f,className:n.replyBody})]})]},a.id))})]})]})});_.displayName="CommentCard";_.__docgenInfo={description:"",methods:[],displayName:"CommentCard",props:{actor:{required:!0,tsType:{name:"ActivityActor"},description:""},body:{required:!0,tsType:{name:"string"},description:""},timestamp:{required:!0,tsType:{name:"ReactNode"},description:""},query:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},mentions:{required:!1,tsType:{name:"unknown"},description:""},attachments:{required:!1,tsType:{name:"unknown"},description:"",defaultValue:{value:"[]",computed:!1}},onOpenAttachment:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},replies:{required:!1,tsType:{name:"unknown"},description:"",defaultValue:{value:"[]",computed:!1}},reactions:{required:!1,tsType:{name:"unknown"},description:"",defaultValue:{value:"[]",computed:!1}},onReply:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onToggleReaction:{required:!1,tsType:{name:"signature",type:"function",raw:"(emoji: string) => void",signature:{arguments:[{type:{name:"string"},name:"emoji"}],return:{name:"void"}}},description:""},onAddReaction:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onMore:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},pinned:{defaultValue:{value:"false",computed:!1},required:!1}}};const g=[{emoji:"👍",count:2,reactedByViewer:!0}],ve=[L(b,60,{at:"1h ago",body:"Good point — let's go with fan-out. I'll update the specs to reflect an SNS topic that fans out to SQS queues for the cache-invalidation workers."})],Ee={title:"Components/CommentCard",component:_,tags:["autodocs"],parameters:{docs:{description:{component:'A comment or ask in the activity feed. Renders an `<li>` — wrap cards in a `<ul>`, which owns the spacing between them. The body is markdown, so `query` marks matching terms and handles listed in `mentions` render as mentions. `kind="ask"` tints the bubble and switches the labels; passing `answeredBy` marks it answered and replaces the resolve button. Pass `onPin` to offer the pin button; `pinned` draws the ring instead and is mutually exclusive with it.'}}},argTypes:{kind:{control:"inline-radio",options:["comment","ask"]},mentions:{control:"object"},query:{control:"text"},pinned:{control:"boolean"}},args:{kind:"comment",actor:b,timestamp:"4h ago",body:`I've started looking into the edge-caching strategy. The main challenge will be invalidating the cache effectively when the underlying data changes — I'm thinking a combination of time-based expiry and explicit invalidation triggers.

Does anyone recall if we have existing patterns for SNS topic subscriptions in the gateway service?`}},o=s=>e.jsx("ul",{style:{listStyle:"none",margin:0,padding:0,maxWidth:720},children:s()}),d={decorators:[o],args:{reactions:g,onReply:()=>{},onAddReaction:()=>{},onMore:()=>{}}},l={decorators:[o],args:{reactions:g,onReply:()=>{},onOpenAttachment:()=>{},attachments:[{id:"a1",name:"cache-hit-ratio-grafana.png",kind:"image"},{id:"a2",name:"gateway-topology.png",kind:"image"},{id:"a3",name:"SNS-invalidation-RFC.pdf",kind:"file"}]}},m={decorators:[o],args:{kind:"ask",actor:D,timestamp:"2h ago",body:"For the invalidation triggers, are we planning to use a fan-out pattern or direct subscription? Fan-out might be more resilient if we add more consumers later. @jordan",answeredBy:b,mentions:["jordan"],replies:ve,onReply:()=>{},onMore:()=>{}}},p={decorators:[o],args:{kind:"ask",actor:H,timestamp:"40m ago",body:"What TTL are we defaulting to for `/v1/assets`? QA needs a number to write the burst-threshold scenario against.",onReply:()=>{},onMarkAnswered:()=>{}}},u={decorators:[o],args:{query:"cache",reactions:g,onReply:()=>{},onPin:()=>{}}},h={decorators:[o],args:{pinned:!0,reactions:g,onReply:()=>{}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
    reactions,
    onReply: () => {},
    onOpenAttachment: () => {},
    attachments: [{
      id: 'a1',
      name: 'cache-hit-ratio-grafana.png',
      kind: 'image'
    }, {
      id: 'a2',
      name: 'gateway-topology.png',
      kind: 'image'
    }, {
      id: 'a3',
      name: 'SNS-invalidation-RFC.pdf',
      kind: 'file'
    }]
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  decorators: [inFeed],
  args: {
    kind: 'ask',
    actor: MIKE,
    timestamp: '40m ago',
    body: 'What TTL are we defaulting to for \`/v1/assets\`? QA needs a number to write the burst-threshold scenario against.',
    onReply: () => {},
    onMarkAnswered: () => {}
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  decorators: [inFeed],
  args: {
    query: 'cache',
    reactions,
    onReply: () => {},
    onPin: () => {}
  }
}`,...u.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  decorators: [inFeed],
  args: {
    pinned: true,
    reactions,
    onReply: () => {}
  }
}`,...h.parameters?.docs?.source}}};const Pe=["Default","WithAttachments","AnsweredAsk","OpenAsk","WithSearchMatch","Pinned"];export{m as AnsweredAsk,d as Default,p as OpenAsk,h as Pinned,l as WithAttachments,u as WithSearchMatch,Pe as __namedExportsOrder,Ee as default};
