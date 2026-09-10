import{j as e}from"./jsx-runtime-u17CrQMm.js";import{F as n}from"./Fab-D-Fhv6Ax.js";import{w as l}from"./decorators-Do9Ds2IE.js";import{m}from"./iframe-hYwrLbzl.js";import{B as d}from"./BottomTabBar-0w-rvMVu.js";import{N as c}from"./NavItem-CpozDtHP.js";import{i as p}from"./Icon-D5xF2XOg.js";import"./cn-2dOUpm6k.js";import"./preload-helper-BpXmitva.js";import"./sanitizeHref-Bnrf33AA.js";const b={"--ds-space-fab-bottom-offset":"var(--ds-space-fab-bottom-offset-above-tab-bar)"},u=Object.keys(p),A={title:"Components/Fab",component:n,tags:["autodocs"],argTypes:{icon:{control:"select",options:u},disabled:{control:"boolean"}},args:{icon:"add","aria-label":"New task"},parameters:{layout:"fullscreen"}},a={},r={args:{icon:"auto_awesome","aria-label":"Generate with AI"}},o={args:{disabled:!0}},t={render:()=>e.jsx(n,{label:"Add scenario"})},s={name:"Extended (label longer than the viewport)",decorators:[l("mobileSmall")],parameters:{viewport:{options:m}},render:()=>e.jsx(n,{label:"Add a regression scenario for the gateway"})},i={decorators:[l("mobile")],parameters:{viewport:{options:m}},render:()=>e.jsxs("div",{style:{minHeight:"100vh",...b},children:[e.jsx(n,{label:"Add scenario"}),e.jsxs(d,{"aria-label":"Main navigation",children:[e.jsx(c,{icon:"task_alt",activeIcon:"check_circle",label:"Tasks",href:"#tasks",orientation:"vertical"}),e.jsx(c,{icon:"confirmation_number",activeIcon:"confirmation_number_filled",label:"Tickets",href:"#tickets",orientation:"vertical",active:!0})]})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'auto_awesome',
    'aria-label': 'Generate with AI'
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Fab label="Add scenario" />
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'Extended (label longer than the viewport)',
  decorators: [withDefaultViewport('mobileSmall')],
  parameters: {
    viewport: {
      options: mobileViewportOptions
    }
  },
  render: () => <Fab label="Add a regression scenario for the gateway" />
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions
    }
  },
  render: () => <div style={{
    minHeight: '100vh',
    ...fabOffsetOverride
  }}>
      <Fab label="Add scenario" />
      <BottomTabBar aria-label="Main navigation">
        <NavItem icon="task_alt" activeIcon="check_circle" label="Tasks" href="#tasks" orientation="vertical" />
        <NavItem icon="confirmation_number" activeIcon="confirmation_number_filled" label="Tickets" href="#tickets" orientation="vertical" active />
      </BottomTabBar>
    </div>
}`,...i.parameters?.docs?.source}}};const E=["Default","CustomIcon","Disabled","Extended","ExtendedLongLabel","ExtendedAboveTabBar"];export{r as CustomIcon,a as Default,o as Disabled,t as Extended,i as ExtendedAboveTabBar,s as ExtendedLongLabel,E as __namedExportsOrder,A as default};
