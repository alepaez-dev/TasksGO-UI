import{j as i}from"./jsx-runtime-u17CrQMm.js";import{r as c}from"./iframe-DbUjV2wB.js";import{P as f,t as y}from"./toStageValue-DHUdwlp2.js";import"./preload-helper-Rmt8i2Ou.js";import"./cn-2dOUpm6k.js";import"./useDragReorder-__y7GeK1.js";import"./Icon-CN46KgRq.js";import"./StatusDot-CzpU14d1.js";const L={title:"Components/PipelineHierarchyPanel",component:f,tags:["autodocs"],parameters:{docs:{description:{component:"A bordered panel listing pipeline stages with per-stage status dots, an optional active highlight, and an optional add-stage footer. When `onReorder` is provided, each row gets a drag handle for pointer (mouse and touch) drag-and-drop reorder and supports keyboard reorder via `Alt+ArrowUp` / `Alt+ArrowDown` on the focused drag handle."}}},decorators:[s=>i.jsx("div",{style:{padding:"24px",maxWidth:"320px"},children:i.jsx(s,{})})]},b=[{value:"qa1",label:"QA1",status:"success"},{value:"qa2",label:"QA2",status:"in-progress"},{value:"staging",label:"Staging",status:"idle"},{value:"prod",label:"Prod",status:"idle"}];function x(s,o){const a=s.trim();if(a.length===0)return;const d=y(a);if(d==="")return{kind:"error",text:"Stage name must include a letter or number"};const l=o.find(t=>t.value===d||t.label.toLowerCase()===a.toLowerCase());if(l)return{kind:"error",text:`"${l.label}" already exists`};const r=a.toLowerCase(),n=o.filter(t=>{const e=t.label.toLowerCase();return r.length>=2&&(e.startsWith(r)||r.startsWith(e))});if(n.length>0)return{kind:"warning",text:`Similar to ${n.map(e=>`"${e.label}"`).join(" and ")} — still confirm?`}}function w({initial:s}){const[o,a]=c.useState(s),[d,l]=c.useState("qa2"),[r,n]=c.useState(!1),[t,e]=c.useState(""),E=r?x(t,o):void 0,v={title:"Pipeline Hierarchy",reorderHint:"Drag to reorder",stages:o,activeValue:d,onSelect:l,onReorder:a,addLabel:"Add environment",addStagePlaceholder:"Prod-US",onAddStage:()=>{e(""),n(!0)}};return r?i.jsx(f,{...v,addingStage:!0,addStageValue:t,addStageMessage:E,onAddStageValueChange:e,onAddStageConfirm:S=>{a(h=>x(S,h)?.kind==="error"?h:[...h,{value:y(S),label:S,status:"idle"}]),n(!1),e("")},onAddStageCancel:()=>{n(!1),e("")}}):i.jsx(f,{...v})}const g={render:()=>i.jsx(w,{initial:b})},A={title:"Pipeline Hierarchy",reorderHint:"Drag to reorder",stages:b,activeValue:"qa2",addLabel:"Add environment",addStagePlaceholder:"Prod-US",addingStage:!0,onAddStageValueChange:()=>{},onAddStageConfirm:()=>{},onAddStageCancel:()=>{},onReorder:()=>{}},p={parameters:{docs:{description:{story:"Static view of the panel with the inline add-environment editor open. The input is keyboard-focused on open; Enter confirms, Escape cancels."}}},args:{...A,addStageValue:"Staging-EU"}},u={parameters:{docs:{description:{story:"Error state — the typed value matches an existing stage. The confirm button is disabled and Enter is a no-op."}}},args:{...A,addStageValue:"QA1",addStageMessage:{kind:"error",text:'"QA1" already exists'}}},m={parameters:{docs:{description:{story:"Warning state — the typed value is similar to existing stages but not a duplicate. The confirm button stays enabled so the user can proceed if they intend to."}}},args:{...A,addStageValue:"QA3",addStageMessage:{kind:"warning",text:'Similar to "QA1" and "QA2" — still confirm?'}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledPanel initial={initialStages} />
}`,...g.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};const M=["Default","AddingEnvironment","AddingEnvironmentDuplicate","AddingEnvironmentSimilar"];export{p as AddingEnvironment,u as AddingEnvironmentDuplicate,m as AddingEnvironmentSimilar,g as Default,M as __namedExportsOrder,L as default};
