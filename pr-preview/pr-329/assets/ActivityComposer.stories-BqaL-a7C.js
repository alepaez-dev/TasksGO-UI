import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r}from"./iframe-C5rbSSai.js";import{A as k}from"./ActivityComposer-ChvV5Aiy.js";import{u as T}from"./useMarkdownEditor-BHNa8ben.js";import{J as W}from"./testFixtures-Ce977Qq0.js";import"./preload-helper-CEvo-PNf.js";import"./cn-2dOUpm6k.js";import"./Avatar-C4ovvF0V.js";import"./Icon-ZdIs2WEz.js";import"./FileChip-zU_v2vtT.js";import"./resolvePreview-DWjeOZcP.js";import"./RefLabel-e2q9cKG1.js";import"./applyMarkdownAction-Cu3QA8hU.js";import"./rovingIndex-BLt4otwy.js";import"./IconButton-CRdrzgL8.js";import"./Button-hxJNU-Nh.js";const a=({initialValue:y="",initialMode:S="comment",withAttach:A=!1,submitting:w=!1,uploadingDemo:h=!1})=>{const[l,u]=r.useState(y),[g,x]=r.useState(S),[f,v]=r.useState([]),[j,b]=r.useState(h?[{id:"u1",name:"k6-p95-latency.png",kind:"image"},{id:"u2",name:"k6-staging-run-0412.csv",kind:"file",uploadFraction:.64}]:[]),{textareaRef:C,applyAction:V}=T({value:l,setValue:u});return t.jsxs("div",{style:{maxWidth:720,display:"grid",gap:16},children:[t.jsx(k,{actor:W,mode:g,value:l,textareaRef:C,onModeChange:x,onChange:u,onAction:V,attachments:j,onAttach:A||h?e=>b(s=>[...s,...e.map(o=>({id:`${o.name}-${s.length}`,name:o.name,kind:o.type.startsWith("image/")?"image":"file"}))]):void 0,onRemoveAttachment:e=>b(s=>s.filter(o=>o.id!==e)),submitting:w,onSubmit:()=>{v(e=>[...e,`${g}: ${l}`]),u("")}}),f.length>0&&t.jsx("ul",{style:{margin:0,paddingLeft:18,fontSize:13,opacity:.7},children:f.map(e=>t.jsx("li",{children:e},e))})]})},G={title:"Components/ActivityComposer",component:k,parameters:{layout:"padded",docs:{description:{component:"The box at the foot of the activity feed for posting a comment or an ask. Stateless and fully controlled — the draft, the mode and the submitting flag belong to the caller, which supplies `textareaRef` and `onAction` from the `useMarkdownEditor` hook (as these stories do). The mode switch is a radio group, so arrow keys move and select. Submitting is blocked while the draft is blank, by the button and by ⌘↵ alike. Pass `onAttach` to offer the attach button."}}}},i={render:()=>t.jsx(a,{}),parameters:{docs:{description:{story:"Type to enable the submit button; the toolbar and ⌘↵ work. Posting clears the draft and lists what was sent."}}}},n={render:()=>t.jsx(a,{initialValue:"Looking into the **edge-caching** strategy now."})},d={render:()=>t.jsx(a,{initialMode:"ask",initialValue:"What TTL are we defaulting to for `/v1/assets`?"}),parameters:{docs:{description:{story:"Ask tints the active tab and the submit button, and the button reads Ask."}}}},c={render:()=>t.jsx(a,{initialValue:"See the trace attached.",withAttach:!0})},m={render:()=>t.jsx(a,{initialValue:"Posting this one…",submitting:!0}),parameters:{docs:{description:{story:"While submitting, both the button and ⌘↵ are blocked."}}}},p={render:()=>t.jsx(a,{initialValue:"Trace attached.",uploadingDemo:!0}),parameters:{docs:{description:{story:"A file still uploading dims, shows its percentage and draws a progress bar."}}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <StatefulComposer />,
  parameters: {
    docs: {
      description: {
        story: 'Type to enable the submit button; the toolbar and ⌘↵ work. Posting clears the draft and lists what was sent.'
      }
    }
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <StatefulComposer initialValue="Looking into the **edge-caching** strategy now." />
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <StatefulComposer initialMode="ask" initialValue="What TTL are we defaulting to for \`/v1/assets\`?" />,
  parameters: {
    docs: {
      description: {
        story: 'Ask tints the active tab and the submit button, and the button reads Ask.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <StatefulComposer initialValue="See the trace attached." withAttach />
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <StatefulComposer initialValue="Posting this one…" submitting />,
  parameters: {
    docs: {
      description: {
        story: 'While submitting, both the button and ⌘↵ are blocked.'
      }
    }
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <StatefulComposer initialValue="Trace attached." uploadingDemo />,
  parameters: {
    docs: {
      description: {
        story: 'A file still uploading dims, shows its percentage and draws a progress bar.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};const H=["Default","WithDraft","AskMode","WithAttach","Submitting","Uploading"];export{d as AskMode,i as Default,m as Submitting,p as Uploading,c as WithAttach,n as WithDraft,H as __namedExportsOrder,G as default};
