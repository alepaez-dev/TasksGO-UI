import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as d}from"./iframe-BR3Q6SxB.js";import{P as m}from"./Popover-DBfGONdX.js";import{B as u}from"./Button-CKAB1m7a.js";import"./preload-helper-BGVEY7oZ.js";import"./index-DfBbw3kH.js";import"./index-eq-RPwXZ.js";import"./cn-2dOUpm6k.js";const E={title:"Components/Popover",component:m,tags:["autodocs"],parameters:{docs:{description:{component:"A portal-rendered floating surface anchored to a consumer-provided ref. Non-modal — no backdrop, focus is moved into the popover on open and returned to the previously focused element on close. Dismissible via Escape or click outside (clicks on the anchor are ignored — the anchor handles its own toggling). Set `manageFocus={false}` for hover-triggered surfaces (e.g. a hover card) so the popover does not steal focus from whatever the user is interacting with."}}},decorators:[o=>e.jsx("div",{style:{padding:"64px"},children:e.jsx(o,{})})]};function p({placement:o}){const s=d.useRef(null),[r,l]=d.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(u,{ref:s,onClick:()=>l(g=>!g),children:"Toggle popover"}),e.jsx(m,{open:r,onOpenChange:l,anchorRef:s,placement:o,children:e.jsx("div",{style:{padding:"var(--ds-space-scale-md)",minWidth:"240px"},children:e.jsx("p",{style:{margin:0},children:"Popover content goes here."})})})]})}function h(){const o=d.useRef(null),[s,r]=d.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(u,{ref:o,onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),onFocus:()=>r(!0),onBlur:()=>r(!1),children:"Hover me"}),e.jsx(m,{open:s,onOpenChange:r,anchorRef:o,manageFocus:!1,children:e.jsx("div",{style:{padding:"var(--ds-space-scale-md)",minWidth:"240px"},children:e.jsx("p",{style:{margin:0},children:"This card appears on hover and does not steal focus."})})})]})}const t={render:()=>e.jsx(p,{placement:"bottom-start"})},n={render:()=>e.jsx(h,{})},a={render:()=>e.jsx(p,{placement:"bottom-end"})},c={render:()=>e.jsx("div",{style:{marginTop:"300px"},children:e.jsx(p,{placement:"top-start"})})},i={render:()=>e.jsx("div",{style:{marginTop:"300px"},children:e.jsx(p,{placement:"top-end"})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <BasicTrigger placement="bottom-start" />
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <HoverTrigger />
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <BasicTrigger placement="bottom-end" />
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    marginTop: '300px'
  }}>
      <BasicTrigger placement="top-start" />
    </div>
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    marginTop: '300px'
  }}>
      <BasicTrigger placement="top-end" />
    </div>
}`,...i.parameters?.docs?.source}}};const F=["BottomStart","WithoutFocusManagement","BottomEnd","TopStart","TopEnd"];export{a as BottomEnd,t as BottomStart,i as TopEnd,c as TopStart,n as WithoutFocusManagement,F as __namedExportsOrder,E as default};
