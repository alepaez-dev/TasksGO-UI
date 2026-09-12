import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as f}from"./iframe-CVQLCFtR.js";import{F as _}from"./FilePreviewOverlay-B3dmbOFf.js";import{a as E}from"./decorators-C-wm0NfJ.js";import{S as w,T as C,C as F,a as L,E as O,s as j}from"./evidenceFixtures-CClYs46t.js";import"./preload-helper-BEn3p7r2.js";import"./cn-2dOUpm6k.js";import"./sanitizeHref-Bnrf33AA.js";import"./useFocusTrap-Dg2fVimu.js";import"./index-B8aZUNnZ.js";import"./index-CAJC9r7y.js";import"./Icon-Dq1xHy1M.js";import"./Markdown-BQy1kkPP.js";import"./linkRenderRule-DGGM4XK8.js";import"./Card-CyndupYn.js";import"./IconButton-D-3zJHJe.js";const b=j("#4c5560","screen_01.jpg"),M=new URL("/TasksGO-UI/pr-preview/pr-273/assets/cleo-CIqdn7sI.jpg",import.meta.url).href,r=[{label:"socket_log.png",kind:"image",url:w},{label:"thread_dump.txt",kind:"file",text:C},{label:"screen_01.jpg",kind:"image",url:b},{label:"cache_metrics.json",kind:"file",text:F},{label:"notes.md",kind:"file",text:L},{label:"trace.zip",kind:"file",url:O}],J={title:"Components/FilePreviewOverlay",component:_,parameters:{layout:"fullscreen"},argTypes:{files:{control:!1},activeIndex:{control:!1}}};function o({files:m,initialIndex:I=0}){const[S,x]=f.useState(!0),[g,v]=f.useState(I);return e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",onClick:()=>x(!0),children:"Open preview"}),e.jsx(_,{files:m,open:S,activeIndex:g,onActiveIndexChange:v,onClose:()=>x(!1)})]})}const s=(m,I)=>m.findIndex(S=>S.label===I),t={render:()=>e.jsx(o,{files:r})},n={render:()=>e.jsx(o,{files:r,initialIndex:s(r,"cache_metrics.json")})},i={render:()=>e.jsx(o,{files:r,initialIndex:s(r,"notes.md")})},a={render:()=>e.jsx(o,{files:r,initialIndex:s(r,"thread_dump.txt")})},l={render:()=>e.jsx(o,{files:r,initialIndex:s(r,"trace.zip")})},c={render:()=>e.jsx(o,{files:[r[0]]})},u=[{label:"cleo.jpg",kind:"image",url:M},...r],d={...E,render:()=>e.jsx(o,{files:u})},p={...E,name:"Mobile (no inline preview)",render:()=>e.jsx(o,{files:u,initialIndex:s(u,"trace.zip")})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled files={SIX_FILES} />
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled files={SIX_FILES} initialIndex={indexOf(SIX_FILES, 'cache_metrics.json')} />
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled files={SIX_FILES} initialIndex={indexOf(SIX_FILES, 'notes.md')} />
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled files={SIX_FILES} initialIndex={indexOf(SIX_FILES, 'thread_dump.txt')} />
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled files={SIX_FILES} initialIndex={indexOf(SIX_FILES, 'trace.zip')} />
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled files={[SIX_FILES[0]]} />
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  ...mobileViewportStory,
  render: () => <Controlled files={MOBILE_FILES} />
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  ...mobileViewportStory,
  name: 'Mobile (no inline preview)',
  render: () => <Controlled files={MOBILE_FILES} initialIndex={indexOf(MOBILE_FILES, 'trace.zip')} />
}`,...p.parameters?.docs?.source}}};const q=["Default","JsonPreview","MarkdownPreview","TextPreview","NoPreview","SingleFile","Mobile","MobileNoPreview"];export{t as Default,n as JsonPreview,i as MarkdownPreview,d as Mobile,p as MobileNoPreview,l as NoPreview,c as SingleFile,a as TextPreview,q as __namedExportsOrder,J as default};
