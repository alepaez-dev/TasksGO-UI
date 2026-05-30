import{j as i}from"./jsx-runtime-u17CrQMm.js";import{r as l}from"./iframe-CFVd6xWV.js";import{P as h,t as x}from"./toStageValue-51YOcs-n.js";import"./preload-helper-LDNDuAwT.js";import"./cn-2dOUpm6k.js";import"./Icon-DPH3oEkJ.js";import"./StatusDot-BoHfy9bo.js";const T={title:"Components/PipelineHierarchyPanel",component:h,tags:["autodocs"],parameters:{docs:{description:{component:"A bordered panel listing pipeline stages with per-stage status dots, an optional active highlight, and an optional add-stage footer. When `onReorder` is provided, each row gets a drag handle for mouse drag-and-drop reorder and supports keyboard reorder via `Alt+ArrowUp` / `Alt+ArrowDown` on the focused drag handle. Touch reorder is not yet supported."}}},decorators:[o=>i.jsx("div",{style:{padding:"24px",maxWidth:"320px"},children:i.jsx(o,{})})]},y=[{value:"qa1",label:"QA1",status:"success"},{value:"qa2",label:"QA2",status:"in-progress"},{value:"staging",label:"Staging",status:"idle"},{value:"prod",label:"Prod",status:"idle"}];function v(o,r){const a=o.trim();if(a.length===0)return;const m=x(a),d=r.find(t=>t.value===m||t.label.toLowerCase()===a.toLowerCase());if(d)return{kind:"error",text:`"${d.label}" already exists`};const s=a.toLowerCase(),n=r.filter(t=>{const e=t.label.toLowerCase();return s.length>=2&&(e.startsWith(s)||s.startsWith(e))});if(n.length>0)return{kind:"warning",text:`Similar to ${n.map(e=>`"${e.label}"`).join(" and ")} — still confirm?`}}function w({initial:o}){const[r,a]=l.useState(o),[m,d]=l.useState("qa2"),[s,n]=l.useState(!1),[t,e]=l.useState(""),b=s?v(t,r):void 0,A={title:"Pipeline Hierarchy",reorderHint:"Drag to reorder",stages:r,activeValue:m,onSelect:d,onReorder:a,addLabel:"Add environment",addStagePlaceholder:"Prod-US",onAddStage:()=>{e(""),n(!0)}};return s?i.jsx(h,{...A,addingStage:!0,addStageValue:t,addStageMessage:b,onAddStageValueChange:e,onAddStageConfirm:S=>{v(S,r)?.kind!=="error"&&(a(E=>[...E,{value:x(S),label:S,status:"idle"}]),n(!1),e(""))},onAddStageCancel:()=>{n(!1),e("")}}):i.jsx(h,{...A})}const c={render:()=>i.jsx(w,{initial:y})},f={title:"Pipeline Hierarchy",reorderHint:"Drag to reorder",stages:y,activeValue:"qa2",addLabel:"Add environment",addStagePlaceholder:"Prod-US",addingStage:!0,onAddStageValueChange:()=>{},onAddStageConfirm:()=>{},onAddStageCancel:()=>{},onReorder:()=>{}},g={parameters:{docs:{description:{story:"Static view of the panel with the inline add-environment editor open. The input is keyboard-focused on open; Enter confirms, Escape cancels."}}},args:{...f,addStageValue:"Staging-EU"}},p={parameters:{docs:{description:{story:"Error state — the typed value matches an existing stage. The confirm button is disabled and Enter is a no-op."}}},args:{...f,addStageValue:"QA1",addStageMessage:{kind:"error",text:'"QA1" already exists'}}},u={parameters:{docs:{description:{story:"Warning state — the typed value is similar to existing stages but not a duplicate. The confirm button stays enabled so the user can proceed if they intend to."}}},args:{...f,addStageValue:"QA3",addStageMessage:{kind:"warning",text:'Similar to "QA1" and "QA2" — still confirm?'}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledPanel initial={initialStages} />
}`,...c.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Static view of the panel with the inline add-environment editor open. The input is keyboard-focused on open; Enter confirms, Escape cancels.'
      }
    }
  },
  args: {
    ...staticEditorArgs,
    addStageValue: 'Staging-EU'
  }
}`,...g.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Error state — the typed value matches an existing stage. The confirm button is disabled and Enter is a no-op.'
      }
    }
  },
  args: {
    ...staticEditorArgs,
    addStageValue: 'QA1',
    addStageMessage: {
      kind: 'error',
      text: '"QA1" already exists'
    }
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Warning state — the typed value is similar to existing stages but not a duplicate. The confirm button stays enabled so the user can proceed if they intend to.'
      }
    }
  },
  args: {
    ...staticEditorArgs,
    addStageValue: 'QA3',
    addStageMessage: {
      kind: 'warning',
      text: 'Similar to "QA1" and "QA2" — still confirm?'
    }
  }
}`,...u.parameters?.docs?.source}}};const H=["Default","AddingEnvironment","AddingEnvironmentDuplicate","AddingEnvironmentSimilar"];export{g as AddingEnvironment,p as AddingEnvironmentDuplicate,u as AddingEnvironmentSimilar,c as Default,H as __namedExportsOrder,T as default};
