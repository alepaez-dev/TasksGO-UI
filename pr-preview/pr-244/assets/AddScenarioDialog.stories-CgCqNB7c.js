import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as p}from"./iframe-Cf3fbqun.js";import{A as C}from"./AddScenarioDialog-DTxl3BK7.js";import"./preload-helper-B5V5mqQ5.js";import"./cn-2dOUpm6k.js";import"./DialogField-D-89V8ww.js";import"./useFocusTrap-BaPvMB3g.js";import"./index-CqECruNH.js";import"./index-BunEOL8X.js";import"./Button-BcJLKayb.js";import"./Icon-DNcyM14P.js";import"./EvidenceInput-BAOqpl2S.js";import"./useAutoGrowTextarea-B98qTJ-Y.js";import"./RefLabel-Cm55B5NU.js";const L="_notice_1qwnr_3",y={notice:L},q={title:"Components/AddScenarioDialog",component:C,parameters:{layout:"centered"},argTypes:{value:{control:!1},open:{control:"boolean"}}},h={name:"",status:"pending",description:"",expected:"",actual:"",steps:[],evidence:[]},u={name:"Verify cache hit on /v1/assets",status:"failed",description:"Edge cache should serve a warm asset on the second request.",expected:"Response carries X-Cache: HIT within 200ms.",actual:"",steps:[],evidence:[]},A=/\.(dmg|exe|msi|bat|sh|pkg)$/i;function s({initial:l=h,isEvidenceAllowed:v,addEvidenceDisabled:b}){const[D,E]=p.useState(!0),[S,j]=p.useState(l),[w,m]=p.useState(""),g=()=>{m(""),E(!1)};return e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",onClick:()=>E(!0),children:"Add scenario"}),e.jsx(C,{open:D,value:S,onValueChange:r=>{m(""),j(r)},onCancel:g,onConfirm:g,isEvidenceAllowed:v,addEvidenceDisabled:b,onEvidenceRejected:r=>{const f=r.filter(t=>t.reason==="filtered").map(t=>t.file.name),x=r.filter(t=>t.reason==="limit").length;m([f.length?`Not an allowed file type: ${f.join(", ")}`:"",x?`${x} file(s) over the limit were not added.`:""].filter(Boolean).join(" · "))},evidenceMessage:e.jsx("p",{role:"status",className:y.notice,children:w})})]})}const n={render:()=>e.jsx(s,{})},a={render:()=>e.jsx(s,{initial:{...u,status:"passed"}})},o={render:()=>e.jsx(s,{initial:u})},i={render:()=>e.jsx(s,{initial:{...u,actual:"Response carried X-Cache: MISS twice."}})},c={name:"Consumer blocks executables",render:()=>e.jsx(s,{isEvidenceAllowed:l=>!A.test(l.name)})},d={name:"Evidence add disabled (upload in flight)",render:()=>e.jsx(s,{addEvidenceDisabled:!0,initial:{...h,evidence:[new File(["x"],"screenshot.png",{type:"image/png"})]}})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};const K=["Default","Passed","FailedNeedsActualResult","ReadyToSubmit","ConsumerBlocksExecutables","EvidenceAddDisabled"];export{c as ConsumerBlocksExecutables,n as Default,d as EvidenceAddDisabled,o as FailedNeedsActualResult,a as Passed,i as ReadyToSubmit,K as __namedExportsOrder,q as default};
