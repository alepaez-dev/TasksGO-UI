import{j as r}from"./jsx-runtime-u17CrQMm.js";import{w as m}from"./decorators-D_u35ZwG.js";import{d as o,m as d}from"./iframe-Ue28p0jA.js";import{B as e}from"./Button-BLc-B-8n.js";import"./preload-helper-CyvMmb0J.js";import"./cn-2dOUpm6k.js";const b={title:"Components/Button",component:e,tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","ghost","ai"]},size:{control:"select",options:["sm","md"]},disabled:{control:"boolean"},children:{control:"text"}},args:{children:"Button"}},t={parameters:{viewport:{options:o}}},a={parameters:{viewport:{options:o}},args:{variant:"secondary"}},s={decorators:[m("mobile")],parameters:{viewport:{options:d}},args:{size:"md"}},n={decorators:[m("mobile")],parameters:{viewport:{options:d}},render:()=>r.jsxs("div",{style:{display:"flex",gap:"var(--ds-space-button-group-gap)",alignItems:"center"},children:[r.jsx(e,{size:"md",variant:"primary",children:"Primary"}),r.jsx(e,{size:"md",variant:"secondary",children:"Secondary"}),r.jsx(e,{size:"md",variant:"ghost",children:"Ghost"}),r.jsx(e,{size:"md",variant:"ai",children:"AI"})]})},i={parameters:{viewport:{options:o}},args:{variant:"ghost"}},p={parameters:{viewport:{options:o}},args:{variant:"ai",children:"Generate with AI"}},c={parameters:{viewport:{options:o}},args:{disabled:!0}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      options: desktopViewports
    }
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      options: desktopViewports
    }
  },
  args: {
    variant: 'secondary'
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions
    }
  },
  args: {
    size: 'md'
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions
    }
  },
  render: () => <div style={{
    display: 'flex',
    gap: 'var(--ds-space-button-group-gap)',
    alignItems: 'center'
  }}>
      <Button size="md" variant="primary">
        Primary
      </Button>
      <Button size="md" variant="secondary">
        Secondary
      </Button>
      <Button size="md" variant="ghost">
        Ghost
      </Button>
      <Button size="md" variant="ai">
        AI
      </Button>
    </div>
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      options: desktopViewports
    }
  },
  args: {
    variant: 'ghost'
  }
}`,...i.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      options: desktopViewports
    }
  },
  args: {
    variant: 'ai',
    children: 'Generate with AI'
  }
}`,...p.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      options: desktopViewports
    }
  },
  args: {
    disabled: true
  }
}`,...c.parameters?.docs?.source}}};const y=["Default","Secondary","Mobile","MobileAllVariants","Ghost","AI","Disabled"];export{p as AI,t as Default,c as Disabled,i as Ghost,s as Mobile,n as MobileAllVariants,a as Secondary,y as __namedExportsOrder,b as default};
