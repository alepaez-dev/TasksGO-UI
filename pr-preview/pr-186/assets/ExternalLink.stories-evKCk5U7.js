import{j as e}from"./jsx-runtime-u17CrQMm.js";import{E as r}from"./ExternalLink-B6weVBeh.js";import"./iframe-JLbtai9c.js";import"./preload-helper-h1PH0FQq.js";import"./cn-2dOUpm6k.js";import"./sanitizeHref-a0N9eHv-.js";import"./Icon-wS9VI0Qe.js";const k={title:"Components/ExternalLink",component:r,tags:["autodocs"],parameters:{docs:{description:{component:'A security-hardened link to an external resource that opens in a new tab. Sanitizes the href, adds `rel="noopener noreferrer"`, shows a trailing "open in new tab" icon (suppressible), and announces "(opens in a new tab)" to screen readers. Single inline style — the consumer owns layout (e.g. a Quick Links list).'}}},argTypes:{href:{control:"text"},icon:{control:"text",description:"Optional leading icon (IconName)."},showExternalIcon:{control:"boolean",description:"Trailing open-in-new icon. Default true."},size:{control:"inline-radio",options:["sm","md"],description:"Label and icon size, in lockstep. Default md."},children:{control:"text"}},args:{href:"https://github.com/alepaez-dev/TasksGO-UI",children:"GitHub Repository"}},s={},n={args:{icon:"link",children:"GitHub Repository",size:"md"}},a={args:{children:"View all"}},o={parameters:{controls:{disable:!0}},render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-scale-sm)",alignItems:"flex-start"},children:[e.jsx(r,{href:"https://github.com/alepaez-dev/TasksGO-UI",icon:"link",size:"md",children:"Medium (default)"}),e.jsx(r,{href:"https://github.com/alepaez-dev/TasksGO-UI",icon:"link",size:"sm",children:"Small"})]})},i={args:{icon:"link",showExternalIcon:!1,children:"API Documentation"}},t={args:{icon:"link",children:"feat/dynamic-edge-caching-for-api-gateway-responses"},render:l=>e.jsx("div",{style:{width:200,padding:"var(--ds-space-scale-sm)",border:"1px solid var(--ds-color-border-default)",borderRadius:"var(--ds-radius-md)"},children:e.jsx(r,{...l})})},c={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-scale-sm)",maxWidth:240},children:[e.jsx(r,{href:"https://github.com/alepaez-dev/TasksGO-UI",icon:"link",children:"GitHub Repository"}),e.jsx(r,{href:"https://example.com/docs",icon:"description",children:"API Documentation"}),e.jsx(r,{href:"https://example.com/console",icon:"link",children:"CloudFront Console"})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:"{}",...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'link',
    children: 'GitHub Repository',
    size: 'md'
  }
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'View all'
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-space-scale-sm)',
    alignItems: 'flex-start'
  }}>
      <ExternalLink href="https://github.com/alepaez-dev/TasksGO-UI" icon="link" size="md">
        Medium (default)
      </ExternalLink>
      <ExternalLink href="https://github.com/alepaez-dev/TasksGO-UI" icon="link" size="sm">
        Small
      </ExternalLink>
    </div>
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'link',
    showExternalIcon: false,
    children: 'API Documentation'
  }
}`,...i.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'link',
    children: 'feat/dynamic-edge-caching-for-api-gateway-responses'
  },
  render: args => <div style={{
    width: 200,
    padding: 'var(--ds-space-scale-sm)',
    border: '1px solid var(--ds-color-border-default)',
    borderRadius: 'var(--ds-radius-md)'
  }}>
      <ExternalLink {...args} />
    </div>
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-space-scale-sm)',
    maxWidth: 240
  }}>
      <ExternalLink href="https://github.com/alepaez-dev/TasksGO-UI" icon="link">
        GitHub Repository
      </ExternalLink>
      <ExternalLink href="https://example.com/docs" icon="description">
        API Documentation
      </ExternalLink>
      <ExternalLink href="https://example.com/console" icon="link">
        CloudFront Console
      </ExternalLink>
    </div>
}`,...c.parameters?.docs?.source}}};const f=["Default","WithLeadingIcon","Inline","Sizes","WithoutExternalIcon","Truncated","QuickLinks"];export{s as Default,a as Inline,c as QuickLinks,o as Sizes,t as Truncated,n as WithLeadingIcon,i as WithoutExternalIcon,f as __namedExportsOrder,k as default};
