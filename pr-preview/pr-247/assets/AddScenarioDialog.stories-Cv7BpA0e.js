import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as n}from"./iframe-CbukK6-P.js";import{A as S}from"./AddScenarioDialog-CWuR5T2_.js";import{b as F}from"./evidenceFixtures-CClYs46t.js";import{F as k}from"./FilePreviewOverlay-BXZ0e2TK.js";import"./preload-helper-DpPvC_OQ.js";import"./cn-2dOUpm6k.js";import"./DialogField-CFRfbaiI.js";import"./useFocusTrap-D4W36N5E.js";import"./index-BMaXpLL8.js";import"./index-B0puRBD8.js";import"./Button-CGv04l16.js";import"./Icon-DMvpdEI4.js";import"./EvidenceInput-BYu_Nrsi.js";import"./useAutoGrowTextarea-DyRzsV1O.js";import"./RefLabel-CHC6NK8i.js";import"./sanitizeHref-Bnrf33AA.js";import"./Markdown-BCoSB3vc.js";import"./linkRenderRule-BKhGDfEW.js";import"./Card-B7YRDifd.js";import"./IconButton-bF5xPlbO.js";const _="_notice_1qwnr_3",N={notice:_},re={title:"Components/AddScenarioDialog",component:S,parameters:{layout:"centered"},argTypes:{value:{control:!1},open:{control:"boolean"}}},D={name:"",status:"pending",description:"",expected:"",actual:"",steps:[],evidence:[]},f={name:"Verify cache hit on /v1/assets",status:"failed",description:"Edge cache should serve a warm asset on the second request.",expected:"Response carries X-Cache: HIT within 200ms.",actual:"",steps:[],evidence:[]},O=/\.(dmg|exe|msi|bat|sh|pkg)$/i;function a({initial:u=D,isEvidenceAllowed:j,addEvidenceDisabled:L}){const[w,g]=n.useState(!0),[E,I]=n.useState(u),[y,v]=n.useState(""),h=()=>{v(""),g(!1)},[C,x]=n.useState(null),[R,A]=n.useState([]);return n.useEffect(()=>{let r=!1;const o=[];return Promise.all(E.evidence.map(async e=>{const s=URL.createObjectURL(e);o.push(s);const b={label:e.name,kind:e.type.startsWith("image/")?"image":"file",url:s};return e.type.startsWith("text/")||F.test(e.name)?{...b,text:await e.text()}:b})).then(e=>{r||A(e)}),()=>{r=!0,o.forEach(e=>URL.revokeObjectURL(e))}},[E.evidence]),t.jsxs(t.Fragment,{children:[t.jsx("button",{type:"button",onClick:()=>g(!0),children:"Add scenario"}),t.jsx(S,{open:w,value:E,onValueChange:r=>{v(""),I(r)},onCancel:h,onConfirm:h,isEvidenceAllowed:j,addEvidenceDisabled:L,onOpenEvidence:x,onEvidenceRejected:r=>{const o=r.filter(s=>s.reason==="filtered").map(s=>s.file.name),e=r.filter(s=>s.reason==="limit").length;v([o.length?`Not an allowed file type: ${o.join(", ")}`:"",e?`${e} file(s) over the limit were not added.`:""].filter(Boolean).join(" · "))},evidenceMessage:t.jsx("p",{role:"status",className:N.notice,children:y})}),t.jsx(k,{files:R,open:C!=null,activeIndex:C??0,onActiveIndexChange:x,onClose:()=>x(null)})]})}const i={render:()=>t.jsx(a,{})},c={render:()=>t.jsx(a,{initial:{...f,status:"passed"}})},d={render:()=>t.jsx(a,{initial:f})},l={render:()=>t.jsx(a,{initial:{...f,actual:"Response carried X-Cache: MISS twice."}})},m={name:"Consumer blocks executables",render:()=>t.jsx(a,{isEvidenceAllowed:u=>!O.test(u.name)})},p={name:"Evidence add disabled (upload in flight)",render:()=>t.jsx(a,{addEvidenceDisabled:!0,initial:{...D,evidence:[new File(["x"],"screenshot.png",{type:"image/png"})]}})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Consumer blocks executables',
  render: () => <Controlled isEvidenceAllowed={file => !BLOCKED_EVIDENCE.test(file.name)} />
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Evidence add disabled (upload in flight)',
  render: () => <Controlled addEvidenceDisabled initial={{
    ...EMPTY,
    evidence: [new File(['x'], 'screenshot.png', {
      type: 'image/png'
    })]
  }} />
}`,...p.parameters?.docs?.source}}};const ne=["Default","Passed","FailedNeedsActualResult","ReadyToSubmit","ConsumerBlocksExecutables","EvidenceAddDisabled"];export{m as ConsumerBlocksExecutables,i as Default,p as EvidenceAddDisabled,d as FailedNeedsActualResult,c as Passed,l as ReadyToSubmit,ne as __namedExportsOrder,re as default};
