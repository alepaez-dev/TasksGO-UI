import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as p}from"./iframe-BDLYft51.js";import{A as x}from"./AddScenarioDialog-CN-JXozx.js";import"./preload-helper-B5V5mqQ5.js";import"./cn-2dOUpm6k.js";import"./DialogField-AohGckrh.js";import"./useFocusTrap-BlUjHsfb.js";import"./index-DaAZSyKk.js";import"./index-BLRc2chd.js";import"./Button-iAJK-983.js";import"./Icon-DraSJ1yp.js";import"./EvidenceInput-HvMTYfRV.js";import"./useAutoGrowTextarea-DY8YTIFW.js";import"./RefLabel-C6Zen2HV.js";const w="_notice_1pwjl_1",y={notice:w},$={title:"Components/AddScenarioDialog",component:x,parameters:{layout:"centered"},argTypes:{value:{control:!1},open:{control:"boolean"}}},C={name:"",status:"pending",description:"",expected:"",actual:"",steps:[],evidence:[]},m={name:"Verify cache hit on /v1/assets",status:"failed",description:"Edge cache should serve a warm asset on the second request.",expected:"Response carries X-Cache: HIT within 200ms.",actual:"",steps:[],evidence:[]},A=/\.(dmg|exe|msi|bat|sh|pkg)$/i;function s({initial:d=C,isEvidenceAllowed:h,addEvidenceDisabled:f}){const[b,u]=p.useState(!0),[v,D]=p.useState(d),[E,l]=p.useState(""),g=()=>{l(""),u(!1)};return e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",onClick:()=>u(!0),children:"Add scenario"}),e.jsx(x,{open:b,value:v,onValueChange:t=>{l(""),D(t)},onCancel:g,onConfirm:g,isEvidenceAllowed:h,addEvidenceDisabled:f,onEvidenceRejected:(t,S)=>l(S==="limit"?`${t.length} file(s) over the limit were not added.`:`Not an allowed file type: ${t.map(j=>j.name).join(", ")}`)}),E&&e.jsx("p",{role:"status",className:y.notice,children:E})]})}const r={render:()=>e.jsx(s,{})},a={render:()=>e.jsx(s,{initial:{...m,status:"passed"}})},n={render:()=>e.jsx(s,{initial:m})},o={render:()=>e.jsx(s,{initial:{...m,actual:"Response carried X-Cache: MISS twice."}})},i={name:"Consumer blocks executables",render:()=>e.jsx(s,{isEvidenceAllowed:d=>!A.test(d.name)})},c={name:"Evidence add disabled (upload in flight)",render:()=>e.jsx(s,{addEvidenceDisabled:!0,initial:{...C,evidence:[new File(["x"],"screenshot.png",{type:"image/png"})]}})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled />
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={{
    ...FILLED,
    status: 'passed'
  }} />
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={FILLED} />
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={{
    ...FILLED,
    actual: 'Response carried X-Cache: MISS twice.'
  }} />
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: 'Consumer blocks executables',
  render: () => <Controlled isEvidenceAllowed={file => !BLOCKED_EVIDENCE.test(file.name)} />
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Evidence add disabled (upload in flight)',
  render: () => <Controlled addEvidenceDisabled initial={{
    ...EMPTY,
    evidence: [new File(['x'], 'screenshot.png', {
      type: 'image/png'
    })]
  }} />
}`,...c.parameters?.docs?.source}}};const K=["Default","Passed","FailedNeedsActualResult","ReadyToSubmit","ConsumerBlocksExecutables","EvidenceAddDisabled"];export{i as ConsumerBlocksExecutables,r as Default,c as EvidenceAddDisabled,n as FailedNeedsActualResult,a as Passed,o as ReadyToSubmit,K as __namedExportsOrder,$ as default};
