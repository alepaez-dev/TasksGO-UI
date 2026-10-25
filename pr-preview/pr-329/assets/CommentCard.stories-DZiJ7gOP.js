import{j as m}from"./jsx-runtime-u17CrQMm.js";import{C as p}from"./CommentCard-1Ewy6kOn.js";import{J as c,A as l,M as g}from"./testFixtures-Ce977Qq0.js";import"./iframe-C5rbSSai.js";import"./preload-helper-CEvo-PNf.js";import"./cn-2dOUpm6k.js";import"./Avatar-C4ovvF0V.js";import"./HighlightedText-CJ2W8WMD.js";import"./Icon-ZdIs2WEz.js";import"./Markdown-CUu1Y-Nf.js";import"./linkRenderRule-bfJOd_Gz.js";import"./sanitizeHref-Bnrf33AA.js";import"./Card-AcB8gpmB.js";import"./FileChip-zU_v2vtT.js";import"./resolvePreview-DWjeOZcP.js";import"./RefLabel-e2q9cKG1.js";import"./ReactionBar-Dl96nFm7.js";import"./Popover-D2VHnDfB.js";import"./index-W1hapOxL.js";import"./index-Dhda_UOi.js";const i=[{emoji:"👍",count:2,reactedByViewer:!0,actors:[{id:"ap",name:"Ale P."},{id:"sk",name:"Sam K."}]}],h=[{id:"r1",actor:c,timestamp:"1h ago",body:"Good point — let's go with fan-out. I'll update the specs to reflect an SNS topic that fans out to SQS queues for the cache-invalidation workers."}],N={title:"Components/CommentCard",component:p,tags:["autodocs"],parameters:{docs:{description:{component:'A comment or ask in the activity feed. Renders an `<li>` — wrap cards in a `<ul>`, which owns the spacing between them. The body is markdown, so `query` marks matching terms and handles listed in `mentions` render as mentions. `kind="ask"` tints the bubble and switches the labels; passing `answeredBy` marks it answered and replaces the resolve button. Pass `onPin` to offer the pin button; `pinned` draws the ring instead and is mutually exclusive with it.'}}},argTypes:{kind:{control:"inline-radio",options:["comment","ask"]},mentions:{control:"object"},query:{control:"text"},pinned:{control:"boolean"}},args:{kind:"comment",actor:c,timestamp:"4h ago",body:`I've started looking into the edge-caching strategy. The main challenge will be invalidating the cache effectively when the underlying data changes — I'm thinking a combination of time-based expiry and explicit invalidation triggers.

Does anyone recall if we have existing patterns for SNS topic subscriptions in the gateway service?`}},e=d=>m.jsx("ul",{style:{listStyle:"none",margin:0,padding:0,maxWidth:720},children:d()}),n={decorators:[e],args:{reactions:i,onReply:()=>{},onPickerOpenChange:()=>{},onMore:()=>{}}},a={decorators:[e],args:{reactions:i,onReply:()=>{},onOpenAttachment:()=>{},attachments:[{id:"a1",name:"cache-hit-ratio-grafana.png",kind:"image"},{id:"a2",name:"gateway-topology.png",kind:"image"},{id:"a3",name:"SNS-invalidation-RFC.pdf",kind:"file"}]}},t={decorators:[e],args:{kind:"ask",actor:l,timestamp:"2h ago",body:"For the invalidation triggers, are we planning to use a fan-out pattern or direct subscription? Fan-out might be more resilient if we add more consumers later. @jordan",answeredBy:c,mentions:["jordan"],replies:h,onReply:()=>{},onMore:()=>{}}},o={decorators:[e],args:{kind:"ask",actor:g,timestamp:"40m ago",body:"What TTL are we defaulting to for `/v1/assets`? QA needs a number to write the burst-threshold scenario against.",onReply:()=>{},onMarkAnswered:()=>{}}},r={decorators:[e],args:{query:"cache",reactions:i,onReply:()=>{},onPin:()=>{}}},s={decorators:[e],args:{pinned:!0,reactions:i,onReply:()=>{}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  decorators: [inFeed],
  args: {
    reactions,
    onReply: () => {},
    onPickerOpenChange: () => {},
    onMore: () => {}
  }
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  decorators: [inFeed],
  args: {
    kind: 'ask',
    actor: MIKE,
    timestamp: '40m ago',
    body: 'What TTL are we defaulting to for \`/v1/assets\`? QA needs a number to write the burst-threshold scenario against.',
    onReply: () => {},
    onMarkAnswered: () => {}
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  decorators: [inFeed],
  args: {
    query: 'cache',
    reactions,
    onReply: () => {},
    onPin: () => {}
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  decorators: [inFeed],
  args: {
    pinned: true,
    reactions,
    onReply: () => {}
  }
}`,...s.parameters?.docs?.source}}};const q=["Default","WithAttachments","AnsweredAsk","OpenAsk","WithSearchMatch","Pinned"];export{t as AnsweredAsk,n as Default,o as OpenAsk,s as Pinned,a as WithAttachments,r as WithSearchMatch,q as __namedExportsOrder,N as default};
