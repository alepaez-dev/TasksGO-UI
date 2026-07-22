import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as _}from"./iframe-iOXRFkSj.js";import{c as d}from"./cn-2dOUpm6k.js";import{I as R}from"./Icon-DJwJiiud.js";import{E as g}from"./ExternalLink-Dr5kInM5.js";import{B as p}from"./Badge-lZ5te-OP.js";import"./preload-helper-CyvMmb0J.js";import"./sanitizeHref-a0N9eHv-.js";const k="_row_1xe5x_1",T="_icon_1xe5x_12",b="_toneNeutral_1xe5x_20",N="_toneInfo_1xe5x_24",S="_toneSuccess_1xe5x_28",D="_toneWarning_1xe5x_32",E="_toneDanger_1xe5x_36",B="_primary_1xe5x_40",I="_primaryTruncate_1xe5x_50",q="_meta_1xe5x_56",L="_separator_1xe5x_69",W="_trailing_1xe5x_73",a={row:k,icon:T,toneNeutral:b,toneInfo:N,toneSuccess:S,toneWarning:D,toneDanger:E,primary:B,primaryTruncate:I,meta:q,separator:L,trailing:W},F={neutral:a.toneNeutral,info:a.toneInfo,success:a.toneSuccess,warning:a.toneWarning,danger:a.toneDanger},n=_.forwardRef(({icon:l,tone:f="neutral",meta:m,trailing:u,className:y,children:x,...w},v)=>{const j=m!==void 0&&m.length>0;return e.jsxs("li",{ref:v,className:d(a.row,y),...w,children:[e.jsx("span",{className:d(a.icon,F[f]),children:e.jsx(R,{name:l,size:"sm"})}),e.jsx("span",{className:d(a.primary,typeof x=="string"&&a.primaryTruncate),children:x}),j&&e.jsx("span",{className:a.meta,children:m.map((A,h)=>e.jsxs(_.Fragment,{children:[h>0&&e.jsx("span",{className:a.separator,"aria-hidden":"true",children:"·"}),A]},h))}),u&&e.jsx("span",{className:a.trailing,children:u})]})});n.displayName="ActivityRow";n.__docgenInfo={description:"",methods:[],displayName:"ActivityRow",props:{icon:{required:!0,tsType:{name:"unknown"},description:""},tone:{required:!1,tsType:{name:"union",raw:"'neutral' | 'info' | 'success' | 'warning' | 'danger'",elements:[{name:"literal",value:"'neutral'"},{name:"literal",value:"'info'"},{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'danger'"}]},description:"",defaultValue:{value:"'neutral'",computed:!1}},meta:{required:!1,tsType:{name:"unknown"},description:""},trailing:{required:!1,tsType:{name:"ReactNode"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};const H={title:"Components/ActivityRow",component:n,tags:["autodocs"],parameters:{docs:{description:{component:"A flexible two-line list row for dev activity (pull requests, commits, deployments). Slots take DS primitives directly: an ExternalLink title, a mono meta line, and trailing Badge(s). Renders an `<li>` — wrap rows in a `<ul>`. The `tone` prop tints the leading icon as visual reinforcement only (the icon is `aria-hidden`); pair danger/warning with a Badge or text so status is never conveyed by color alone."}}},decorators:[l=>e.jsx("ul",{style:{margin:0,padding:0,maxWidth:420,display:"flex",flexDirection:"column"},children:e.jsx(l,{})})],argTypes:{icon:{control:"text"},tone:{control:"inline-radio",options:["neutral","info","success","warning","danger"],description:"Tints the leading icon. Visual reinforcement only — the icon is aria-hidden, so pair danger/warning with a Badge or text so status is not color-only (WCAG 1.4.1)."}},args:{icon:"call_merge",children:"Add dark-mode toggle"}},r={args:{icon:"call_merge",tone:"success",meta:["#142","alex","2h ago"],trailing:e.jsx(p,{variant:"count",children:"2/13"}),children:e.jsx(g,{href:"https://github.com/example/pr/142",children:"Add dark-mode toggle"})}},t={args:{icon:"code",meta:["a1b9f2c","sam","5h ago"],children:e.jsx(g,{href:"https://github.com/example/commit/a1b9f2c",children:"Fix flaky viewport test"})}},o={args:{icon:"check_circle",tone:"danger",meta:["production","ci-bot","1d ago"],trailing:e.jsx(p,{variant:"critical",children:"Failed"}),children:"Deploy v4.1.0"}},i={args:{icon:"code",children:"A row with no meta and no trailing"}},s={args:{icon:"call_merge",tone:"info",meta:["#88","jordan","3d ago"],trailing:e.jsx(p,{variant:"progress",children:"Open"}),children:e.jsx(g,{href:"https://github.com/example/pr/88",children:"feat: dynamic edge caching for API gateway responses across all regions"})}},c={parameters:{controls:{disable:!0}},render:()=>e.jsxs(e.Fragment,{children:[e.jsx(n,{icon:"call_merge",tone:"neutral",meta:["neutral"],children:"Neutral tone"}),e.jsx(n,{icon:"call_merge",tone:"info",meta:["info"],children:"Info tone"}),e.jsx(n,{icon:"call_merge",tone:"success",meta:["success"],children:"Success tone"}),e.jsx(n,{icon:"call_merge",tone:"warning",meta:["warning"],children:"Warning tone"}),e.jsx(n,{icon:"call_merge",tone:"danger",meta:["danger"],children:"Danger tone"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'call_merge',
    tone: 'success',
    meta: ['#142', 'alex', '2h ago'],
    trailing: <Badge variant="count">2/13</Badge>,
    children: <ExternalLink href="https://github.com/example/pr/142">
        Add dark-mode toggle
      </ExternalLink>
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'code',
    meta: ['a1b9f2c', 'sam', '5h ago'],
    children: <ExternalLink href="https://github.com/example/commit/a1b9f2c">
        Fix flaky viewport test
      </ExternalLink>
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'check_circle',
    tone: 'danger',
    meta: ['production', 'ci-bot', '1d ago'],
    trailing: <Badge variant="critical">Failed</Badge>,
    children: 'Deploy v4.1.0'
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'code',
    children: 'A row with no meta and no trailing'
  }
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'call_merge',
    tone: 'info',
    meta: ['#88', 'jordan', '3d ago'],
    trailing: <Badge variant="progress">Open</Badge>,
    children: <ExternalLink href="https://github.com/example/pr/88">
        feat: dynamic edge caching for API gateway responses across all regions
      </ExternalLink>
  }
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <>
      <ActivityRow icon="call_merge" tone="neutral" meta={['neutral']}>
        Neutral tone
      </ActivityRow>
      <ActivityRow icon="call_merge" tone="info" meta={['info']}>
        Info tone
      </ActivityRow>
      <ActivityRow icon="call_merge" tone="success" meta={['success']}>
        Success tone
      </ActivityRow>
      <ActivityRow icon="call_merge" tone="warning" meta={['warning']}>
        Warning tone
      </ActivityRow>
      <ActivityRow icon="call_merge" tone="danger" meta={['danger']}>
        Danger tone
      </ActivityRow>
    </>
}`,...c.parameters?.docs?.source}}};const J=["PullRequest","Commit","Deployment","Minimal","TruncatedTitle","AllTones"];export{c as AllTones,t as Commit,o as Deployment,i as Minimal,r as PullRequest,s as TruncatedTitle,J as __namedExportsOrder,H as default};
