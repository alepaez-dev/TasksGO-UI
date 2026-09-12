import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as n}from"./iframe-pJpzkwoj.js";import{A as S}from"./AddScenarioDialog-CQXykVZx.js";import{b as P}from"./evidenceFixtures-CClYs46t.js";import{F as _}from"./FilePreviewOverlay-CjRbgo2A.js";import"./preload-helper-DpPvC_OQ.js";import"./cn-2dOUpm6k.js";import"./DialogField-Ctj3M2dt.js";import"./useFocusTrap-rA2gK8cX.js";import"./index-BNEXGkYN.js";import"./index-DkmTyHDZ.js";import"./Button-i2drwr-y.js";import"./Icon-BQjyHgwb.js";import"./EvidenceInput-CKMvtgEX.js";import"./useAutoGrowTextarea-CTRGyxfp.js";import"./RefLabel-B-SESsL-.js";import"./sanitizeHref-Bnrf33AA.js";import"./Markdown-D_AqjBXT.js";import"./linkRenderRule-CWPkPMw8.js";import"./Card-D3kMolc9.js";import"./IconButton-CfW91HrV.js";const N="_notice_1qwnr_3",T={notice:N},oe={title:"Components/AddScenarioDialog",component:S,parameters:{layout:"centered"},argTypes:{value:{control:!1},open:{control:"boolean"}}},w={name:"",status:"pending",description:"",expected:"",actual:"",steps:[],evidence:[]},f={name:"Verify cache hit on /v1/assets",status:"failed",description:"Edge cache should serve a warm asset on the second request.",expected:"Response carries X-Cache: HIT within 200ms.",actual:"",steps:[],evidence:[]},B=/\.(dmg|exe|msi|bat|sh|pkg)$/i;function a({initial:u=w,isEvidenceAllowed:D,addEvidenceDisabled:j}){const[L,x]=n.useState(!0),[E,I]=n.useState(u),[y,v]=n.useState(""),g=()=>{v(""),x(!1)},[R,h]=n.useState(0),[A,C]=n.useState(!1),F=s=>{h(s),C(!0)},[O,k]=n.useState([]);return n.useEffect(()=>{let s=!1;const o=[];return Promise.all(E.evidence.map(async e=>{const r=URL.createObjectURL(e);o.push(r);const b={label:e.name,kind:e.type.startsWith("image/")?"image":"file",url:r};return e.type.startsWith("text/")||P.test(e.name)?{...b,text:await e.text()}:b})).then(e=>{s||k(e)}),()=>{s=!0,o.forEach(e=>URL.revokeObjectURL(e))}},[E.evidence]),t.jsxs(t.Fragment,{children:[t.jsx("button",{type:"button",onClick:()=>x(!0),children:"Add scenario"}),t.jsx(S,{open:L,value:E,onValueChange:s=>{v(""),I(s)},onCancel:g,onConfirm:g,isEvidenceAllowed:D,addEvidenceDisabled:j,onOpenEvidence:F,onEvidenceRejected:s=>{const o=s.filter(r=>r.reason==="filtered").map(r=>r.file.name),e=s.filter(r=>r.reason==="limit").length;v([o.length?`Not an allowed file type: ${o.join(", ")}`:"",e?`${e} file(s) over the limit were not added.`:""].filter(Boolean).join(" · "))},evidenceMessage:t.jsx("p",{role:"status",className:T.notice,children:y})}),t.jsx(_,{files:O,open:A,activeIndex:R,onActiveIndexChange:h,onClose:()=>C(!1)})]})}const i={render:()=>t.jsx(a,{})},c={render:()=>t.jsx(a,{initial:{...f,status:"passed"}})},d={render:()=>t.jsx(a,{initial:f})},l={render:()=>t.jsx(a,{initial:{...f,actual:"Response carried X-Cache: MISS twice."}})},p={name:"Consumer blocks executables",render:()=>t.jsx(a,{isEvidenceAllowed:u=>!B.test(u.name)})},m={name:"Evidence add disabled (upload in flight)",render:()=>t.jsx(a,{addEvidenceDisabled:!0,initial:{...w,evidence:[new File(["x"],"screenshot.png",{type:"image/png"})]}})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled />
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={{
    ...FILLED,
    status: 'passed'
  }} />
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={FILLED} />
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Controlled initial={{
    ...FILLED,
    actual: 'Response carried X-Cache: MISS twice.'
  }} />
}`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Consumer blocks executables',
  render: () => <Controlled isEvidenceAllowed={file => !BLOCKED_EVIDENCE.test(file.name)} />
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Evidence add disabled (upload in flight)',
  render: () => <Controlled addEvidenceDisabled initial={{
    ...EMPTY,
    evidence: [new File(['x'], 'screenshot.png', {
      type: 'image/png'
    })]
  }} />
}`,...m.parameters?.docs?.source}}};const ie=["Default","Passed","FailedNeedsActualResult","ReadyToSubmit","ConsumerBlocksExecutables","EvidenceAddDisabled"];export{p as ConsumerBlocksExecutables,i as Default,m as EvidenceAddDisabled,d as FailedNeedsActualResult,c as Passed,l as ReadyToSubmit,ie as __namedExportsOrder,oe as default};
