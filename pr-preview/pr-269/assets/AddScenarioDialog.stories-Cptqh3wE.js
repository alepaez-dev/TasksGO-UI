import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as n}from"./iframe-CZjjeKgd.js";import{A as D}from"./AddScenarioDialog-B4S9DX_J.js";import{b as F}from"./evidenceFixtures-CClYs46t.js";import{F as k}from"./FilePreviewOverlay-DWzu8aLa.js";import"./preload-helper-Uk6j4fFO.js";import"./cn-2dOUpm6k.js";import"./DialogField-BBpr1dXl.js";import"./useFocusTrap-AsM1FItT.js";import"./index-Cre1Gg44.js";import"./index-B2UqyJ4T.js";import"./Button-C7ZLdZu1.js";import"./Icon-DfE8wDSx.js";import"./EvidenceInput-Mfa6ZFdT.js";import"./useAutoGrowTextarea-r5LkETSW.js";import"./RefLabel-CYM5pJxu.js";import"./sanitizeHref-Bnrf33AA.js";import"./Markdown-BhejWZ2M.js";import"./linkRenderRule-D1a5IBNG.js";import"./Card-CxAsj249.js";import"./IconButton-CHlhqshC.js";const _="_notice_1depy_1",N={notice:_},re={title:"Components/AddScenarioDialog",component:D,parameters:{layout:"centered"},argTypes:{value:{control:!1},open:{control:"boolean"}}},j={name:"",status:"pending",description:"",expected:"",actual:"",steps:[],evidence:[]},f={name:"Verify cache hit on /v1/assets",status:"failed",description:"Edge cache should serve a warm asset on the second request.",expected:"Response carries X-Cache: HIT within 200ms.",actual:"",steps:[],evidence:[]},O=/\.(dmg|exe|msi|bat|sh|pkg)$/i;function a({initial:u=j,isEvidenceAllowed:L,addEvidenceDisabled:y}){const[I,g]=n.useState(!0),[E,w]=n.useState(u),[h,v]=n.useState(""),C=()=>{v(""),g(!1)},[b,x]=n.useState(null),[R,A]=n.useState([]);return n.useEffect(()=>{let r=!1;const o=[];return Promise.all(E.evidence.map(async e=>{const s=URL.createObjectURL(e);o.push(s);const S={label:e.name,kind:e.type.startsWith("image/")?"image":"file",url:s};return e.type.startsWith("text/")||F.test(e.name)?{...S,text:await e.text()}:S})).then(e=>{r||A(e)}),()=>{r=!0,o.forEach(e=>URL.revokeObjectURL(e))}},[E.evidence]),t.jsxs(t.Fragment,{children:[t.jsx("button",{type:"button",onClick:()=>g(!0),children:"Add scenario"}),t.jsx(D,{open:I,value:E,onValueChange:r=>{v(""),w(r)},onCancel:C,onConfirm:C,isEvidenceAllowed:L,addEvidenceDisabled:y,onOpenEvidence:x,onEvidenceRejected:r=>{const o=r.filter(s=>s.reason==="filtered").map(s=>s.file.name),e=r.filter(s=>s.reason==="limit").length;v([o.length?`Not an allowed file type: ${o.join(", ")}`:"",e?`${e} file(s) over the limit were not added.`:""].filter(Boolean).join(" · "))},evidenceMessage:h?t.jsx("p",{role:"status",className:N.notice,children:h}):null}),t.jsx(k,{files:R,open:b!=null,activeIndex:b??0,onActiveIndexChange:x,onClose:()=>x(null)})]})}const i={render:()=>t.jsx(a,{})},c={render:()=>t.jsx(a,{initial:{...f,status:"passed"}})},d={render:()=>t.jsx(a,{initial:f})},l={render:()=>t.jsx(a,{initial:{...f,actual:"Response carried X-Cache: MISS twice."}})},m={name:"Consumer blocks executables",render:()=>t.jsx(a,{isEvidenceAllowed:u=>!O.test(u.name)})},p={name:"Evidence add disabled (upload in flight)",render:()=>t.jsx(a,{addEvidenceDisabled:!0,initial:{...j,evidence:[new File(["x"],"screenshot.png",{type:"image/png"})]}})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
