import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-Bbm9UjVg.js";import{A as j}from"./AddScenarioDialog-BBXEmYmH.js";import{m as _}from"./decorators-Do3InoCe.js";import{b as N}from"./evidenceFixtures-CClYs46t.js";import{F as O}from"./FilePreviewOverlay-Cyokl9O6.js";import"./preload-helper-DWcvUR6w.js";import"./cn-2dOUpm6k.js";import"./DialogField-B12_oSGm.js";import"./useFocusTrap-PqX7_pTk.js";import"./index-DVnM1Fo8.js";import"./index-DTprLFxH.js";import"./Button-CfKBzdMi.js";import"./BottomSheet-CwPCmFbX.js";import"./IconButton-BVSict4k.js";import"./Icon-CjIrRL4u.js";import"./EvidenceInput-YrqzanRC.js";import"./useAutoGrowTextarea-BNIBUqEu.js";import"./RefLabel-B_Hg8jOn.js";import"./sanitizeHref-Bnrf33AA.js";import"./Markdown-Ce7_VaNI.js";import"./linkRenderRule-DbiZfcB1.js";import"./Card-CErw2DkW.js";const T="_notice_1depy_1",P={notice:T},ce={title:"Components/AddScenarioDialog",component:j,parameters:{layout:"centered"},argTypes:{value:{control:!1},open:{control:"boolean"}}},L={name:"",status:"pending",description:"",expected:"",actual:"",steps:[],evidence:[]},E={name:"Verify cache hit on /v1/assets",status:"failed",description:"Edge cache should serve a warm asset on the second request.",expected:"Response carries X-Cache: HIT within 200ms.",actual:"",steps:[],evidence:[]},B=/\.(dmg|exe|msi|bat|sh|pkg)$/i;function n({initial:h=L,isEvidenceAllowed:y,addEvidenceDisabled:I,presentation:w}){const[R,g]=o.useState(!0),[v,F]=o.useState(h),[C,x]=o.useState(""),S=()=>{x(""),g(!1)},[b,f]=o.useState(null),[A,k]=o.useState([]);return o.useEffect(()=>{let s=!1;const a=[];return Promise.all(v.evidence.map(async e=>{const r=URL.createObjectURL(e);a.push(r);const D={label:e.name,kind:e.type.startsWith("image/")?"image":"file",url:r};return e.type.startsWith("text/")||N.test(e.name)?{...D,text:await e.text()}:D})).then(e=>{s||k(e)}),()=>{s=!0,a.forEach(e=>URL.revokeObjectURL(e))}},[v.evidence]),t.jsxs(t.Fragment,{children:[t.jsx("button",{type:"button",onClick:()=>g(!0),children:"Add scenario"}),t.jsx(j,{open:R,presentation:w,value:v,onValueChange:s=>{x(""),F(s)},onCancel:S,onConfirm:S,isEvidenceAllowed:y,addEvidenceDisabled:I,onOpenEvidence:f,onEvidenceRejected:s=>{const a=s.filter(r=>r.reason==="filtered").map(r=>r.file.name),e=s.filter(r=>r.reason==="limit").length;x([a.length?`Not an allowed file type: ${a.join(", ")}`:"",e?`${e} file(s) over the limit were not added.`:""].filter(Boolean).join(" · "))},evidenceMessage:C?t.jsx("p",{role:"status",className:P.notice,children:C}):null}),t.jsx(O,{files:A,open:b!=null,activeIndex:b??0,onActiveIndexChange:f,onClose:()=>f(null)})]})}const i={render:()=>t.jsx(n,{})},c={render:()=>t.jsx(n,{initial:{...E,status:"passed"}})},d={render:()=>t.jsx(n,{initial:E})},l={render:()=>t.jsx(n,{initial:{...E,actual:"Response carried X-Cache: MISS twice."}})},m={..._,render:()=>t.jsx(n,{presentation:"sheet",initial:E})},p={name:"Consumer blocks executables",render:()=>t.jsx(n,{isEvidenceAllowed:h=>!B.test(h.name)})},u={name:"Evidence add disabled (upload in flight)",render:()=>t.jsx(n,{addEvidenceDisabled:!0,initial:{...L,evidence:[new File(["x"],"screenshot.png",{type:"image/png"})]}})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
  ...mobileSheetStory,
  render: () => <Controlled presentation="sheet" initial={FILLED} />
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Consumer blocks executables',
  render: () => <Controlled isEvidenceAllowed={file => !BLOCKED_EVIDENCE.test(file.name)} />
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'Evidence add disabled (upload in flight)',
  render: () => <Controlled addEvidenceDisabled initial={{
    ...EMPTY,
    evidence: [new File(['x'], 'screenshot.png', {
      type: 'image/png'
    })]
  }} />
}`,...u.parameters?.docs?.source}}};const de=["Default","Passed","FailedNeedsActualResult","ReadyToSubmit","Sheet","ConsumerBlocksExecutables","EvidenceAddDisabled"];export{p as ConsumerBlocksExecutables,i as Default,u as EvidenceAddDisabled,d as FailedNeedsActualResult,c as Passed,l as ReadyToSubmit,m as Sheet,de as __namedExportsOrder,ce as default};
