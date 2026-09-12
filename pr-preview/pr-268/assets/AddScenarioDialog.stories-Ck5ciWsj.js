import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as n}from"./iframe-D_j3Dykb.js";import{A as D}from"./AddScenarioDialog-CoBiQaNc.js";import{m as N}from"./decorators-5vrv1V70.js";import{b as T}from"./evidenceFixtures-CClYs46t.js";import{F as B}from"./FilePreviewOverlay-BgCFBP6l.js";import"./preload-helper-DWcvUR6w.js";import"./cn-2dOUpm6k.js";import"./DialogField-CwgQXxKj.js";import"./useFocusTrap-DPlrSypw.js";import"./index-Bpp4rlE_.js";import"./index-CXS3EDu5.js";import"./Button-CoBZybGQ.js";import"./BottomSheet-DzZd4SwB.js";import"./IconButton-YwNBTspT.js";import"./Icon-BN2hdkXY.js";import"./EvidenceInput-BoryDFF_.js";import"./useAutoGrowTextarea-BxqkjV5k.js";import"./RefLabel-CoL3b73o.js";import"./sanitizeHref-Bnrf33AA.js";import"./Markdown-CoUXb1Nl.js";import"./linkRenderRule-CgGGCNrf.js";import"./Card-3C74hIWu.js";const M="_notice_1qwnr_3",V={notice:M},me={title:"Components/AddScenarioDialog",component:D,parameters:{layout:"centered"},argTypes:{value:{control:!1},open:{control:"boolean"}}},j={name:"",status:"pending",description:"",expected:"",actual:"",steps:[],evidence:[]},E={name:"Verify cache hit on /v1/assets",status:"failed",description:"Edge cache should serve a warm asset on the second request.",expected:"Response carries X-Cache: HIT within 200ms.",actual:"",steps:[],evidence:[]},U=/\.(dmg|exe|msi|bat|sh|pkg)$/i;function o({initial:v=j,isEvidenceAllowed:w,addEvidenceDisabled:L,presentation:y}){const[I,x]=n.useState(!0),[f,R]=n.useState(v),[F,h]=n.useState(""),g=()=>{h(""),x(!1)},[A,C]=n.useState(0),[O,S]=n.useState(!1),k=s=>{C(s),S(!0)},[P,_]=n.useState([]);return n.useEffect(()=>{let s=!1;const a=[];return Promise.all(f.evidence.map(async e=>{const r=URL.createObjectURL(e);a.push(r);const b={label:e.name,kind:e.type.startsWith("image/")?"image":"file",url:r};return e.type.startsWith("text/")||T.test(e.name)?{...b,text:await e.text()}:b})).then(e=>{s||_(e)}),()=>{s=!0,a.forEach(e=>URL.revokeObjectURL(e))}},[f.evidence]),t.jsxs(t.Fragment,{children:[t.jsx("button",{type:"button",onClick:()=>x(!0),children:"Add scenario"}),t.jsx(D,{open:I,presentation:y,value:f,onValueChange:s=>{h(""),R(s)},onCancel:g,onConfirm:g,isEvidenceAllowed:w,addEvidenceDisabled:L,onOpenEvidence:k,onEvidenceRejected:s=>{const a=s.filter(r=>r.reason==="filtered").map(r=>r.file.name),e=s.filter(r=>r.reason==="limit").length;h([a.length?`Not an allowed file type: ${a.join(", ")}`:"",e?`${e} file(s) over the limit were not added.`:""].filter(Boolean).join(" · "))},evidenceMessage:t.jsx("p",{role:"status",className:V.notice,children:F})}),t.jsx(B,{files:P,open:O,activeIndex:A,onActiveIndexChange:C,onClose:()=>S(!1)})]})}const i={render:()=>t.jsx(o,{})},c={render:()=>t.jsx(o,{initial:{...E,status:"passed"}})},d={render:()=>t.jsx(o,{initial:E})},l={render:()=>t.jsx(o,{initial:{...E,actual:"Response carried X-Cache: MISS twice."}})},m={...N,render:()=>t.jsx(o,{presentation:"sheet",initial:E})},p={name:"Consumer blocks executables",render:()=>t.jsx(o,{isEvidenceAllowed:v=>!U.test(v.name)})},u={name:"Evidence add disabled (upload in flight)",render:()=>t.jsx(o,{addEvidenceDisabled:!0,initial:{...j,evidence:[new File(["x"],"screenshot.png",{type:"image/png"})]}})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};const pe=["Default","Passed","FailedNeedsActualResult","ReadyToSubmit","Sheet","ConsumerBlocksExecutables","EvidenceAddDisabled"];export{p as ConsumerBlocksExecutables,i as Default,u as EvidenceAddDisabled,d as FailedNeedsActualResult,c as Passed,l as ReadyToSubmit,m as Sheet,pe as __namedExportsOrder,me as default};
