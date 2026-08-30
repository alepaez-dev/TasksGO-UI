import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as i}from"./iframe-XQFivrMG.js";import{A as d}from"./AddScenarioDialog-0Et1-SnS.js";import"./preload-helper-C-SvPj63.js";import"./cn-2dOUpm6k.js";import"./DialogField-BNIAxLBq.js";import"./useFocusTrap-r8NaYRMN.js";import"./index-BJkhXbig.js";import"./index-apUoi2eK.js";import"./Button-BvTFXoZJ.js";import"./Icon-C1Fa8sFl.js";const I={title:"Components/AddScenarioDialog",component:d,parameters:{layout:"centered"},argTypes:{value:{control:!1},open:{control:"boolean"}}},f={name:"",status:"pending",description:"",expected:"",actual:""},c={name:"Verify cache hit on /v1/assets",status:"failed",description:"Edge cache should serve a warm asset on the second request.",expected:"Response carries X-Cache: HIT within 200ms.",actual:""};function o({initial:l=f}){const[p,n]=i.useState(!0),[m,u]=i.useState(l);return e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",onClick:()=>n(!0),children:"Add scenario"}),e.jsx(d,{open:p,value:m,onValueChange:u,onCancel:()=>n(!1),onConfirm:()=>n(!1)})]})}const r={render:()=>e.jsx(o,{})},t={render:()=>e.jsx(o,{initial:{...c,status:"passed"}})},a={render:()=>e.jsx(o,{initial:c})},s={render:()=>e.jsx(o,{initial:{...c,actual:"Response carried X-Cache: MISS twice."}})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled />
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={{
    ...FILLED,
    status: 'passed'
  }} />
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={FILLED} />
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={{
    ...FILLED,
    actual: 'Response carried X-Cache: MISS twice.'
  }} />
}`,...s.parameters?.docs?.source}}};const y=["Default","Passed","FailedNeedsActualResult","ReadyToSubmit"];export{r as Default,a as FailedNeedsActualResult,t as Passed,s as ReadyToSubmit,y as __namedExportsOrder,I as default};
