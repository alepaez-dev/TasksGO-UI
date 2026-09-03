import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as p}from"./iframe-HOGjTxZs.js";import{A as h}from"./AddScenarioDialog-DWusglZ6.js";import"./preload-helper-B5V5mqQ5.js";import"./cn-2dOUpm6k.js";import"./DialogField-CDmLz9Db.js";import"./useFocusTrap-4hBVIrSp.js";import"./index-CuKq32YO.js";import"./index-Bftys0nD.js";import"./Button-GqW4S41n.js";import"./Icon-8qlOkAXk.js";import"./EvidenceInput-B7tNUr02.js";import"./useAutoGrowTextarea-Bmr58z4O.js";import"./RefLabel-CHv9mbBR.js";const L="_notice_1depy_1",w={notice:L},K={title:"Components/AddScenarioDialog",component:h,parameters:{layout:"centered"},argTypes:{value:{control:!1},open:{control:"boolean"}}},v={name:"",status:"pending",description:"",expected:"",actual:"",steps:[],evidence:[]},u={name:"Verify cache hit on /v1/assets",status:"failed",description:"Edge cache should serve a warm asset on the second request.",expected:"Response carries X-Cache: HIT within 200ms.",actual:"",steps:[],evidence:[]},A=/\.(dmg|exe|msi|bat|sh|pkg)$/i;function s({initial:l=v,isEvidenceAllowed:b,addEvidenceDisabled:D}){const[S,E]=p.useState(!0),[j,y]=p.useState(l),[g,m]=p.useState(""),f=()=>{m(""),E(!1)};return e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",onClick:()=>E(!0),children:"Add scenario"}),e.jsx(h,{open:S,value:j,onValueChange:r=>{m(""),y(r)},onCancel:f,onConfirm:f,isEvidenceAllowed:b,addEvidenceDisabled:D,onEvidenceRejected:r=>{const x=r.filter(t=>t.reason==="filtered").map(t=>t.file.name),C=r.filter(t=>t.reason==="limit").length;m([x.length?`Not an allowed file type: ${x.join(", ")}`:"",C?`${C} file(s) over the limit were not added.`:""].filter(Boolean).join(" · "))},evidenceMessage:g?e.jsx("p",{role:"status",className:w.notice,children:g}):null})]})}const n={render:()=>e.jsx(s,{})},a={render:()=>e.jsx(s,{initial:{...u,status:"passed"}})},o={render:()=>e.jsx(s,{initial:u})},i={render:()=>e.jsx(s,{initial:{...u,actual:"Response carried X-Cache: MISS twice."}})},c={name:"Consumer blocks executables",render:()=>e.jsx(s,{isEvidenceAllowed:l=>!A.test(l.name)})},d={name:"Evidence add disabled (upload in flight)",render:()=>e.jsx(s,{addEvidenceDisabled:!0,initial:{...v,evidence:[new File(["x"],"screenshot.png",{type:"image/png"})]}})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled />
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={{
    ...FILLED,
    status: 'passed'
  }} />
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={FILLED} />
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={{
    ...FILLED,
    actual: 'Response carried X-Cache: MISS twice.'
  }} />
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Consumer blocks executables',
  render: () => <Controlled isEvidenceAllowed={file => !BLOCKED_EVIDENCE.test(file.name)} />
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Evidence add disabled (upload in flight)',
  render: () => <Controlled addEvidenceDisabled initial={{
    ...EMPTY,
    evidence: [new File(['x'], 'screenshot.png', {
      type: 'image/png'
    })]
  }} />
}`,...d.parameters?.docs?.source}}};const Y=["Default","Passed","FailedNeedsActualResult","ReadyToSubmit","ConsumerBlocksExecutables","EvidenceAddDisabled"];export{c as ConsumerBlocksExecutables,n as Default,d as EvidenceAddDisabled,o as FailedNeedsActualResult,a as Passed,i as ReadyToSubmit,Y as __namedExportsOrder,K as default};
