import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-CuSp1vkS.js";import{P as m}from"./Popover-Cy-Jlhml.js";import{B as u}from"./Button-C-_hRtv3.js";import"./preload-helper-Dxt2lseD.js";import"./index-DcsLLRk3.js";import"./index-DbtF9T6m.js";import"./cn-2dOUpm6k.js";const E={title:"Components/Popover",component:m,tags:["autodocs"],parameters:{docs:{description:{component:"A portal-rendered floating surface anchored to a consumer-provided ref. Non-modal — no backdrop, focus is moved into the popover on open and returned to the previously focused element on close. Dismissible via Escape or click outside (clicks on the anchor are ignored — the anchor handles its own toggling). Set `manageFocus={false}` for hover-triggered surfaces (e.g. a hover card) so the popover does not steal focus from whatever the user is interacting with."}}},decorators:[r=>e.jsx("div",{style:{padding:"64px"},children:e.jsx(r,{})})]};function l({placement:r}){const t=s.useRef(null),[o,g]=s.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(u,{ref:t,onClick:()=>g(h=>!h),children:"Toggle popover"}),e.jsx(m,{open:o,onOpenChange:g,anchorRef:t,placement:r,"aria-label":"Demo popover",children:e.jsx("div",{style:{padding:"var(--ds-space-scale-md)",minWidth:"240px"},children:e.jsx("p",{style:{margin:0},children:"Popover content goes here."})})})]})}function x(){const r=s.useRef(null);return e.jsxs(e.Fragment,{children:[e.jsx(u,{ref:r,children:"Anchor"}),e.jsx(m,{open:!0,onOpenChange:()=>{},anchorRef:r,placement:"bottom-start","aria-label":"Demo popover",children:e.jsx("div",{style:{padding:"var(--ds-space-scale-md)",minWidth:"240px"},children:e.jsx("p",{style:{margin:0},children:"Popover content goes here."})})})]})}function v(){const r=s.useRef(null),[t,o]=s.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(u,{ref:r,onMouseEnter:()=>o(!0),onMouseLeave:()=>o(!1),onFocus:()=>o(!0),onBlur:()=>o(!1),children:"Hover me"}),e.jsx(m,{open:t,onOpenChange:o,anchorRef:r,manageFocus:!1,"aria-label":"Hover card",children:e.jsx("div",{style:{padding:"var(--ds-space-scale-md)",minWidth:"240px"},children:e.jsx("p",{style:{margin:0},children:"This card appears on hover and does not steal focus."})})})]})}const n={render:()=>e.jsx(x,{})},a={render:()=>e.jsx(l,{placement:"bottom-start"})},c={render:()=>e.jsx(v,{})},p={render:()=>e.jsx(l,{placement:"bottom-end"})},d={render:()=>e.jsx("div",{style:{marginTop:"300px"},children:e.jsx(l,{placement:"top-start"})})},i={render:()=>e.jsx("div",{style:{marginTop:"300px"},children:e.jsx(l,{placement:"top-end"})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <OpenRender />
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <BasicTrigger placement="bottom-start" />
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <HoverTrigger />
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <BasicTrigger placement="bottom-end" />
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    marginTop: '300px'
  }}>
      <BasicTrigger placement="top-start" />
    </div>
}`,...d.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    marginTop: '300px'
  }}>
      <BasicTrigger placement="top-end" />
    </div>
}`,...i.parameters?.docs?.source}}};const R=["Open","BottomStart","WithoutFocusManagement","BottomEnd","TopStart","TopEnd"];export{p as BottomEnd,a as BottomStart,n as Open,i as TopEnd,d as TopStart,c as WithoutFocusManagement,R as __namedExportsOrder,E as default};
