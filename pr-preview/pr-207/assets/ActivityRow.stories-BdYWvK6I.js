import{j as e}from"./jsx-runtime-u17CrQMm.js";import{A as r}from"./ActivityRow-CxDN8cEh.js";import{E as l}from"./ExternalLink-BMZ1hu45.js";import{B as m}from"./Badge-CtvJ2Tvp.js";import"./iframe-TsoxqUh8.js";import"./preload-helper-Cv5kynVY.js";import"./cn-2dOUpm6k.js";import"./Icon-dW02SXhX.js";import"./sanitizeHref-a0N9eHv-.js";const A={title:"Components/ActivityRow",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"A flexible two-line list row for dev activity (pull requests, commits, deployments). Slots take DS primitives directly: an ExternalLink title, a mono meta line, and trailing Badge(s). Renders an `<li>` — wrap rows in a `<ul>`. The `tone` prop tints the leading icon as visual reinforcement only (the icon is `aria-hidden`); pair danger/warning with a Badge or text so status is never conveyed by color alone."}}},decorators:[d=>e.jsx("ul",{style:{margin:0,padding:0,maxWidth:420,display:"flex",flexDirection:"column"},children:e.jsx(d,{})})],argTypes:{icon:{control:"text"},tone:{control:"inline-radio",options:["neutral","info","success","warning","danger"],description:"Tints the leading icon. Visual reinforcement only — the icon is aria-hidden, so pair danger/warning with a Badge or text so status is not color-only (WCAG 1.4.1)."}},args:{icon:"call_merge",children:"Add dark-mode toggle"}},a={args:{icon:"call_merge",tone:"success",meta:["#142","alex","2h ago"],trailing:e.jsx(m,{variant:"count",children:"2/13"}),children:e.jsx(l,{href:"https://github.com/example/pr/142",children:"Add dark-mode toggle"})}},t={args:{icon:"code",meta:["a1b9f2c","sam","5h ago"],children:e.jsx(l,{href:"https://github.com/example/commit/a1b9f2c",children:"Fix flaky viewport test"})}},o={args:{icon:"check_circle",tone:"danger",meta:["production","ci-bot","1d ago"],trailing:e.jsx(m,{variant:"critical",children:"Failed"}),children:"Deploy v4.1.0"}},n={args:{icon:"code",children:"A row with no meta and no trailing"}},i={args:{icon:"call_merge",tone:"info",meta:["#88","jordan","3d ago"],trailing:e.jsx(m,{variant:"progress",children:"Open"}),children:e.jsx(l,{href:"https://github.com/example/pr/88",children:"feat: dynamic edge caching for API gateway responses across all regions"})}},c={parameters:{controls:{disable:!0}},render:()=>e.jsxs(e.Fragment,{children:[e.jsx(r,{icon:"call_merge",tone:"neutral",meta:["neutral"],children:"Neutral tone"}),e.jsx(r,{icon:"call_merge",tone:"info",meta:["info"],children:"Info tone"}),e.jsx(r,{icon:"call_merge",tone:"success",meta:["success"],children:"Success tone"}),e.jsx(r,{icon:"call_merge",tone:"warning",meta:["warning"],children:"Warning tone"}),e.jsx(r,{icon:"call_merge",tone:"danger",meta:["danger"],children:"Danger tone"})]})},s={parameters:{controls:{disable:!0}},render:()=>e.jsx(r,{leading:e.jsx(m,{variant:"count",children:"37"}),meta:["on this branch"],trailing:e.jsx(l,{href:"https://example.com/commits",children:"View all"}),children:"37 commits"})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'call_merge',
    tone: 'success',
    meta: ['#142', 'alex', '2h ago'],
    trailing: <Badge variant="count">2/13</Badge>,
    children: <ExternalLink href="https://github.com/example/pr/142">
        Add dark-mode toggle
      </ExternalLink>
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'code',
    children: 'A row with no meta and no trailing'
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'call_merge',
    tone: 'info',
    meta: ['#88', 'jordan', '3d ago'],
    trailing: <Badge variant="progress">Open</Badge>,
    children: <ExternalLink href="https://github.com/example/pr/88">
        feat: dynamic edge caching for API gateway responses across all regions
      </ExternalLink>
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <ActivityRow leading={<Badge variant="count">37</Badge>} meta={['on this branch']} trailing={<ExternalLink href="https://example.com/commits">View all</ExternalLink>}>
      37 commits
    </ActivityRow>
}`,...s.parameters?.docs?.source}}};const j=["PullRequest","Commit","Deployment","Minimal","TruncatedTitle","AllTones","CustomLeading"];export{c as AllTones,t as Commit,s as CustomLeading,o as Deployment,n as Minimal,a as PullRequest,i as TruncatedTitle,j as __namedExportsOrder,A as default};
