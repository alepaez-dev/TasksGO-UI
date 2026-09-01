import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as l}from"./iframe-_lxa1Zd7.js";import{A as u}from"./AddScenarioDialog-DrsqJdXg.js";import"./preload-helper-B5V5mqQ5.js";import"./cn-2dOUpm6k.js";import"./DialogField-BxfhRSC-.js";import"./useFocusTrap-z0Tv1lST.js";import"./index-37GuzcPt.js";import"./index-8WbSi66k.js";import"./Button-BNBHcTMV.js";import"./Icon-C7-Kx10B.js";import"./EvidenceInput-CU9Wf-0A.js";import"./useAutoGrowTextarea-CDmc4bDI.js";import"./RefLabel-CA63kPbo.js";const j="_notice_1pwjl_1",D={notice:j},M={title:"Components/AddScenarioDialog",component:u,parameters:{layout:"centered"},argTypes:{value:{control:!1},open:{control:"boolean"}}},b={name:"",status:"pending",description:"",expected:"",actual:"",steps:[],evidence:[]},d={name:"Verify cache hit on /v1/assets",status:"failed",description:"Edge cache should serve a warm asset on the second request.",expected:"Response carries X-Cache: HIT within 200ms.",actual:"",steps:[],evidence:[]},v=/\.(dmg|exe|msi|bat|sh|pkg)$/i;function t({initial:c=b,isEvidenceAllowed:C}){const[E,i]=l.useState(!0),[x,f]=l.useState(c),[m,h]=l.useState("");return e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",onClick:()=>i(!0),children:"Add scenario"}),e.jsx(u,{open:E,value:x,onValueChange:f,onCancel:()=>i(!1),onConfirm:()=>i(!1),isEvidenceAllowed:C,onEvidenceRejected:(p,S)=>h(S==="limit"?`${p.length} file(s) over the limit were not added.`:`Not an allowed file type: ${p.map(g=>g.name).join(", ")}`)}),m&&e.jsx("p",{role:"status",className:D.notice,children:m})]})}const s={render:()=>e.jsx(t,{})},r={render:()=>e.jsx(t,{initial:{...d,status:"passed"}})},o={render:()=>e.jsx(t,{initial:d})},a={render:()=>e.jsx(t,{initial:{...d,actual:"Response carried X-Cache: MISS twice."}})},n={name:"Consumer blocks executables",render:()=>e.jsx(t,{isEvidenceAllowed:c=>!v.test(c.name)})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled />
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={{
    ...FILLED,
    status: 'passed'
  }} />
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={FILLED} />
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={{
    ...FILLED,
    actual: 'Response carried X-Cache: MISS twice.'
  }} />
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: 'Consumer blocks executables',
  render: () => <Controlled isEvidenceAllowed={file => !BLOCKED_EVIDENCE.test(file.name)} />
}`,...n.parameters?.docs?.source}}};const P=["Default","Passed","FailedNeedsActualResult","ReadyToSubmit","ConsumerBlocksExecutables"];export{n as ConsumerBlocksExecutables,s as Default,o as FailedNeedsActualResult,r as Passed,a as ReadyToSubmit,P as __namedExportsOrder,M as default};
