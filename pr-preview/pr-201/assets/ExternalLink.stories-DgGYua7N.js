import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as b}from"./iframe-BkxkAkzO.js";import{c as v}from"./cn-2dOUpm6k.js";import{s as I}from"./sanitizeHref-a0N9eHv-.js";import{I as u}from"./Icon-DjBeAuJY.js";import"./preload-helper-Deh0GfcN.js";const _="_externalLink_sgnss_1",E="_sm_sgnss_12",L="_md_sgnss_16",w="_label_sgnss_30",z="_icon_sgnss_37",j="_srOnly_sgnss_41",n={externalLink:_,sm:E,md:L,label:w,icon:z,srOnly:j},h={sm:"xs",md:"sm"},s=b.forwardRef(({href:d,icon:p,showExternalIcon:x=!0,size:m="md",className:f,children:g,...k},y)=>e.jsxs("a",{ref:y,className:v(n.externalLink,n[m],f),...k,href:I(d),target:"_blank",rel:"noopener noreferrer",children:[p&&e.jsx(u,{name:p,size:h[m],className:n.icon}),e.jsx("span",{className:n.label,children:g}),x&&e.jsx(u,{name:"open_in_new",size:h[m],className:n.icon}),e.jsx("span",{className:n.srOnly,children:" (opens in a new tab)"})]}));s.displayName="ExternalLink";s.__docgenInfo={description:"",methods:[],displayName:"ExternalLink",props:{href:{required:!0,tsType:{name:"string"},description:""},icon:{required:!1,tsType:{name:"unknown"},description:""},showExternalIcon:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"",defaultValue:{value:"'md'",computed:!1}}},composes:["Omit"]};const R={title:"Components/ExternalLink",component:s,tags:["autodocs"],parameters:{docs:{description:{component:'A security-hardened link to an external resource that opens in a new tab. Sanitizes the href, adds `rel="noopener noreferrer"`, shows a trailing "open in new tab" icon (suppressible), and announces "(opens in a new tab)" to screen readers. Single inline style — the consumer owns layout (e.g. a Quick Links list).'}}},argTypes:{href:{control:"text"},icon:{control:"text",description:"Optional leading icon (IconName)."},showExternalIcon:{control:"boolean",description:"Trailing open-in-new icon. Default true."},size:{control:"inline-radio",options:["sm","md"],description:"Label and icon size, in lockstep. Default md."},children:{control:"text"}},args:{href:"https://github.com/alepaez-dev/TasksGO-UI",children:"GitHub Repository"}},r={},a={args:{icon:"link",children:"GitHub Repository",size:"md"}},o={args:{children:"View all"}},i={parameters:{controls:{disable:!0}},render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-scale-sm)",alignItems:"flex-start"},children:[e.jsx(s,{href:"https://github.com/alepaez-dev/TasksGO-UI",icon:"link",size:"md",children:"Medium (default)"}),e.jsx(s,{href:"https://github.com/alepaez-dev/TasksGO-UI",icon:"link",size:"sm",children:"Small"})]})},t={args:{icon:"link",showExternalIcon:!1,children:"API Documentation"}},c={args:{icon:"link",children:"feat/dynamic-edge-caching-for-api-gateway-responses"},render:d=>e.jsx("div",{style:{width:200,padding:"var(--ds-space-scale-sm)",border:"1px solid var(--ds-color-border-default)",borderRadius:"var(--ds-radius-md)"},children:e.jsx(s,{...d})})},l={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-scale-sm)",maxWidth:240},children:[e.jsx(s,{href:"https://github.com/alepaez-dev/TasksGO-UI",icon:"link",children:"GitHub Repository"}),e.jsx(s,{href:"https://example.com/docs",icon:"description",children:"API Documentation"}),e.jsx(s,{href:"https://example.com/console",icon:"link",children:"CloudFront Console"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'link',
    children: 'GitHub Repository',
    size: 'md'
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'View all'
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'link',
    showExternalIcon: false,
    children: 'API Documentation'
  }
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};const U=["Default","WithLeadingIcon","Inline","Sizes","WithoutExternalIcon","Truncated","QuickLinks"];export{r as Default,o as Inline,l as QuickLinks,i as Sizes,c as Truncated,a as WithLeadingIcon,t as WithoutExternalIcon,U as __namedExportsOrder,R as default};
